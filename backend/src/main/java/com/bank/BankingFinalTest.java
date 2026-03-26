package com.bank;

import java.math.BigDecimal;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.bank.exceptions.AccountNotFoundException;
import com.bank.exceptions.InsufficientBalanceException;
import com.bank.exceptions.InvalidAmountException;
import com.bank.model.Account;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.service.AccountService;
import com.bank.service.AlertService;
import com.bank.service.TransactionService;

public class BankingFinalTest {
	private static final Logger logger = LoggerFactory.getLogger(BankingFinalTest.class);

	public static void main(String[] args) {
		
		Scanner sc = new Scanner(System.in);
		
		AccountRepository accRepo = new AccountRepository();
		AccountService accService = new AccountService(accRepo);
		TransactionRepository trxRepo = new TransactionRepository();
		AlertService alertService = new AlertService(new BigDecimal("1000"));
		TransactionService trxService = new TransactionService(accService, trxRepo, alertService);
		
		logger.info("===========================================================================");
		logger.info("WELCOME TO OUR BANKING APPLICATION");
		logger.info("===========================================================================");
		
		boolean running = true;
		
		while(running) {
			
			logger.info("\nChoose an option");
			logger.info("1. Create Account");
			logger.info("2. Deposit Money");
			logger.info("3. Withdraw Money");
			logger.info("4. Transfer Money");
			logger.info("5. Show Account Details");
			logger.info("6. List All Accounts");
			logger.info("7. Exit");
			
			logger.info("Enter Choice: ");
			String choiceStr = sc.nextLine().trim();
			int choice = Integer.parseInt(choiceStr);
			switch(choice) {
				case 1:
					logger.info("Enter name: ");
					String name = sc.nextLine().trim();
					logger.info("Enter email: ");
					String email = sc.nextLine().trim();
					logger.info("Enter Opening Balance: ");
					BigDecimal openingBalance = new BigDecimal(sc.nextLine().trim());
					try {
						Account acc = accService.createAccount(name, email, openingBalance);
						logger.info("Account created successfully! Account Number: {}", acc.getAccountNumber());
					} catch (InvalidAmountException e) {
						logger.error("Invalid amount for account creation: {}", e.getMessage());
					}
					break;
				
				case 2:
					logger.info("Enter Account Number: ");
					String deptAcc = sc.nextLine().trim();
					logger.info("Enter the Amount to Deposit: ");
					BigDecimal deptAmount = new BigDecimal(sc.nextLine().trim());
					try {
						trxService.deposite(deptAcc, deptAmount);
						logger.info("Deposit successful");
					} catch (AccountNotFoundException | InvalidAmountException e) {
						logger.error("Deposit failed: {}", e.getMessage());
					}
					break;
					
				case 3:
					logger.info("Enter Account Number: ");
					String withAcc = sc.nextLine().trim();
					logger.info("Enter the Amount to Withdraw: ");
					BigDecimal withAmt = new BigDecimal(sc.nextLine().trim());
					try {
						trxService.withdraw(withAcc, withAmt);
						logger.info("Withdraw successful");
					} catch (AccountNotFoundException | InvalidAmountException | InsufficientBalanceException e) {
						logger.error("Withdraw failed: {}", e.getMessage());
					}
					break;
					
				case 4:
					logger.info("Enter Sender Account Number: ");
					String sender = sc.nextLine().trim();
					logger.info("Enter Receiver Account Number: ");
					String receiver = sc.nextLine().trim();
					logger.info("Enter Amount for transfer: ");
					BigDecimal tAmt = new BigDecimal(sc.nextLine().trim());
					try {
						trxService.transfer(sender, receiver, tAmt);
						logger.info("Transfer successful");
					} catch (InvalidAmountException | AccountNotFoundException | InsufficientBalanceException e) {
						logger.error("Transfer failed: {}", e.getMessage());
					}
					break;
					
				case 5:
					logger.info("Enter Account Number to get Details: ");
					String accNo = sc.nextLine().trim();
					try {
						Account account = accService.getAccount(accNo);
						logger.info("Account Details: {}", account);
					} catch (AccountNotFoundException e) {
						logger.error("Account not found: {}", e.getMessage());
					}
					break;
					
				case 6:
					logger.info("Listing All the Accounts..!");
					for(Account account : accService.listAllAccounts()) {
						logger.info("Account: {}", account);
					}
					break;
					
				case 7: 
					logger.info("Thank you for using our Banking Application!");
					running = false;
					break;
					
				default:
					logger.error("Invalid Choice. Please Try Again!");
					
			}
			
		}	

	}

}

