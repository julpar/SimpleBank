// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

contract SimpleBank {

    // Main states
    mapping(address => uint256) private balances;
    mapping(address => bool) private enrolled;
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
        require(enrolled[msg.sender] == true, "Account is not enrolled");
        _;
    }
    
    receive() external payable {
        deposit();
    }
    
    /// @notice Get balance
    /// @return The balance of the user
    function getBalance() shouldBeEnrolled external view returns (uint256) {
        return balances[msg.sender];
    }

    /// @notice Enroll a customer with the bank
    /// @return The users enrolled status
    // Emit the appropriate event
    function enroll() public returns (bool) {
        require(!enrolled[msg.sender], "User already enrolled");
        emit LogEnrolled(msg.sender);
        enrolled[msg.sender] = true;
        return true;
    }

    /// @notice Deposit ether into bank
    /// @return The balance of the user after the deposit is made
    // This function can receive ether
    // Users should be enrolled before they can make deposits
    function deposit() public shouldBeEnrolled payable returns (uint) {
        require(msg.value > 0, "Deposit must be greater than 0");
        emit LogDepositMade(msg.sender, msg.value);
        balances[msg.sender] += msg.value;
        return balances[msg.sender];
    }

    /// @notice Withdraw ether from bank
    /// @param withdrawAmount amount you want to withdraw
    /// @return The balance remaining for the user
    // Emit the appropriate event
    function withdraw(uint withdrawAmount) public shouldBeEnrolled returns (uint) {
        require(balances[msg.sender] >= withdrawAmount, "Insufficient funds");
        uint newBalance = balances[msg.sender] - withdrawAmount;
    
        emit LogWithdrawalMade(msg.sender, withdrawAmount, newBalance);
        balances[msg.sender] = newBalance;
        return newBalance;
    }

    /// @notice Withdraw remaining ether from bank
    /// @return bool transaction success
    // Emit the appropriate event
    function withdrawAll() public shouldBeEnrolled returns (bool) {
        require(balances[msg.sender] > 0, "Insufficient funds");
        emit LogWithdrawalMade(msg.sender, balances[msg.sender], 0);
        balances[msg.sender] = 0;
        return true;
    }

    /// @notice Check for enrolled status
    /// @return bool if address is enrolled
    function isEnrolled(address _address) public view returns (bool) {
        return enrolled[_address] == true;
    }
}
