// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.33;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {xByteFactory} from "../src/xByteFactory.sol";
import {xByteVault} from "../src/xByteVault.sol";

contract xByteVaultTest is Test {
    xByteFactory public factory;
    xByteVault public vault;

    function setUp() public {
        vm.etch(address(1337), bytes("test"));
        factory = new xByteFactory(address(1337));
    }

    function test_createVault() public {
        factory.createVault();
        (, address owner, uint8 fee) = factory.vaults(msg.sender);
        assertEq(owner, msg.sender);
        assertEq(fee, 1);
    }
}
