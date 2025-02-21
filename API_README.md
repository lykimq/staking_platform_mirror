# DEX Trading Pairs API

<video width="600" height="340" controls>
  <source src="./video/api_staking_platform.mp4" type="video/mp4">
    <a href="https://www.youtube.com/watch?v=uRBElK9Czt8">Watch the video on YouTube instead</a>
</video>

## Overview

This API fetches trading pairs and related information from a decentralized exchange (DEX). It interacts with **Factory, Pair, and ERC20** contracts using **Web3.js and ethers.js**.

## Key Features

1. Fetches Trading Pairs
- Retrieves all trading pairs from the **Factory Contract**.
- Fetches token metadata (name, symbol, decimals) and reserves for each pair.

2. Blockchain Interaction
- Connects to an Ethereum-compatible JSON-RPC provider.
- Uses **ABI definitions** to interact with **Factory, Pair, and ERC20** contracts.

3. Logs API Results
- Displays network connection details, trading pairs, and token data in the console.
- Demonstrates successful retrieval of trading pairs.

## Mock Contracts for Testing
To facilitate testing, this project includes **Solidity mock contracts** that simulate a DEX environment.

### MockPair Contract
A simplified mock implementation of a **DEX pair contract** for testing purposes.

**Features:**
- `initialize`: sets token addresses for the pair (can only be called once).
- `setReserves`: mocks reserve balances for tokens in the pair.
- `getReserves`: Returns reserves and last update timestamp.

Designed for use with testing framworks like Hardhat.

### MockFactory Contract
A simplified DEX factory contract that manages trading pairs.

**Features:**
-  Pair Creation (`createPair`):
    + Allow users to create a new token pair (liquidity pool).
    + Ensures both token addresses are unique and non-zero.
    + Deploys a new `MockPair` contract for each valid token pair.
    + Stores the created pair in a mapping (`getPair[token0][token1]`).
    + Emits a `PairCreated` event when a new pair is successfully created.
- Pair Tracking:
    + Maintains an array (`allPairs`) storing all created pairs.
    + Keeps a mapping (`getPair`) to easily retrieve the pair address for any two tokens.
- Read functions:
    + `allPairLength()`: Returns the total number of created pairs.

### MockToken Contract
A mock ERC-20 token implementation for testing.

**Features:**
- Inherits from OpenZeppelin's ERC-20 implementation.
- Mints an initial supply of 1,000,000 tokens to the deployer's address.

## Prerequisites

- Node.js version 18.18.0
- Hardhat local network
- Ethereum network

## Installation and Setup

1. Clone the repository
```
git clone https://github.com/yourusername/staking_platform_mirror.git
cd staking_platform_mirror
```

2. Install Dependencies

```
npm install
```

3. Start the API Server
```
npm start
```

4. Run Hardhat Local Network
```
npx hardhat node
```

5. Deploy Test Contracts
```
 npx hardhat run scripts/deployTestContracts.js --network localhost
```

6. Access the API
```
http://localhost:4000/api/v1/dex/pairs
```


## API Endpoints

### Get Trading Pairs

**Request:**
```
curl -X GET http://localhost:4000/api/v1/dex/pairs
```

**Response:**

```
{
    "success":true,
    "pairCount":"1",
    "pairs":[{
        "pairAddress":"0x75537828f2ce51be7289709686A69CbFDbB714F1",
        "token0":{
            "address":"0x5FbDB2315678afecb367f032d93F642f64180aa3",
            "name":"Token A",
            "symbol":"TKNA",
            "decimals":18,
            "reserve":"1000.0"},
        "token1":{
            "address":"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "name":"Token B",
            "symbol":"TKNB",
            "decimals":18,
            "reserve":"1000.0"
        },
        "lastUpdated":"2025-02-21T09:40:01.000Z"
    }]
}
```

**Response Details**
- Pair Contract Address
- Token Addresses
- Token Names and Symbols
- Token Decimals
- Current Reserves
- Last Updated Timestamp

## Additional Features

1. Additional API Endpoints
Get specific pair by token:

```
GET /api/v1/dex/pairs?token0Address=0x5FbDB2315678afecb367f032d93F642f64180aa3&token1Address=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Response:**
```
{
    "success":true,
    "pairCount":"1",
    "pairs":[{
        "pairAddress":"0x75537828f2ce51be7289709686A69CbFDbB714F1",
        "token0":{
            "address":"0x5FbDB2315678afecb367f032d93F642f64180aa3",
            "name":"Token A",
            "symbol":"TKNA",
            "decimals":18,
            "reserve":"1000.0"},
        "token1":{
            "address":"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "name":"Token B",
            "symbol":"TKNB",
            "decimals":18,
            "reserve":"1000.0"},
            "lastUpdated":"2025-02-21T10:00:01.000Z"
    }]
}
```

2. Planned Enhancements
- Price calculation
- Trading volume
- Liquidity metrics
- Historical data
- Price charts data

3. Performance Optimization
- Caching frequently accessed data
- Pagination for large number of pairs
- Websocket support for real-time updates

4. Security Measures
- Rate limiting
- Input validation
- Error handling
- Secure API endpoints
