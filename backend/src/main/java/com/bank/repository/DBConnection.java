package com.bank.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
	
public static Connection getConnection(){
		
		Connection con = null;
		
		// TODO: Enable when MySQL DB is set up
		// try {
		// 	Class.forName("com.mysql.cj.jdbc.Driver");
		// 	con = DriverManager.getConnection("jdbc:mysql://localhost:3306/BankingApplication", "root", "root");
		// } catch (ClassNotFoundException | SQLException e) {
		// 	 logger.error("DB connection failed", e);
		// }
		return null; // Use in-memory for now
	}

}
