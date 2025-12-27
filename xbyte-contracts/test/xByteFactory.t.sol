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

    function test_withdrawNative() public {
        // Before Withdraw
        uint256 beforeFactory = address(factory).balance;
        uint256 beforeOwner = factory.owner().balance;

        // After Withdraw
        vm.deal(address(factory), 100);
        factory.withdraw();

        // After Withdraw
        uint256 afterFactory = address(factory).balance;
        uint256 afterOwner = factory.owner().balance;

        assertEq(afterFactory - beforeFactory, 0);
        assertEq(afterOwner - beforeOwner, 100);
    }

    receive() external payable {}
}
