// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {xByteVault} from "../src/xByteVault.sol";
import {xByteFactory} from "../src/xByteFactory.sol";

contract xByteFactoryScript is Script {
    xByteFactory public factory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        bytes memory initCode = type(xByteVault).creationCode;
        factory = new xByteFactory(initCode);

        vm.stopBroadcast();
    }
}
