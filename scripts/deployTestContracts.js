const hre = require("hardhat");

async function main() {

    console.log("Deploying test contracts...");

    // Deploy Mock ERC20 Tokens
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    const MockFactory = await hre.ethers.getContractFactory("MockFactory");
    const MockPair = await hre.ethers.getContractFactory("MockPair");

    // Deploy Mock ERC20 Tokens
    console.log("Deploying Mock Token A...");
    const tokenA = await MockToken.deploy("Token A", "TKNA");
    await tokenA.deployed();
    console.log("Token A deployed to:", tokenA.address);

    console.log("Deploying Mock Token B...");
    const tokenB = await MockToken.deploy("Token B", "TKNB");
    await tokenB.deployed();
    console.log("Token B deployed to:", tokenB.address);

    // Deploy Mock DEX Factory
    console.log("Deploying Mock DEX Factory...");
    const factory = await MockFactory.deploy();
    await factory.deployed();
    console.log("Mock DEX Factory deployed to:", factory.address);

    // Create a pair between tokenA and tokenB
    console.log("Creating pair between Token A and Token B...");
    await factory.createPair(tokenA.address, tokenB.address);
    const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
    console.log("Pair address:", pairAddress);

    // Initialize the pair
    const pair = await MockPair.attach(pairAddress);
    console.log("Initializing pair...");
    const initTx = await pair.initialize(tokenA.address, tokenB.address);
    await initTx.wait();
    console.log("Pair initialized");

    // Add some liquidity to the pair (mock reserves)
    console.log("Adding liquidity to the pair...");
    const setReservesTx = await pair.setReserves(
        ethers.utils.parseEther("1000"), // 1000 tokens A
        ethers.utils.parseEther("1000") // 1000 tokens B
    );
    await setReservesTx.wait();
    console.log("Liquidity added to the pair");

    console.log("Test setup complete. You can now interact with the contracts.");

    // Verify setup
    const [reserve0, reserve1] = await pair.getReserves();
    console.log("Reserves set to:", {
        reserve0: ethers.utils.formatEther(reserve0),
        reserve1: ethers.utils.formatEther(reserve1)
    });


    // Save deployment addresses
    const deploymentAddresses = {
        tokenA: tokenA.address,
        tokenB: tokenB.address,
        factory: factory.address,
        pair: pairAddress
    };

    console.log("Deployment Info:", deploymentAddresses);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });