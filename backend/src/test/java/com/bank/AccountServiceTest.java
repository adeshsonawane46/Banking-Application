package com.bank;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.bank.exceptions.InvalidAmountException;
import com.bank.model.Account;
import com.bank.repository.AccountRepository;
import com.bank.service.AccountService;

public class AccountServiceTest {
    private AccountService service;
    private AccountRepository repo;

    @BeforeEach
    void setUp() {
        repo = new AccountRepository();
        service = new AccountService(repo);
    }

    @Test
    void testCreateAccount() throws InvalidAmountException {
        Account acc = service.createAccount("Test User", "test@email.com", new BigDecimal("1000"));
        assertNotNull(acc);
        assertEquals("Test User", acc.getHolderName());
        assertEquals("test@email.com", acc.getEmail());
        assertEquals(0, acc.getOpeningBalance().compareTo(new BigDecimal("1000")));
        assertTrue(acc.getAccountNumber().startsWith("100"));
    }

    @Test
    void testCreateAccountNegativeBalance() {
        assertThrows(InvalidAmountException.class, () -> {
            service.createAccount("Test", "test@email.com", new BigDecimal("-100"));
        });
    }

    @Test
    void testListAllAccounts() throws InvalidAmountException {
        service.createAccount("User1", "u1@email.com", new BigDecimal("1000"));
        service.createAccount("User2", "u2@email.com", new BigDecimal("2000"));
        assertEquals(2, service.listAllAccounts().size());
    }
}

