# API Documentation

## Overview

This API provides comprehensive information about trading pairs on a decentralized exchange (DEX). It includes detailed token information, current liquidity, and historical data for each pair.

## Prerequisites

- Node.js version 18.18.0
- Hardhat local network
- Ethereum network

## Installation

1. Clone the repository
```
git clone https://github.com/yourusername/staking_platform_mirror.git
```

2. Install dependencies

```
npm install
```

3. Start the server
```
npm start
```

4. Access the API
```
http://localhost:4000/api/v1/dex/pairs
```

5. Run Hardhat local network
```
npx hardhat node
```

6. Deploy test contract on Hardhat local network
```
 npx hardhat run scripts/deployTestContracts.js --network localhost
```

## Get Trading Pairs

### Request

```
curl -X GET http://localhost:4000/api/v1/dex/pairs
```

### Response

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

The API provides:
1. Trading Pair Information:
- Pair contract address
- Token addresses
- Token names and symbols
- Token decimals
- Current reserves for each token
- Last updated timestamp

2. Key Features:
- Fetches all trading pairs from the DEX factory contract
- Gets detailed token information for each token in the pair
- Shows current liquidity (reserves) for each pair
- Include timestamp for when the data was last updated

3. Error Handling:
- Proper error response if something goes wrong
- Success/failure status in response

## Additional

1. Additional Endpoints
- Get specific pair by token:
```
GET /api/v1/dex/pairs?token0Address=0x5FbDB2315678afecb367f032d93F642f64180aa3&token1Address=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```
- Get pair by pair address
```
GET /api/v1/dex/pairs/:pairAddress
```
- Get historical data
```
GET /api/v1/dex/pairs/:pairAddress/history
```

2. Additional Features
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
