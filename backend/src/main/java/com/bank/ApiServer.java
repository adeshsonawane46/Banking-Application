package com.bank;

import static spark.Spark.*;
import java.math.BigDecimal;

import com.bank.dto.AccountRequest;
import com.bank.dto.TxRequest;
import com.bank.dto.TransferRequest;
import com.bank.model.Account;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.bank.service.AccountService;
import com.bank.service.AlertService;
import com.bank.service.TransactionService;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ApiServer {
	

	public static void main(String[] args) {
		Logger logger = LoggerFactory.getLogger(ApiServer.class);
		
		port(8080);
		enableCORS();
		Gson gson = new Gson();
		
		AccountRepository accRepo = new AccountRepository();
		AccountService accService = new AccountService(accRepo);
		TransactionRepository trxRepo = new TransactionRepository();
		AlertService alertService = new AlertService(new BigDecimal("1000"));
		TransactionService trxService = new TransactionService(accService, trxRepo, alertService);
		
		post("/accounts/create", (req, res) -> {
			res.type("application/json");
			logger.info("/accounts/create API called");
			try {
				AccountRequest data = gson.fromJson(req.body(), AccountRequest.class);
				Account acc = accService.createAccount(data.name, data.email, data.balance);
				return gson.toJson(acc);
			} catch (Exception e) {
				logger.error("Create account failed", e);
				res.status(400);
				return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
			}
		});
		
		post("/transactions/deposit", (req, res) -> {
	            logger.info("/transactions/deposit called");
	            try {
	                TxRequest data = gson.fromJson(req.body(), TxRequest.class);
	                trxService.deposite(data.accNo, data.amount);
	                return "Deposit successful";
	            } catch (Exception e) {
	                logger.error("Deposit failed", e);
	                res.status(400);
	                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
	            }
	        });
		
		post("/transactions/withdraw", (req, res) -> {
			logger.info("/transactions/withdraw called");
			try {
				TxRequest data = gson.fromJson(req.body(), TxRequest.class);
				trxService.withdraw(data.accNo, data.amount);
				return "Withdraw successful";
			} catch (Exception e) {
				logger.error("Withdraw failed", e);
				res.status(400);
				return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
			}
		});
		
		post("/transactions/transfer", (req, res) -> {
			logger.info("/transactions/transfer called");
			try {
				TransferRequest data = gson.fromJson(req.body(), TransferRequest.class);
				trxService.transfer(data.fromAcc, data.toAcc, data.amount);
				return "Transfer successful";
			} catch (Exception e) {
				logger.error("Transfer failed", e);
				res.status(400);
				return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
			}
		});
		
		get("/accounts/all", (req, res) -> {
			logger.info("/accounts/all called");
			res.type("application/json");
			return gson.toJson(accService.listAllAccounts());
		});
		
		get("/accounts/:accNo", (req, res) -> {
			logger.info("/accounts/{} called", req.params("accNo"));
			res.type("application/json");
			try {
				String accNo = req.params("accNo");
				Account account = accService.getAccount(accNo);
				return gson.toJson(account);
			} catch (Exception e) {
				logger.error("Get account failed", e);
				res.status(404);
				return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
			}
		});
		
		logger.info("API Server started on port 8080");
		awaitInitialization();
	}
	
	public static void enableCORS() {
		options("/*",(request,response) -> {
			String reqheaders = request.headers("Access-Control-Request-Headers");
			if(reqheaders != null) {
				response.header("Access-Control-Allow-Headers", reqheaders);
			}
			
			String reqMethod = request.headers("Access-Control-Request-Method");
			if(reqMethod != null) {
				response.header("Access-Control-Allow-Methods", reqMethod);
			}
			
			return "OK";
			
		});
		
		before((req,res) -> {
			res.header("Access-Control-Allow-Origin","*");
			res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
			res.header("Access-Control-Allow-Headers","Content-Type,Authorization");
		});
		
	}
	
}

