export enum eEthereumNetwork {
  rollux = 'rollux',
  coverage = 'coverage',
  hardhat = 'hardhat',
}

export type iParamsPerNetwork<T> = iEthereumParamsPerNetwork<T>;

export interface iEthereumParamsPerNetwork<T> {
  [eEthereumNetwork.coverage]: T;
  [eEthereumNetwork.rollux]: T;
  [eEthereumNetwork.hardhat]: T;
}
