import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const gDollar = process.env.GOODDOLLAR_TOKEN;
  const treasury = process.env.KRYPTSECT_TREASURY || deployer.address;

  if (!gDollar) {
    throw new Error("Missing GOODDOLLAR_TOKEN in .env");
  }

  console.log("Deploying KryptSectRewards with:");
  console.log("Deployer:", deployer.address);
  console.log("G$ token:", gDollar);
  console.log("Treasury:", treasury);

  const KryptSectRewards = await ethers.getContractFactory("KryptSectRewards");
  const contract = await KryptSectRewards.deploy(gDollar, treasury, deployer.address);
  await contract.waitForDeployment();

  console.log("KryptSectRewards deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
