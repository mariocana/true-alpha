// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrueAlphaSignals
 * @dev Simple contract to store trade signal hashes on Base Sepolia
 * @notice For hackathon demo purposes - production version would need more validation
 */
contract TrueAlphaSignals {
    struct Signal {
        bytes32 signalHash;
        address trader;
        uint256 timestamp;
        bool exists;
    }

    // Mapping from signal hash to Signal struct
    mapping(bytes32 => Signal) public signals;
    
    // Array to keep track of all signal hashes (for enumeration)
    bytes32[] public signalHashes;
    
    // Mapping from trader address to their signal hashes
    mapping(address => bytes32[]) public traderSignals;

    // Events
    event SignalStored(
        bytes32 indexed signalHash,
        address indexed trader,
        uint256 timestamp
    );

    /**
     * @dev Store a new trade signal hash
     * @param signalHash The keccak256 hash of the signal data
     */
    function storeSignal(bytes32 signalHash) external {
        require(!signals[signalHash].exists, "Signal already exists");
        
        signals[signalHash] = Signal({
            signalHash: signalHash,
            trader: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        signalHashes.push(signalHash);
        traderSignals[msg.sender].push(signalHash);
        
        emit SignalStored(signalHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Get signal details by hash
     * @param signalHash The hash to lookup
     * @return trader The address that posted the signal
     * @return timestamp When the signal was posted
     */
    function getSignal(bytes32 signalHash) 
        external 
        view 
        returns (address trader, uint256 timestamp) 
    {
        require(signals[signalHash].exists, "Signal does not exist");
        Signal memory signal = signals[signalHash];
        return (signal.trader, signal.timestamp);
    }

    /**
     * @dev Get all signals posted by a specific trader
     * @param trader The trader address
     * @return An array of signal hashes
     */
    function getTraderSignals(address trader) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return traderSignals[trader];
    }

    /**
     * @dev Get the total number of signals stored
     * @return The count of all signals
     */
    function getTotalSignals() external view returns (uint256) {
        return signalHashes.length;
    }

    /**
     * @dev Check if a signal exists
     * @param signalHash The hash to check
     * @return True if the signal exists
     */
    function signalExists(bytes32 signalHash) external view returns (bool) {
        return signals[signalHash].exists;
    }
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Go to Remix IDE (remix.ethereum.org)
 * 2. Create new file: TrueAlphaSignals.sol
 * 3. Paste this code
 * 4. Compile with Solidity 0.8.20+
 * 5. Deploy to Base Sepolia:
 *    - Switch MetaMask to Base Sepolia
 *    - Select "Injected Provider - MetaMask" in Remix
 *    - Click Deploy
 * 6. Copy deployed contract address
 * 7. Update CONTRACT_ADDRESS in hooks/useWriteSignal.ts
 * 
 * BASE SEPOLIA TESTNET:
 * - RPC: https://sepolia.base.org
 * - Chain ID: 84532
 * - Faucet: https://www.base.org/faucet
 * - Explorer: https://sepolia.basescan.org
 */
