package com.bank.util;

import java.util.Properties;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.github.cdimascio.dotenv.Dotenv;

public class EmailUtil {

    private static final Logger logger = LoggerFactory.getLogger(EmailUtil.class);

    // 🔐 Load environment variables
    private static final Dotenv dotenv = Dotenv.load();

    private static final String FROM_MAIL = dotenv.get("EMAIL_USER");
    private static final String APP_PASSWORD = dotenv.get("EMAIL_PASS");

    public static void sendEmail(String to, String subject, String body) {

        // ⚙️ SMTP Configuration
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        // 🔑 Authentication
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(FROM_MAIL, APP_PASSWORD);
            }
        });

        try {
            // 📧 Create Email
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(FROM_MAIL));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);

            // 💎 You can switch to HTML anytime
            message.setContent(
			    "<h2>Transaction Successful</h2>" +
			    "<p><b>Amount:</b> ₹" + body + "</p>" +
			    "<p>Thank you for using BankPro</p>",
			    "text/html"
			);

            // 🚀 Send Email
            Transport.send(message);

            logger.info("Email sent successfully to: {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send email", e);
        }
    }
}