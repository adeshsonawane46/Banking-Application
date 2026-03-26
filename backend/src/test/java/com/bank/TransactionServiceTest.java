package com.bank;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bank.exceptions.AccountNotFoundException;
import com.bank.exceptions.InsufficientBalanceException;
import com.bank.exceptions.InvalidAmountException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.service.AccountService;
import com.bank.service.AlertService;
import com.bank.service.TransactionService;

public class TransactionServiceTest {
    private TransactionService trxService;
    private AccountService accService;
    private AccountRepository repo;

    @BeforeEach
    void setUp() throws InvalidAmountException {
        repo = new AccountRepository();
        accService = new AccountService(repo);
        TransactionRepository trxRepo = new TransactionRepository();
        AlertService alertService = new AlertService(new BigDecimal("500"));
        trxService = new TransactionService(accService, trxRepo, alertService);
        // Create test accounts
        accService.createAccount("User1", "u1@email.com", new BigDecimal("5000"));
        accService.createAccount("User2", "u2@email.com", new BigDecimal("2000"));
    }

    @Test
    void testDeposit() throws InvalidAmountException, AccountNotFoundException {
        String accNo = repo.findAll().iterator().next().getAccountNumber();
        BigDecimal initial = accService.getAccount(accNo).getOpeningBalance();
        trxService.deposite(accNo, new BigDecimal("1000"));
        BigDecimal newBalance = accService.getAccount(accNo).getOpeningBalance();
        assertEquals(0, newBalance.compareTo(initial.add(new BigDecimal("1000"))));
    }

    @Test
    void testWithdraw() throws InvalidAmountException, AccountNotFoundException, InsufficientBalanceException {
        String accNo = repo.findAll().iterator().next().getAccountNumber();
        BigDecimal initial = accService.getAccount(accNo).getOpeningBalance();
        trxService.withdraw(accNo, new BigDecimal("1000"));
        BigDecimal newBalance = accService.getAccount(accNo).getOpeningBalance();
        assertEquals(0, newBalance.compareTo(initial.subtract(new BigDecimal("1000"))));
    }

    @Test
    void testTransfer() throws InvalidAmountException, AccountNotFoundException, InsufficientBalanceException {
        String fromAcc = repo.findAll().stream().findFirst().get().getAccountNumber();
        String toAcc = repo.findAll().stream().skip(1).findFirst().get().getAccountNumber();
        BigDecimal fromInitial = accService.getAccount(fromAcc).getOpeningBalance();
        BigDecimal toInitial = accService.getAccount(toAcc).getOpeningBalance();
        trxService.transfer(fromAcc, toAcc, new BigDecimal("500"));
        assertEquals(0, accService.getAccount(fromAcc).getOpeningBalance().compareTo(fromInitial.subtract(new BigDecimal("500"))));
        assertEquals(0, accService.getAccount(toAcc).getOpeningBalance().compareTo(toInitial.add(new BigDecimal("500"))));
    }

    @Test
    void testWithdrawInsufficientBalance() {
        String accNo = repo.findAll().iterator().next().getAccountNumber();
        assertThrows(InsufficientBalanceException.class, () -> {
            trxService.withdraw(accNo, new BigDecimal("10000"));
        });
    }
}

