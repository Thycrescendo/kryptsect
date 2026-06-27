# KryptSect Contracts

Deployable Celo smart contracts for KryptSect's GoodDollar-powered platform layer.

## Contract

`KryptSectRewards.sol` supports:

- G$ fee collection
- G$ staking
- G$ rewards
- Referral rewards
- Treasury controls
- Pause/unpause safety controls

## Install

```bash
npm install
cp .env.example .env
```

Fill `.env`:

```bash
PRIVATE_KEY=your_private_key
GOODDOLLAR_TOKEN=0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A
KRYPTSECT_TREASURY=your_treasury_wallet
```

## Compile

```bash
npm run compile
```

## Deploy to Celo Alfajores

Use a test G$ token or your deployed mock token address on Alfajores.

```bash
npm run deploy:alfajores
```

## Deploy to Celo Mainnet

```bash
npm run deploy:celo
```

## Security Notes

- Do not commit `.env`.
- Test on Alfajores before Celo mainnet.
- Run an audit before handling meaningful user funds.
- This contract is a platform utility layer, not a complete exchange matching engine.
