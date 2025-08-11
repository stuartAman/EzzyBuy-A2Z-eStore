// Declaring the package for this controller class
package com.ecommerce.app.controllers;

// Importing required classes and annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.app.dto.request.AddNewProduct;
import com.ecommerce.app.dto.request.MakeAdminRequest;
import com.ecommerce.app.dto.response.MessageResponse;
import com.ecommerce.app.models.ERole;
import com.ecommerce.app.models.Product;
import com.ecommerce.app.models.User;
import com.ecommerce.app.security.jwt.JwtUtils;
import com.ecommerce.app.services.IProductService;
import com.ecommerce.app.services.IRoleService;
import com.ecommerce.app.services.IUserService;

// Mark this class as a REST controller and map requests starting with /api/admin
@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*") // Allow cross-origin requests from any origin
public class AdminController {

    // Injecting dependencies for services and utilities
    @Autowired
    IProductService productService;

    @Autowired
    IUserService userService;

    @Autowired
    IRoleService roleService;

    @Autowired
    JwtUtils jwtUtils;

    // Endpoint to add a new product to the database
    @PostMapping("/addProduct")
    public ResponseEntity<?> addNewProducts(@RequestHeader String authorization,
                                            @RequestBody AddNewProduct newProduct) {

        // Extract user from JWT token in request header
        User userAdmin = jwtUtils.getUserFromRequestHeader(authorization);

        // Check if the user has admin role
        if (!userAdmin.getRoles().contains(roleService.getByName(ERole.ROLE_ADMIN)))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Admin Credentials Required!!!"));

        try {
            // Save the new product to the database
            Product product = productService.saveProductToDb(newProduct);
            return ResponseEntity.ok(product); // Return the saved product
        } catch (Exception e) {
            // Handle errors while adding product
            return ResponseEntity.badRequest().body(new MessageResponse("Product adding Failed!!!"));
        }
    }

    // Endpoint to add an image to a product
    @PostMapping("/addImage/{productId}")
    public ResponseEntity<?> addImageToProduct(@RequestHeader String authorization,
                                               @PathVariable String productId,
                                               @RequestBody MultipartFile image) {
        // Extract token from header
        String token = jwtUtils.getTokenFromHeader(authorization);

        // Extract admin email from JWT
        String adminEmail = jwtUtils.getUserNameFromJwtToken(token);

        // Get user details by email
        User userAdmin = userService.getByEmail(adminEmail);

        // Check if the user is an admin
        if (!userAdmin.getRoles().contains(roleService.getByName(ERole.ROLE_ADMIN)))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Admin Credentials Required!!!"));

        try {
            // Add image to product
            Product p = productService.addImage(productId, image);
            return ResponseEntity.ok(p); // Return the updated product
        } catch (Exception e) {
            // Handle errors
            return ResponseEntity.badRequest().body(new MessageResponse("Image adding Failed!!!"));
        }
    }

    // Endpoint to grant admin role to another user
    @PostMapping("/makeAdmin")
    public ResponseEntity<?> makeAdmin(@RequestHeader String authorization,
                                       @RequestBody MakeAdminRequest makeAdmin) {
    
        // Extract token and email of the current user
        String token = jwtUtils.getTokenFromHeader(authorization);
        String adminEmail = jwtUtils.getUserNameFromJwtToken(token);
        User userAdmin = userService.getByEmail(adminEmail);

        // Check if the current user is admin
        if (!userAdmin.getRoles().contains(roleService.getByName(ERole.ROLE_ADMIN)))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Admin Credentials Required!!!"));

        // Find the user by email to be promoted
        User user = userService.getByEmail(makeAdmin.getEmail());

        // Add admin role to that user
        user.getRoles().add(roleService.getByName(ERole.ROLE_ADMIN));

        // Save updated user
        return ResponseEntity.ok(userService.saveUser(user));
    }
}
