// Package declaration for repository layer
package com.ecommerce.app.repository;

// Importing Stream API for handling collections as streams
import java.util.stream.Stream;

// Importing paging interfaces from Spring Data
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// MongoDB repository interfaces
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

// Custom DTO and model class imports
import com.ecommerce.app.dto.request.ProductDetailsRequest;
import com.ecommerce.app.models.Product;

// Defining a repository interface for Product model
public interface ProductRepository extends MongoRepository<Product, String> {

    // NOTE: Standard methods like findById, save, delete are inherited from MongoRepository

	//done
    // Retrieves latest products sorted by product_added_date in descending order
    @Query(value = "{}", 
           sort = "{product_added_date : -1}", 
           fields = "{ _id: 1 , name: 1, image: 1, price: 1 }")
    Stream<ProductDetailsRequest> getLatestProducts();

  //done
    // Retrieves most visited products sorted by visits in descending order
    @Query(value = "{}", 
           sort = "{visits : -1}", 
           fields = "{ _id: 1 , name: 1, image: 1, price: 1 }")
    Stream<ProductDetailsRequest> getMostVisitedProducts();

    // Performs case-insensitive search by product name and returns a pageable result
    @Query(value = "{name: {$regex: ?0, $options: 'i'}}", 
           sort = "{product_added_date : -1}", 
           fields = "{ _id: 1 , name: 1, image: 1, price: 1 }")
    Page<ProductDetailsRequest> findAllByQ(String query, Pageable pageable);

    // Performs case-insensitive search by sub-category name and returns a pageable result
    @Query(value = "{subCategoryName: {$regex: ?0, $options: 'i'}}", 
           sort = "{product_added_date : -1}", 
           fields = "{ _id: 1 , name: 1, image: 1, price: 1 }")
    Page<ProductDetailsRequest> findAllBySubCategory(String query, Pageable pageable);

    // Retrieves all products with pagination, sorted by product_added_date
    @Query(value = "{}", 
           sort = "{product_added_date : -1}", 
           fields = "{ _id: 1 , name: 1, image: 1, price: 1 }")
    Page<ProductDetailsRequest> getAllByQ(Pageable pageable);
}
