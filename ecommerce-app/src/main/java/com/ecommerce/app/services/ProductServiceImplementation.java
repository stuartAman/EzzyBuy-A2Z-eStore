package com.ecommerce.app.services;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.app.dto.request.AddNewProduct;
import com.ecommerce.app.dto.request.ProductDetailsRequest;
import com.ecommerce.app.dto.request.ShoppingCartProductsRequest;
import com.ecommerce.app.models.Category;
import com.ecommerce.app.models.Product;
import com.ecommerce.app.repository.CategoryRepository;
import com.ecommerce.app.repository.ProductRepository;

@Service
@Transactional
public class ProductServiceImplementation implements IProductService {

	@Value("${file.upload.location}/products")
	private String location;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Override
	public Product getProductById(String productId) {
		return productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product by ID " + productId + " not found!!!!"));
	}

	//done
	@Override
	public Stream<ProductDetailsRequest> getLatestProducts() {
		return productRepository.getLatestProducts();
	}

	//done
	@Override
	public Stream<ProductDetailsRequest> getMostVisitedProducts() {
		return productRepository.getMostVisitedProducts();
	}

	//done
	@Override
	public Product updateVisits(Product product) {
		product.setVisits(product.getVisits() + 1);
		return productRepository.save(product);
	}

	@Override
	public ProductDetailsRequest getWishListProductById(String productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product by ID " + productId + " not found!!!!"));
		ProductDetailsRequest productsRequest = new ProductDetailsRequest(productId, product.getName(),
				product.getImage(), product.getPrice());
		return productsRequest;
	}

	@Override
	public ShoppingCartProductsRequest getShoppingCartProductById(String productId, Integer quantity) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product by ID " + productId + " not found!!!!"));
		ShoppingCartProductsRequest productsRequest = new ShoppingCartProductsRequest(productId, product.getName(),
				product.getImage(), product.getPrice(), quantity);
		return productsRequest;
	}

	@Override
	public boolean stockUnavailable(List<ShoppingCartProductsRequest> itemsList) {
		boolean stock = false;
		for (ShoppingCartProductsRequest item : itemsList) {
			Product p = productRepository.findById(item.getId())
					.orElseThrow(() -> new RuntimeException("Product by ID " + item.getId() + " not found!!!!"));
			item.setPrice(p.getPrice());
			item.setSubTotal(p.getPrice()*item.getQuantity());
			if (p.getStock() < item.getQuantity()){
				item.setIsStockAvailable(false);
				stock=true;
			}
		}
		return stock;
	}

	@Override
	public void reduceStock(List<ShoppingCartProductsRequest> itemsList) {
		for (ShoppingCartProductsRequest item : itemsList) {
			Product p = productRepository.findById(item.getId())
					.orElseThrow(() -> new RuntimeException("Product by ID " + item.getId() + " not found!!!!"));
			p.setStock(p.getStock() - item.getQuantity());
			productRepository.save(p);

		}

	}

	@Override
	public Product saveProductToDb(AddNewProduct newProduct) {

		Product p = new Product();

//		image.transferTo(new File(location, image.getOriginalFilename()));

//		p.setImage(image.getOriginalFilename());
		p.setName(newProduct.getName());
		p.setDescription(newProduct.getDescription());
		p.setSubCategoryName(newProduct.getSubCategoryName());
		p.setPrice(newProduct.getPrice());
		p.setStock(newProduct.getStock());
		p.setAdditionalDetails(newProduct.getAdditionalDetails());
		p.setProduct_added_date(Instant.now());

		return productRepository.save(p);
	}

	@Override
	public Product addImage(String productId, MultipartFile image) throws IllegalStateException, IOException {
		Product p = productRepository.findById(productId).get();

		image.transferTo(new File(location, productId + ".jpeg"));

		p.setImage(productId + ".jpeg");

		return productRepository.save(p);
	}

	@Override
	public Page<ProductDetailsRequest> getAllByQ(String query, Pageable pageable) {

		return productRepository.findAllByQ(query, pageable);
	}

	@Override
	public Page<ProductDetailsRequest> getAllBySubCategory(String query, Pageable pageable) {

		return productRepository.findAllBySubCategory(query, pageable);
	}

	@Override
	public Page<ProductDetailsRequest> getAllByQ(Pageable pageable) {

		return productRepository.getAllByQ(pageable);
	}

	@Override
	public Page<ProductDetailsRequest> getAllByCategory(String query, Pageable pageable) {
		List<ProductDetailsRequest> productList = new ArrayList<>();
		Category category = categoryRepository.findByCategoryName(query)
				.orElseThrow(() -> new RuntimeException("Category by Name " + query + " not found!!!!"));
		List<String> subCategories = category.getSubCategory();
		List<Product> products = productRepository.findAll();
		for (Product p : products) {
			if (subCategories.contains(p.getSubCategoryName())) {
				productList.add(new ProductDetailsRequest(p.getId(), p.getName(), p.getImage(), p.getPrice()));
			}
		}
		int fromIndex = pageable.getPageNumber() * pageable.getPageSize();
		int toIndex = (pageable.getPageNumber() + 1) * pageable.getPageSize();

		List<ProductDetailsRequest> subList = new ArrayList<>();

		if (toIndex > productList.size())
			toIndex = productList.size();

		if (fromIndex < productList.size())
			subList = productList.subList(fromIndex, toIndex);
		return new PageImpl<>(subList, pageable, productList.size());
	}
}
