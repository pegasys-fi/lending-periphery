// @ts-ignore
import { HardhatNetworkForkingUserConfig, HardhatUserConfig } from 'hardhat/types';
import { eEthereumNetwork, iParamsPerNetwork } from './helpers/types';

require('dotenv').config();

const FORK = process.env.FORK || '';
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
  ? parseInt(process.env.FORK_BLOCK_NUMBER)
  : 0;

const GWEI = 1000 * 1000 * 1000;

export const buildForkConfig = (): HardhatNetworkForkingUserConfig | undefined => {
  let forkMode: HardhatNetworkForkingUserConfig | undefined;
  if (FORK) {
    forkMode = {
      url: NETWORKS_RPC_URL[FORK as eEthereumNetwork],
    };
    if (FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK as eEthereumNetwork]) {
      forkMode.blockNumber = FORK_BLOCK_NUMBER || BLOCK_TO_FORK[FORK as eEthereumNetwork];
    }
  }
  return forkMode;
};

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
  [eEthereumNetwork.coverage]: 'http://localhost:8555',
  [eEthereumNetwork.hardhat]: 'http://localhost:8545',
  [eEthereumNetwork.rollux]: `https://rpc.rollux.com`,
};

export const BLOCK_TO_FORK: iParamsPerNetwork<number | undefined> = {
  [eEthereumNetwork.rollux]: undefined,
  [eEthereumNetwork.coverage]: undefined,
  [eEthereumNetwork.hardhat]: undefined,
};
