package com.bank;

import static spark.Spark.*;
import java.math.BigDecimal;

import com.bank.repository.DBConnection;
import com.bank.model.User;
import com.bank.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import com.bank.dto.AuthResponse;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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

        // ================= AUTH APIs =================

        post("/signup", (req, res) -> {
            res.type("application/json");

            try (Connection conn = DBConnection.getConnection()) {

                User user = gson.fromJson(req.body(), User.class);

                if (user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
                    res.status(400);
                    return gson.toJson("Missing fields ❌");
                }

                String checkSql = "SELECT * FROM users WHERE email=?";
                PreparedStatement checkStmt = conn.prepareStatement(checkSql);
                checkStmt.setString(1, user.getEmail());
                ResultSet checkRs = checkStmt.executeQuery();

                if (checkRs.next()) {
                    res.status(400);
                    return gson.toJson("Email already exists ❌");
                }

                String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());

                String sql = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";
                PreparedStatement stmt = conn.prepareStatement(sql);

                stmt.setString(1, user.getName());
                stmt.setString(2, user.getEmail());
                stmt.setString(3, hashedPassword);

                stmt.executeUpdate();

                return gson.toJson("Signup Successful ✅");

            } catch (Exception e) {
                res.status(400);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        post("/login", (req, res) -> {
            res.type("application/json");

            try (Connection conn = DBConnection.getConnection()) {

                User user = gson.fromJson(req.body(), User.class);

                if (user.getEmail() == null || user.getPassword() == null) {
                    res.status(400);
                    return gson.toJson("Missing credentials ❌");
                }

                String sql = "SELECT * FROM users WHERE email=?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, user.getEmail());

                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    String storedPassword = rs.getString("password");

                    if (BCrypt.checkpw(user.getPassword(), storedPassword)) {
                        String token = JwtUtil.generateToken(user.getEmail());
                        return gson.toJson(new AuthResponse("Login Successful ✅", token));
                    }
                }

                res.status(401);
                return gson.toJson(new AuthResponse("Invalid Credentials ❌", null));

            } catch (Exception e) {
                res.status(500);
                return gson.toJson("Server Error ❌");
            }
        });

        // ================= JWT PROTECTION (FIXED) =================

        before("/transactions/*", (req, res) -> {

            // ✅ Allow preflight (CORS)
            if (req.requestMethod().equals("OPTIONS")) return;

            String header = req.headers("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                halt(401, "Unauthorized ❌");
            }

            String token = header.replace("Bearer ", "");

            try {
                JwtUtil.verifyToken(token);
            } catch (Exception e) {
                halt(401, "Invalid Token ❌");
            }
        });

        before("/accounts/*", (req, res) -> {

            // ✅ Allow preflight (CORS)
            if (req.requestMethod().equals("OPTIONS")) return;

            String header = req.headers("Authorization");

            if (header == null || !header.startsWith("Bearer ")) {
                halt(401, "Unauthorized ❌");
            }

            String token = header.replace("Bearer ", "");

            try {
                JwtUtil.verifyToken(token);
            } catch (Exception e) {
                halt(401, "Invalid Token ❌");
            }
        });

        // ================= SERVICES =================

        AccountRepository accRepo = new AccountRepository();
        AccountService accService = new AccountService(accRepo);
        TransactionRepository trxRepo = new TransactionRepository();
        AlertService alertService = new AlertService(new BigDecimal("1000"));
        TransactionService trxService = new TransactionService(accService, trxRepo, alertService);

        post("/accounts/create", (req, res) -> {
            res.type("application/json");
            try {
                AccountRequest data = gson.fromJson(req.body(), AccountRequest.class);
                return gson.toJson(accService.createAccount(data.name, data.email, data.balance));
            } catch (Exception e) {
                res.status(400);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        post("/transactions/deposit", (req, res) -> {
            try {
                TxRequest data = gson.fromJson(req.body(), TxRequest.class);
                trxService.deposite(data.accNo, data.amount);
                return "Deposit successful";
            } catch (Exception e) {
                res.status(400);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        post("/transactions/withdraw", (req, res) -> {
            try {
                TxRequest data = gson.fromJson(req.body(), TxRequest.class);
                trxService.withdraw(data.accNo, data.amount);
                return "Withdraw successful";
            } catch (Exception e) {
                res.status(400);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        post("/transactions/transfer", (req, res) -> {
            try {
                TransferRequest data = gson.fromJson(req.body(), TransferRequest.class);
                trxService.transfer(data.fromAcc, data.toAcc, data.amount);
                return "Transfer successful";
            } catch (Exception e) {
                res.status(400);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        get("/accounts/all", (req, res) -> {
            res.type("application/json");
            return gson.toJson(accService.listAllAccounts());
        });

        get("/accounts/:accNo", (req, res) -> {
            res.type("application/json");
            try {
                return gson.toJson(accService.getAccount(req.params("accNo")));
            } catch (Exception e) {
                res.status(404);
                return gson.toJson("{\"error\": \"" + e.getMessage() + "\"}");
            }
        });

        awaitInitialization();
    }

    public static void enableCORS() {
        options("/*", (req, res) -> {
            String headers = req.headers("Access-Control-Request-Headers");
            if (headers != null) res.header("Access-Control-Allow-Headers", headers);

            String method = req.headers("Access-Control-Request-Method");
            if (method != null) res.header("Access-Control-Allow-Methods", method);

            return "OK";
        });

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        });
    }
}