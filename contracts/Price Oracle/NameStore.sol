// SPDX-License-Identifier: MIT

pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NameStore is Ownable {
    mapping(uint256 => mapping(bytes32 => mapping(bytes32 => address))) public reservedNames;
    mapping(bytes32 => uint256) public reservedNamesVersion;

    mapping(bytes32 => bool) public registrationsPaused;

    event NameReserved(bytes32 indexed node, string name, address recipient);
    event ReservedNamesCleared(bytes32 indexed node);
    event RegistrationsPauseChanged(bytes32 indexed node, bool paused);

    function reserved(bytes32 node, bytes32 label) external view returns (address) {
        return reservedNames[reservedNamesVersion[node]][node][label];
    }

    function available(bytes32 node, bytes32 label) external view returns (bool) {
        return reservedNames[reservedNamesVersion[node]][node][label] == address(0) && !registrationsPaused[node];
    }

    function pauseRegistrations(bytes32 node) external onlyOwner {
        registrationsPaused[node] = true;
        emit RegistrationsPauseChanged(node, true);
    }

    function unpauseRegistrations(bytes32 node) external onlyOwner {
        registrationsPaused[node] = false;
        emit RegistrationsPauseChanged(node, false);
    }

    function reserve(bytes32 node, string calldata name, address recipient) external onlyOwner {
        _reserve(node, name, recipient);
    }

    function _reserve(bytes32 node, string calldata name, address recipient) internal {
        bytes32 label = keccak256(bytes(name));
        reservedNames[reservedNamesVersion[node]][node][label] = recipient;
        emit NameReserved(node, name, recipient);
    }

    function bulkReserve(bytes32 node, string[] calldata names, address[] calldata recipients) external onlyOwner {
        require(names.length == recipients.length, "Names and recipients must have the same length");
        for (uint i = 0; i < names.length; i++) {
            bytes32 label = keccak256(bytes(names[i]));
            reservedNames[reservedNamesVersion[node]][node][label] = recipients[i];
            emit NameReserved(node, names[i], recipients[i]);
        }
    }

    function clearReservedNames(bytes32 node) external onlyOwner {
        reservedNamesVersion[node]++;
        emit ReservedNamesCleared(node);
    }
}