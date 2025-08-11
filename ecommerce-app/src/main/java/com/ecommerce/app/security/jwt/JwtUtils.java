// Package declaration for JWT utility class
package com.ecommerce.app.security.jwt;

// Java utility class for date
import java.util.Date;

// Logger API from SLF4J for logging
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Spring annotations and utilities
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

// Importing User model and services
import com.ecommerce.app.models.User;
import com.ecommerce.app.security.services.UserDetailsImpl;
import com.ecommerce.app.services.IUserService;

// JWT dependencies for parsing and creating tokens
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

// Marks this class as a Spring-managed bean
@Component
public class JwtUtils {

	// Logger instance for logging errors and information
	private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	// Inject the user service to fetch user details
	@Autowired
	IUserService userService;

	// JWT secret key, fetched from application.properties
	@Value("${ecommerce.app.jwtSecret}")
	private String jwtSecret;

	// JWT expiration time in milliseconds, fetched from application.properties
	@Value("${ecommerce.app.jwtExpirationMs}")
	private long jwtExpirationMs;

	/**
	 * Generates a JWT token based on authentication object.
	 * If `isRemembered` is true, generate a long-lived token.
	 */
	public String generateJwtToken(Authentication authentication, Boolean isRemembered) {
		// Get user principal (currently logged-in user)
		UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

		// If user did not choose 'remember me', issue short-lived token
		if (!isRemembered) {
			return Jwts.builder()
					.setSubject(userPrincipal.getUsername()) // Set subject as username (email)
					.setIssuedAt(new Date()) // Current time
					.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Expiry time
					.signWith(SignatureAlgorithm.HS512, jwtSecret) // Sign token using secret and HS512 algorithm
					.compact(); // Return JWT string
		} else {
			// For 'remember me', extend expiration to 30x
			return Jwts.builder()
					.setSubject(userPrincipal.getUsername())
					.setIssuedAt(new Date())
					.setExpiration(new Date((new Date()).getTime() + jwtExpirationMs * 30)) // Longer expiry
					.signWith(SignatureAlgorithm.HS512, jwtSecret)
					.compact();
		}
	}

	/**
	 * Validates the given JWT token.
	 * Returns true if token is valid, else logs the error and returns false.
	 */
	public boolean validateJwtToken(String authToken) {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken); // Try parsing the token
			return true; // If no exception, token is valid
		} catch (SignatureException e) {
			logger.error("Invalid JWT signature: {}", e.getMessage()); // Signature doesn't match
		} catch (MalformedJwtException e) {
			logger.error("Invalid JWT token: {}", e.getMessage()); // Token structure is incorrect
		} catch (ExpiredJwtException e) {
			logger.error("JWT token is expired: {}", e.getMessage()); // Token has expired
		} catch (UnsupportedJwtException e) {
			logger.error("JWT token is unsupported: {}", e.getMessage()); // Token format not supported
		} catch (IllegalArgumentException e) {
			logger.error("JWT claims string is empty: {}", e.getMessage()); // Empty or null token
		}

		return false; // If any error occurs, token is invalid
	}

	/**
	 * Extracts the user from the request Authorization header.
	 */
	public User getUserFromRequestHeader(String authorization) {
		String token = getTokenFromHeader(authorization); // Extract token from header
		String email = getUserNameFromJwtToken(token); // Get username/email from token

		return userService.getByEmail(email); // Fetch user object using email
	}

	/**
	 * Extracts the username (subject) from the JWT token.
	 */
	public String getUserNameFromJwtToken(String token) {
		return Jwts.parser()
				.setSigningKey(jwtSecret) // Set the secret key
				.parseClaimsJws(token) // Parse the token
				.getBody()
				.getSubject(); // Return the subject (username/email)
	}

	/**
	 * Extracts the JWT token from the Authorization header string.
	 * Expected format: "Bearer <token>"
	 */
	public String getTokenFromHeader(String headerAuth) {
		// Check if header is non-empty and starts with "Bearer "
		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7, headerAuth.length()); // Extract token only
		}
		return null; // If format is invalid, return null
	}
}
