# Simple Bank Exercise

In this exercise you are going to implement the SimpleBank.sol contract.
The bank should be able to enroll new users and allow them to make deposits and widthdrawals!
The contract contains the framework and comments to implement the contract. Follow the comments outlined to implement it. 

The use case of The Simple Bank contract is as follows
- The contract will maintain information about registered users and their balances
- Users will be able to register in the Simple Bank
- Users, once registered, can make deposits into their account
- Users can check their account balance at any time
- Users can withdraw part or all of the balance in their account, as long as there is a balance for it.


## Requirements
1. Create a new *Hardhat* project, add the provided contract
2. Implement all functions, events and anything mentioned in code comments in the contract

## Bonus Points
In addition to the required features, feel free to add the extra bonus features to make your code stand out from others.

### Bonus: 1 Modifier

1. Create a `modifier()` that validates in the `deposit(`) and `withdraw()` functions that que caller is a enrolled user

2. Create a `modifier()` that validates in the `deposit()` and `withdraw()` functions that the amounts passed by parameter are greater than zero

### Bonus: 2 Struct

Create a `Struct{}` that contains user information (e.g. userId, enrolled, balance) and replace the *balances* and *enrolled* `mapping()`s 

```
mapping(address => uint) private balances;
mapping(address => bool) public enrolled;
```

By a new `mapping()` of `(address => structUser)`. 
Modify the corresponding functions according to this new `mapping()`.

### Bonus: 3 Tests

Create a test file for the SimpleBank contract that allows you to test:
1. Enroll user and check if its correctly mark enrolled
2. Make a deposit and check if the balance is correct
3. Only a enrolled user can make a deposit
4. Withdraw a correct amount
5. Not be able to withdraw more than has been deposited

