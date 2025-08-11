// Define the package for the controller class
package com.ecommerce.app.controllers;

// Import required Java utility classes
import java.util.List;
import java.util.Map;

// Import Spring framework annotations and classes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Import custom DTO and service interface
import com.ecommerce.app.dto.request.ProductDetailsRequest;
import com.ecommerce.app.services.IProductService;

// Mark this class as a REST controller to handle HTTP requests
@RestController

// Base URL for all endpoints inside this controller
@RequestMapping("/api/search")

// Allow cross-origin requests from any source
@CrossOrigin("*")
public class SearchController {
    
    // Inject the product service implementation
    @Autowired
    IProductService productService;

    // Handle GET requests to /api/search/sub-category
    @GetMapping("/sub-category")
    public ResponseEntity<?> getProductsBySubCategory(@RequestParam(value = "keyword") String keyword,
            @RequestParam(value = "pageNumber") int pageNumber) {

        // Remove leading and trailing spaces from keyword
        String key = keyword.strip();

        // Create pagination configuration: page index (0-based), page size = 5
        Pageable pageable = PageRequest.of(pageNumber - 1, 5);

        // Declare the page object to hold results
        Page<ProductDetailsRequest> products;

        // If keyword is empty, return an empty response
        if (key.length() == 0) {
            // You could optionally return all products here
            return ResponseEntity.ok("");
        } else {
            // Fetch products matching the sub-category keyword
            products = productService.getAllBySubCategory(key, pageable);
        }

        // Extract product list from page content
        List<ProductDetailsRequest> p = products.getContent();

        // Get current page number (1-based)
        int page = products.getNumber() + 1;

        // Get total number of pages
        int pages = products.getTotalPages();

        // Prepare result as a map with pagination and product data
        Map<String, Object> result = Map.of("page", page, "pages", pages, "products", p);

        // Return the result with HTTP 200 OK
        return ResponseEntity.ok(result);
    }

    // Handle GET requests to /api/search/category
    @GetMapping("/category")
    public ResponseEntity<?> getProductsByCategory(@RequestParam(value = "keyword") String keyword,
            @RequestParam(value = "pageNumber") int pageNumber) {

        // Trim whitespace from keyword
        String key = keyword.strip();

        // Configure pagination with page index and size
        Pageable pageable = PageRequest.of(pageNumber - 1, 5);

        // Declare results container
        Page<ProductDetailsRequest> products;

        // If keyword is blank, return empty response
        if (key.length() == 0) {
            // Placeholder for default query method
            return ResponseEntity.ok("");
        } else {
            // Fetch products based on category keyword
            products = productService.getAllByCategory(key, pageable);
        }

        // Extract products and pagination info
        List<ProductDetailsRequest> p = products.getContent();
        int page = products.getNumber() + 1;
        int pages = products.getTotalPages();
        Map<String, Object> result = Map.of("page", page, "pages", pages, "products", p);

        // Return structured response
        return ResponseEntity.ok(result);
    }

    // Handle GET requests to /api/search with general query
    @GetMapping
    public ResponseEntity<?> getProductsByQ(@RequestParam(value = "keyword") String keyword,
            @RequestParam(value = "pageNumber") int pageNumber) {

        // Clean up keyword input
        String key = keyword.strip();

        // Setup pagination
        Pageable pageable = PageRequest.of(pageNumber - 1, 5);

        // Declare results variable
        Page<ProductDetailsRequest> products;

        // If no keyword, return empty response
        if (key.length() == 0) {
            // Uncomment to fetch all products if needed
            return ResponseEntity.ok("");
        } else {
            // Perform general keyword search
            products = productService.getAllByQ(key, pageable);
        }

        // Extract results and pagination data
        List<ProductDetailsRequest> p = products.getContent();
        int page = products.getNumber() + 1;
        int pages = products.getTotalPages();
        Map<String, Object> result = Map.of("page", page, "pages", pages, "products", p);

        // Respond with result map
        return ResponseEntity.ok(result); 
    }
}
