// Package location for controller classes
package com.ecommerce.app.controllers;

// Importing necessary classes for file handling
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

// Importing collection and stream utilities
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// Spring dependencies for web, DI, and HTTP handling
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importing DTO and service interfaces
import com.ecommerce.app.dto.request.ProductDetailsRequest;
import com.ecommerce.app.models.Product;
import com.ecommerce.app.services.IProductService;

// Marks this class as a REST controller
@RestController
// Maps all requests beginning with /api/products to this controller
@RequestMapping("/api/products")
// Allows cross-origin requests from any domain
@CrossOrigin("*")
public class ProductController {

    // Injects the ProductService implementation
    @Autowired
    IProductService productService;

    // Injects file location from application properties for product images
    @Value("${file.upload.location}/products")
    private String location;

    // API endpoint to get the latest products
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestProducts() {

        // Declare list to hold limited results
        List<ProductDetailsRequest> products;

        // Use stream to get latest products and limit to 7 items
        try (Stream<ProductDetailsRequest> stream = productService.getLatestProducts()) {
            products = stream.limit(7).collect(Collectors.toList());
        }

        // Return the result as JSON with 200 OK status
        return ResponseEntity.ok(products);
    }

    // API endpoint to get the most visited products
    @GetMapping("/most-visited")
    public ResponseEntity<?> getMostVisitedProducts() {

        List<ProductDetailsRequest> products;

        // Stream and limit to 7 most visited items
        try (Stream<ProductDetailsRequest> stream = productService.getMostVisitedProducts()) {
            products = stream.limit(7).collect(Collectors.toList());
        }

        return ResponseEntity.ok(products);
    }

    // API endpoint to fetch full product details by ID
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable String productId) {

        // Retrieve product based on ID
        Product product = productService.getProductById(productId);

        // Update the visit count and return updated product object
        return new ResponseEntity<>(productService.updateVisits(product), HttpStatus.OK);
    }

    // Example URL: http://localhost:8080/api/products/image/1
    @GetMapping("/image/{productId}")
    // Endpoint used to serve product image from local storage
    public ResponseEntity<byte[]> getFile(@PathVariable String productId) throws IOException {

        // Get the product object from service
        Product product = productService.getProductById(productId);

        // Create a file path using product image name
        Path path = Paths.get(location, product.getImage());

        // If file exists, read and send it as a byte response
        if (Files.exists(path)) {
            byte[] imageData = Files.readAllBytes(path);

            // Return image with headers for download filename
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + product.getImage() + "\"")
                    .body(imageData);
        }

        // Fallback image (0.jpg) if product image not found
        path = Paths.get(location, "0.jpg");
        byte[] imageData = Files.readAllBytes(path);

        // Return default image with proper headers
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + "0.jpg" + "\"")
                .body(imageData);
    }
}
