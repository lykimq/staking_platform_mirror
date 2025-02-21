const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, '../config/config.env') });

if (!process.env.FACTORY_ADDRESS || !process.env.RPC_URL) {
    console.error("Error loading environment variables:", result.error);
    process.exit(1);
}

console.log('Environment variables loaded successfully', {
    FACTORY_ADDRESS: process.env.FACTORY_ADDRESS,
    RPC_URL: process.env.RPC_URL,
    NODE_ENV: path.resolve(__dirname, '../config/config.env')
});

const { ethers } = require("ethers");

// ABI for interacting with DEX contracts
const FACTORY_ABI = [
    "function allPairs(uint) external view returns (address pair)",
    "function allPairsLength() external view returns (uint)",
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    "function createPair(address tokenA, address tokenB) external returns (address pair)",
];

// ABI for interacting with pair contracts
const PAIR_ABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function initialize(address _token0, address _token1) external",
];

// ABI for interacting with ERC20 contracts
const TOKEN_ABI = [
    "function name() external view returns (string)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)",
    "function balanceOf(address account) external view returns (uint256)",
];

// Local testnet address (replace with actual address for production)
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS;

exports.getTradingPairs = async (req, res) => {
    try {
        console.log("Connnecting to RPC_URL:", process.env.RPC_URL);
        console.log("Factory Address:", FACTORY_ADDRESS);

        if (!process.env.FACTORY_ADDRESS) {
            return res.status(400).json({
                success: false,
                message: "Factory address is not set"
            });
        }

        // Connect to local network
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

        // Test provider connection
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.name);

        const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

        // Fetch total number of pairs
        const pairCount = await factory.allPairsLength();
        console.log(`Total trading pairs: ${pairCount.toString()}`);

        // Fetch all pairs
        const pairs = [];
        for (let i = 0; i < pairCount.toNumber(); i++) {
            const pairAddress = await factory.allPairs(i);
            console.log(`Fetching pair ${i + 1}: ${pairAddress}`);

            const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);

            // Get token addresses
            const token0Address = await pairContract.token0();
            const token1Address = await pairContract.token1();
            console.log(`Token 0 Address: ${token0Address}`);
            console.log(`Token 1 Address: ${token1Address}`);

            // Get token contracts
            const token0Contract = new ethers.Contract(token0Address, TOKEN_ABI, provider);
            const token1Contract = new ethers.Contract(token1Address, TOKEN_ABI, provider);

            // Get token information
            const [
                token0Name, token0Symbol, token0Decimals,
                token1Name, token1Symbol, token1Decimals,
                reserves
            ] = await Promise.all([
                token0Contract.name(),
                token0Contract.symbol(),
                token0Contract.decimals(),
                token1Contract.name(),
                token1Contract.symbol(),
                token1Contract.decimals(),
                pairContract.getReserves(),
            ]);

            // Calculate liquidity and format pair information
            const pairInfo = {
                pairAddress,
                token0: {
                    address: token0Address,
                    name: token0Name,
                    symbol: token0Symbol,
                    decimals: token0Decimals,
                    reserve: ethers.utils.formatUnits(reserves[0], token0Decimals),
                },
                token1: {
                    address: token1Address,
                    name: token1Name,
                    symbol: token1Symbol,
                    decimals: token1Decimals,
                    reserve: ethers.utils.formatUnits(reserves[1], token1Decimals),
                },
                lastUpdated: new Date(reserves[2] * 1000).toISOString(),
            }

            pairs.push(pairInfo);
            console.log(`Fetched pair ${i + 1}:`, pairInfo);
        }

        return res.status(200).json({
            success: true,
            pairCount: pairCount.toString(),
            pairs,
        });

    } catch (error) {
        console.error("Error fetching trading pairs:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching trading pairs",
            error: error.message
        });
    }
};
