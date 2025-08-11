// Package declaration
package com.ecommerce.app.controllers;

// Imports for collections, validation, and stream API
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// Imports for request validation
import javax.validation.Valid;

// Spring Framework annotations and classes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importing custom DTOs
import com.ecommerce.app.dto.request.LoginRequest;
import com.ecommerce.app.dto.request.SignupRequest;
import com.ecommerce.app.dto.response.JwtResponse;
import com.ecommerce.app.dto.response.MessageResponse;

// Importing models
import com.ecommerce.app.models.ERole;
import com.ecommerce.app.models.Role;
import com.ecommerce.app.models.User;

// Importing repositories and security classes
import com.ecommerce.app.repository.RoleRepository;
import com.ecommerce.app.repository.UserRepository;
import com.ecommerce.app.security.jwt.JwtUtils;
import com.ecommerce.app.security.services.UserDetailsImpl;

// Allow CORS requests from any origin
@CrossOrigin(origins = "*", maxAge = 3600)
// Mark this class as a REST controller
@RestController
// Base URL for the controller
@RequestMapping("/api/auth")
public class AuthController {

	// Injecting authentication manager bean
	@Autowired
	AuthenticationManager authenticationManager;

	// Injecting JWT utility class
	@Autowired
	JwtUtils jwtUtils;

	// Injecting user repository
	@Autowired
	UserRepository userRepository;

	// Injecting role repository
	@Autowired
	RoleRepository roleRepository;

	// Injecting password encoder
	@Autowired
	PasswordEncoder encoder;

	// Endpoint for user login
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		// Authenticate the user using email and password
		Authentication authentication = authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		// Set authentication in security context
		SecurityContextHolder.getContext().setAuthentication(authentication);

		// Generate JWT token for the authenticated user
		String jwt = jwtUtils.generateJwtToken(authentication, loginRequest.getIsRemembered());

		// Get user details from authentication principal
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

		// Extract roles from user details
		List<String> roles = userDetails.getAuthorities().stream()
			.map(item -> item.getAuthority())
			.collect(Collectors.toList());

		// Return JWT token and user details in response
		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getEmail(),
			userDetails.getFirstname(), userDetails.getLastname(), roles));
	}

	// Endpoint for user registration
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

		// Check if email is already registered
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Email is already in use!"));
		}

		// Create new user and encode the password
		User user = new User(signUpRequest.getFirstname(), signUpRequest.getLastname(), signUpRequest.getEmail(),
			encoder.encode(signUpRequest.getPassword()));

		// Get role strings from signup request
		Set<String> strRoles = signUpRequest.getRoles();

		// Set of role entities to assign to user
		Set<Role> roles = new HashSet<>();

		// If no roles provided, assign ROLE_USER by default
		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
				.orElseThrow(() -> new RuntimeException("Role is not found."));
			roles.add(userRole);
		} else {
			// If roles are provided, map strings to actual role entities
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
						.orElseThrow(() -> new RuntimeException("Role is not found."));
					roles.add(adminRole);
					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
						.orElseThrow(() -> new RuntimeException("Role is not found."));
					roles.add(userRole);
				}
			});
		}

		// Set roles to the user
		user.setRoles(roles);

		// Save the user in the database
		userRepository.save(user);

		// Return success message
		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
}
