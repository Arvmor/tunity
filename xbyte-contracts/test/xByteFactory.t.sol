// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;

import {Test} from "forge-std/Test.sol";
import {xByteFactory} from "../src/xByteFactory.sol";
import {xByteVault} from "../src/xByteVault.sol";

contract xByteFactoryTest is Test {
    xByteFactory public factory;

    function setUp() public {
        // Deploy time bytecode of xByteVault
        bytes memory initCode = type(xByteVault).creationCode;
        factory = new xByteFactory(initCode);
    }

    function test_deploy_address() public {
        factory.createVault();
    }
}
