import { HardhatUserConfig } from 'hardhat/types';
import { accounts } from './helpers/test-wallets';
import { NETWORKS_RPC_URL } from './helper-hardhat-config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import '@tenderly/hardhat-tenderly';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const MAINNET_FORK = process.env.MAINNET_FORK === 'true';
const REPORT_GAS = process.env.REPORT_GAS === 'true';

const mainnetFork = MAINNET_FORK
  ? {
    blockNumber: 12012081,
    url: NETWORKS_RPC_URL['rollux'],
  }
  : undefined;

// export hardhat config
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: { enabled: true, runs: 25000 },
          evmVersion: 'london',
        },
      },
    ],
  },
  typechain: {
    outDir: 'types',
    externalArtifacts: [
      'node_modules/@pollum-io/lending-core/artifacts/contracts/**/*[!dbg].json',
      'node_modules/@pollum-io/lending-core/artifacts/contracts/**/**/*[!dbg].json',
      'node_modules/@pollum-io/lending-core/artifacts/contracts/**/**/**/*[!dbg].json',
      'node_modules/@pollum-io/lending-core/artifacts/contracts/mocks/tokens/WETH9Mocked.sol/WETH9Mocked.json',
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
  networks: {
    hardhat: {
      hardfork: 'berlin',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      chainId: 31337,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: mainnetFork,
      allowUnlimitedContractSize: true,
    },
    ganache: {
      url: 'http://ganache:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  mocha: {
    timeout: 80000,
    bail: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    aclAdmin: {
      default: 0,
    },
    emergencyAdmin: {
      default: 0,
    },
    poolAdmin: {
      default: 0,
    },
    addressesProviderRegistryOwner: {
      default: 0,
    },
    treasuryProxyAdmin: {
      default: 1,
    },
    incentivesProxyAdmin: {
      default: 1,
    },
    incentivesEmissionManager: {
      default: 0,
    },
    incentivesRewardsVault: {
      default: 2,
    },
  },
  // Need to compile aave-v3 contracts due no way to import external artifacts for hre.ethers
  dependencyCompiler: {
    paths: [
      '@pollum-io/lending-core/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol',
      '@pollum-io/lending-core/contracts/protocol/configuration/PoolAddressesProvider.sol',
      '@pollum-io/lending-core/contracts/misc/AaveOracle.sol',
      '@pollum-io/lending-core/contracts/protocol/tokenization/AToken.sol',
      '@pollum-io/lending-core/contracts/protocol/tokenization/DelegationAwareAToken.sol',
      '@pollum-io/lending-core/contracts/protocol/tokenization/StableDebtToken.sol',
      '@pollum-io/lending-core/contracts/protocol/tokenization/VariableDebtToken.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/GenericLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/ValidationLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/ReserveLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/SupplyLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/EModeLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/BorrowLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/BridgeLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/logic/FlashLoanLogic.sol',
      '@pollum-io/lending-core/contracts/protocol/pool/Pool.sol',
      '@pollum-io/lending-core/contracts/protocol/pool/PoolConfigurator.sol',
      '@pollum-io/lending-core/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol',
      '@pollum-io/lending-core/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol',
      '@pollum-io/lending-core/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol',
      '@pollum-io/lending-core/contracts/deployments/ReservesSetupHelper.sol',
      '@pollum-io/lending-core/contracts/misc/AaveProtocolDataProvider.sol',
      '@pollum-io/lending-core/contracts/protocol/configuration/ACLManager.sol',
      '@pollum-io/lending-core/contracts/dependencies/weth/WETH9.sol',
      '@pollum-io/lending-core/contracts/mocks/helpers/MockIncentivesController.sol',
      '@pollum-io/lending-core/contracts/mocks/helpers/MockReserveConfiguration.sol',
      '@pollum-io/lending-core/contracts/mocks/oracle/CLAggregators/MockAggregator.sol',
      '@pollum-io/lending-core/contracts/mocks/tokens/MintableERC20.sol',
      '@pollum-io/lending-core/contracts/mocks/flashloan/MockFlashLoanReceiver.sol',
      '@pollum-io/lending-core/contracts/mocks/tokens/WETH9Mocked.sol',
      '@pollum-io/lending-core/contracts/mocks/upgradeability/MockVariableDebtToken.sol',
      '@pollum-io/lending-core/contracts/mocks/upgradeability/MockAToken.sol',
      '@pollum-io/lending-core/contracts/mocks/upgradeability/MockStableDebtToken.sol',
      '@pollum-io/lending-core/contracts/mocks/upgradeability/MockInitializableImplementation.sol',
      '@pollum-io/lending-core/contracts/mocks/helpers/MockPool.sol',
      '@pollum-io/lending-core/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol',
      '@pollum-io/lending-core/contracts/mocks/oracle/PriceOracle.sol',
      '@pollum-io/lending-core/contracts/mocks/tokens/MintableDelegationERC20.sol',
    ],
  },
  external: {
    contracts: [
      {
        artifacts: './temp-artifacts',
        deploy: 'node_modules/@pollum-io/lending-deploy/dist/deploy',
      },
    ],
  },
};

export default config;
