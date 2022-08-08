// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

contract SimpleBank {
    
    struct Customer {
        bool enrolled;
        uint balance;
    }
    
    mapping(address => Customer) private clients;
    address public owner;
    
    //Events
    event LogEnrolled(address _accountAddress);
    event LogDepositMade(address _accountAddress, uint256 _amount);
    event LogWithdrawalMade(address _accountAddress, uint256 _amount, uint256 _newBalance);
    
    constructor() {
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
    }
    
    modifier shouldBeEnrolled() {
        require(clients[msg.sender].enrolled == true, "Account is not enrolled");
        _;
    }
    
    receive() external payable {
        deposit();
    }
    
    /// @notice Get balance
    /// @return The balance of the user
    function getBalance() shouldBeEnrolled external view returns (uint256) {
        return clients[msg.sender].balance;
    }

    /// @notice Enroll a customer with the bank
    /// @return The users enrolled status
    // Emit the appropriate event
    function enroll() public returns (bool) {
        require(!clients[msg.sender].enrolled, "User already enrolled");
        emit LogEnrolled(msg.sender);
        clients[msg.sender].enrolled = true;
        return true;
    }

    /// @notice Deposit ether into bank
    /// @return The balance of the user after the deposit is made
    function deposit() public shouldBeEnrolled payable returns (uint) {
        require(msg.value > 0, "Deposit must be greater than 0");
        emit LogDepositMade(msg.sender, msg.value);
        clients[msg.sender].balance += msg.value;
        return clients[msg.sender].balance;
    }

    /// @notice Withdraw ether from bank
    /// @param withdrawAmount amount you want to withdraw
    /// @return The balance remaining for the user
    function withdraw(uint withdrawAmount) public shouldBeEnrolled returns (uint) {
        require(clients[msg.sender].balance >= withdrawAmount, "Insufficient funds");
        uint newBalance = clients[msg.sender].balance - withdrawAmount;
    
        emit LogWithdrawalMade(msg.sender, withdrawAmount, newBalance);
        clients[msg.sender].balance = newBalance;
        return newBalance;
    }

    /// @notice Withdraw remaining ether from bank
    /// @return bool transaction success
    // Emit the appropriate event
    function withdrawAll() public shouldBeEnrolled returns (bool) {
        require(clients[msg.sender].balance > 0, "Insufficient funds");
        emit LogWithdrawalMade(msg.sender, clients[msg.sender].balance, 0);
        clients[msg.sender].balance = 0;
        return true;
    }

    /// @notice Check for enrolled status
    /// @return bool if address is enrolled
    function isEnrolled(address _address) public view returns (bool) {
        return clients[_address].enrolled == true;
    }
}
