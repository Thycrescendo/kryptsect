// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title KryptSectRewards
/// @notice G$ utility contract for KryptSect: fee collection, staking, rewards, and referrals on Celo.
/// @dev This contract does not custody user trading positions or match orders. Use it as the first on-chain GoodDollar integration layer.
contract KryptSectRewards is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable gDollar;
    address public treasury;

    uint256 public platformFeeBps = 25; // 0.25%
    uint256 public referralRewardBps = 1000; // 10% of collected fee
    uint256 public rewardRatePerSecond = 0; // funded externally by owner/treasury
    uint256 public accRewardPerShare;
    uint256 public lastRewardTime;
    uint256 public totalStaked;

    struct UserInfo {
        uint256 staked;
        uint256 rewardDebt;
        uint256 totalFeesPaid;
        uint256 totalRewardsClaimed;
        address referrer;
    }

    mapping(address => UserInfo) public users;
    mapping(address => uint256) public referralEarnings;

    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);
    event ReferralRewardUpdated(uint256 oldRewardBps, uint256 newRewardBps);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event ReferrerSet(address indexed user, address indexed referrer);
    event FeePaid(address indexed user, uint256 grossAmount, uint256 feeAmount, address indexed referrer);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardsFunded(address indexed funder, uint256 amount);

    constructor(address _gDollar, address _treasury, address initialOwner) Ownable(initialOwner) {
        require(_gDollar != address(0), "G$ token required");
        require(_treasury != address(0), "Treasury required");
        gDollar = IERC20(_gDollar);
        treasury = _treasury;
        lastRewardTime = block.timestamp;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Treasury required");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setPlatformFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 200, "Fee too high"); // max 2%
        emit PlatformFeeUpdated(platformFeeBps, _feeBps);
        platformFeeBps = _feeBps;
    }

    function setReferralRewardBps(uint256 _rewardBps) external onlyOwner {
        require(_rewardBps <= 5000, "Referral reward too high"); // max 50% of fee
        emit ReferralRewardUpdated(referralRewardBps, _rewardBps);
        referralRewardBps = _rewardBps;
    }

    function setRewardRatePerSecond(uint256 _rate) external onlyOwner {
        updatePool();
        emit RewardRateUpdated(rewardRatePerSecond, _rate);
        rewardRatePerSecond = _rate;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function fundRewards(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount required");
        gDollar.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardsFunded(msg.sender, amount);
    }

    function setReferrer(address referrer) external whenNotPaused {
        require(referrer != address(0), "Invalid referrer");
        require(referrer != msg.sender, "Cannot refer self");
        require(users[msg.sender].referrer == address(0), "Referrer already set");
        users[msg.sender].referrer = referrer;
        emit ReferrerSet(msg.sender, referrer);
    }

    /// @notice Collects G$ trading/platform fee from a user after frontend/backend computes notional amount.
    /// @param grossAmount Gross trade or service amount denominated in G$ smallest units.
    function payTradingFee(uint256 grossAmount) external nonReentrant whenNotPaused {
        require(grossAmount > 0, "Amount required");
        uint256 feeAmount = (grossAmount * platformFeeBps) / 10_000;
        require(feeAmount > 0, "Fee too small");

        address referrer = users[msg.sender].referrer;
        uint256 referralAmount = 0;

        if (referrer != address(0) && referralRewardBps > 0) {
            referralAmount = (feeAmount * referralRewardBps) / 10_000;
            referralEarnings[referrer] += referralAmount;
            gDollar.safeTransferFrom(msg.sender, referrer, referralAmount);
        }

        gDollar.safeTransferFrom(msg.sender, treasury, feeAmount - referralAmount);
        users[msg.sender].totalFeesPaid += feeAmount;

        emit FeePaid(msg.sender, grossAmount, feeAmount, referrer);
    }

    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount required");
        updatePool();

        UserInfo storage user = users[msg.sender];
        if (user.staked > 0) {
            _claim(msg.sender);
        }

        gDollar.safeTransferFrom(msg.sender, address(this), amount);
        user.staked += amount;
        totalStaked += amount;
        user.rewardDebt = (user.staked * accRewardPerShare) / 1e18;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        UserInfo storage user = users[msg.sender];
        require(amount > 0, "Amount required");
        require(user.staked >= amount, "Insufficient stake");

        updatePool();
        _claim(msg.sender);

        user.staked -= amount;
        totalStaked -= amount;
        user.rewardDebt = (user.staked * accRewardPerShare) / 1e18;
        gDollar.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        updatePool();
        _claim(msg.sender);
        users[msg.sender].rewardDebt = (users[msg.sender].staked * accRewardPerShare) / 1e18;
    }

    function pendingRewards(address account) external view returns (uint256) {
        UserInfo memory user = users[account];
        uint256 localAccRewardPerShare = accRewardPerShare;

        if (block.timestamp > lastRewardTime && totalStaked > 0) {
            uint256 elapsed = block.timestamp - lastRewardTime;
            uint256 reward = elapsed * rewardRatePerSecond;
            localAccRewardPerShare += (reward * 1e18) / totalStaked;
        }

        return ((user.staked * localAccRewardPerShare) / 1e18) - user.rewardDebt;
    }

    function updatePool() public {
        if (block.timestamp <= lastRewardTime) return;
        if (totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }

        uint256 elapsed = block.timestamp - lastRewardTime;
        uint256 reward = elapsed * rewardRatePerSecond;
        accRewardPerShare += (reward * 1e18) / totalStaked;
        lastRewardTime = block.timestamp;
    }

    function _claim(address account) internal {
        UserInfo storage user = users[account];
        uint256 pending = ((user.staked * accRewardPerShare) / 1e18) - user.rewardDebt;

        if (pending > 0) {
            uint256 balance = gDollar.balanceOf(address(this));
            uint256 availableRewards = balance > totalStaked ? balance - totalStaked : 0;
            uint256 payout = pending > availableRewards ? availableRewards : pending;

            if (payout > 0) {
                user.totalRewardsClaimed += payout;
                gDollar.safeTransfer(account, payout);
                emit RewardsClaimed(account, payout);
            }
        }
    }
}
