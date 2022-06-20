// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract funding{
    mapping (uint=>address) private funders;
    uint public totalFunders;

    receive() external payable{}

    function transferFund() external payable{
        funders[totalFunders] = msg.sender;
    }

    function withdraw(uint amount) external{ 
        require(amount<=2000000000000000000,
         "can't withdraw more than 2 ethers");
        payable(msg.sender).transfer(amount);
    }
}