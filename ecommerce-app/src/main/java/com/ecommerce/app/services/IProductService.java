package com.ecommerce.app.services;

import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.app.dto.request.AddNewProduct;
import com.ecommerce.app.dto.request.ProductDetailsRequest;
import com.ecommerce.app.dto.request.ShoppingCartProductsRequest;
import com.ecommerce.app.models.Product;

public interface IProductService {

	Product getProductById(String productId);

	Stream<ProductDetailsRequest> getLatestProducts();

	Stream<ProductDetailsRequest> getMostVisitedProducts();

	Product updateVisits(Product product);

	ProductDetailsRequest getWishListProductById(String productId);

	ShoppingCartProductsRequest getShoppingCartProductById(String productId, Integer quantity);

	boolean stockUnavailable(List<ShoppingCartProductsRequest> itemsList);

	void reduceStock(List<ShoppingCartProductsRequest> itemList);

	Product addImage(String productId, MultipartFile image) throws IllegalStateException, IOException;

	Product saveProductToDb(AddNewProduct newProduct);

	Page<ProductDetailsRequest> getAllByQ(String query, Pageable pageable);

	Page<ProductDetailsRequest> getAllBySubCategory(String query, Pageable pageable);

	Page<ProductDetailsRequest> getAllByQ(Pageable pageable);

	Page<ProductDetailsRequest> getAllByCategory(String query, Pageable pageable);
}
