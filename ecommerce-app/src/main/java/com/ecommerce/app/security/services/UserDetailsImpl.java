package com.ecommerce.app.security.services;

// Import necessary classes
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ecommerce.app.models.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

// Custom implementation of Spring Security's UserDetails interface
public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	// Fields representing user data
	private String id;
	private String firstname;
	private String lastname;
	private String email;

	@JsonIgnore
	private String password; // Will be ignored during JSON serialization

	// A collection of authorities (roles/permissions) assigned to the user
	private Collection<? extends GrantedAuthority> authorities;

	// Constructor to initialize the fields
	public UserDetailsImpl(
			String id,
			String email,
			String password,
			String firstname,
			String lastname,
			Collection<? extends GrantedAuthority> authorities) {
		this.id = id;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.password = password;
		this.authorities = authorities;
	}

	// Builds a UserDetailsImpl object from a User object
	public static UserDetailsImpl build(User user) {
		// Convert roles from User into a list of GrantedAuthority objects
		List<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name()))
				.collect(Collectors.toList());

		// Return a new instance of UserDetailsImpl
		return new UserDetailsImpl(
				user.getId(),
				user.getEmail(),
				user.getPassword(),
				user.getFirstname(),
				user.getLastname(),
				authorities);
	}

	// Returns the authorities (roles/permissions) granted to the user
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	// Getter for user ID
	public String getId() {
		return id;
	}

	// Getter for user email
	public String getEmail() {
		return email;
	}

	// Getter for user first name
	public String getFirstname() {
		return firstname;
	}

	// Getter for user last name
	public String getLastname() {
		return lastname;
	}

	// Returns the password
	@Override
	public String getPassword() {
		return password;
	}

	// Returns the username (in this case, email is used as the username)
	@Override
	public String getUsername() {
		return email;
	}

	// Indicates whether the account is not expired
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	// Indicates whether the account is not locked
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	// Indicates whether the credentials are not expired
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	// Indicates whether the user is enabled
	@Override
	public boolean isEnabled() {
		return true;
	}

	// Overrides equals to compare users based on their ID
	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}
}
