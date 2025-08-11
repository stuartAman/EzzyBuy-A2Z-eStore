// Package declaration
package com.ecommerce.app.security;

// Required Spring and Spring Security imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Imports for JWT token filter and unauthorized access handler
import com.ecommerce.app.security.jwt.AuthEntryPointJwt;
import com.ecommerce.app.security.jwt.AuthTokenFilter;
import com.ecommerce.app.security.services.UserDetailsServiceImpl;

// Mark this class as a configuration class
@Configuration
// Enable Spring Security for the application
@EnableWebSecurity
// Enable method-level security annotations like @PreAuthorize
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	// Injecting custom user details service
	@Autowired
	UserDetailsServiceImpl userDetailsService;

	// Handler to manage unauthorized access exceptions
	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	// Define a bean for the custom JWT token filter
	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	// Configure authentication manager with custom userDetailsService and password encoder
	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder
			.userDetailsService(userDetailsService) // Custom service to load user-specific data
			.passwordEncoder(passwordEncoder());   // Password encoding strategy
	}

	// Expose the authentication manager as a bean
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	// Define the password encoder to be used (BCrypt is a strong hashing function)
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// Main configuration for HTTP security (authorization rules, filters, etc.)
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
			.cors().and() // Enable CORS
			.csrf().disable() // Disable CSRF (not needed for REST APIs)
			.exceptionHandling().authenticationEntryPoint(unauthorizedHandler) // Custom unauthorized handler
			.and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No session (JWT based)
			.and()
			.authorizeRequests()
			.antMatchers("/api/auth/**").permitAll()      // Public: Auth end points (login, register, etc.)
			.antMatchers("/api/test/**").permitAll()      // Public: Test end points
			.antMatchers("/api/categories/**").permitAll()// Public: Category listing
			.antMatchers("/api/products/**").permitAll()  // Public: Product listing
			.antMatchers("/api/search/**").permitAll()    // Public: Search functionality
			.antMatchers("/api/orders/invoice/**").permitAll() // Public: Order invoice download
			.anyRequest().authenticated();                // All other end points require authentication

		// Add JWT token filter before the default UsernamePasswordAuthenticationFilter
		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	}


}
