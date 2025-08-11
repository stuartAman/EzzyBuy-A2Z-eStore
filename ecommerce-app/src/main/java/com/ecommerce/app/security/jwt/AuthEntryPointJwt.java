// Define the package for this class
package com.ecommerce.app.security.jwt;

// Import necessary classes for HTTP request/response and exceptions
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// Logger library for logging errors or info
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Handles authentication-related exceptions
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

// Marks this class as a Spring-managed component (auto-detected)
import org.springframework.stereotype.Component;

// AuthEntryPointJwt is triggered whenever an unauthorized request is made to a protected resource
@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

	// Logger to log error messages
	private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

	// This method is called when a user tries to access a secured REST endpoint without credentials
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {

		// Log the unauthorized error message
		logger.error("Unauthorized error: {}", authException.getMessage());

		// Send a 401 Unauthorized error response to the client
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
	}
}
