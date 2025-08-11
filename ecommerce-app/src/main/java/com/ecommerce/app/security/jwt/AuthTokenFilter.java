package com.ecommerce.app.security.jwt;

// Required imports
import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.app.security.services.UserDetailsServiceImpl;

// Filter that runs once per request to validate the JWT token
public class AuthTokenFilter extends OncePerRequestFilter {

	// Inject JwtUtils to handle JWT operations like validation
	@Autowired
	private JwtUtils jwtUtils;

	// Inject custom UserDetailsService implementation to load user data
	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	// Logger for debugging or error messages
	private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

	// This method runs on every HTTP request before the controller
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// Extract JWT token from the request
			String jwt = parseJwt(request);

			// Validate the token
			if (jwt != null && jwtUtils.validateJwtToken(jwt)) {

				// Extract username (email in this case) from the token
				String email = jwtUtils.getUserNameFromJwtToken(jwt);

				// Load user details from the database using the email
				UserDetails userDetails = userDetailsService.loadUserByUsername(email);

				// Create an authentication token with user details and authorities
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());

				// Attach additional request details (like IP, session info)
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				// Set the authentication in the security context
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		} catch (Exception e) {
			// Log any exception that happens during authentication
			logger.error("Cannot set user authentication: {}", e);
		}

		// Continue to the next filter or request handler
		filterChain.doFilter(request, response);
	}

	// Helper method to extract the JWT token from the Authorization header
	private String parseJwt(HttpServletRequest request) {
		// Read the Authorization header
		String headerAuth = request.getHeader("Authorization");

		// Check if header is not empty and starts with "Bearer "
		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			// Extract and return the token part (after "Bearer ")
			return headerAuth.substring(7);
		}

		// Return null if token is missing or doesn't start with "Bearer "
		return null;
	}
}
