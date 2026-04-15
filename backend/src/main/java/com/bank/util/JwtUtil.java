package com.bank.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JwtUtil {

    private static final String SECRET = "MY_SECRET_KEY";

    // 🔑 Generate token
    public static String generateToken(String email) {
        return JWT.create()
                .withSubject(email)
                .sign(Algorithm.HMAC256(SECRET));
    }

    // ✅ Verify token
    public static DecodedJWT verifyToken(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET))
                .build()
                .verify(token);
    }
}