package com.ecommerce.app.security.services; // Defines the package location

import org.springframework.beans.factory.annotation.Autowired; // For dependency injection
import org.springframework.security.core.userdetails.UserDetails; // Represents authenticated user details
import org.springframework.security.core.userdetails.UserDetailsService; // Interface to implement for loading user data
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Thrown when user is not found
import org.springframework.stereotype.Service; // Marks this class as a service component
import org.springframework.transaction.annotation.Transactional; // Ensures method is wrapped in a transaction

import com.ecommerce.app.models.User; // Import the User entity
import com.ecommerce.app.repository.UserRepository; // Repository to access User data

@Service // Registers this class as a Spring service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired // Automatically injects the UserRepository instance
    UserRepository userRepository;

    @Override
    @Transactional // Ensures the method runs in a transactional context (for database consistency)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Tries to fetch user by email. If not found, throws UsernameNotFoundException
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        // Converts User entity to Spring Security-compatible UserDetails object
        return UserDetailsImpl.build(user);
    }
}
