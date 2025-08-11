package com.ecommerce.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.app.dto.request.ProductRequest;
import com.ecommerce.app.dto.request.ShoppingCartProductsRequest;
import com.ecommerce.app.dto.response.MessageResponse;
import com.ecommerce.app.models.Product;
import com.ecommerce.app.models.User;
import com.ecommerce.app.security.jwt.JwtUtils;
import com.ecommerce.app.services.IProductService;
import com.ecommerce.app.services.IUserService;

@RestController
@RequestMapping("/api/shopping-cart")
@CrossOrigin("*")
public class ShoppingCartController {

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private IUserService userService;

	@Autowired
	private IProductService productService;

	// for displaying Shopping Cart
	@GetMapping("/display")
	public ResponseEntity<?> displayCart(@RequestHeader String authorization) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		productService.stockUnavailable(user.getShoppingCart());
		return ResponseEntity.ok(user.getShoppingCart());
	}

	// for adding to Cart
	@PostMapping("/add")
	public ResponseEntity<?> addToCart(@RequestHeader String authorization,
			@RequestBody ProductRequest productRequest) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		ShoppingCartProductsRequest cartProduct = productService
				.getShoppingCartProductById(productRequest.getProductId(), productRequest.getQuantity());
		// cartProduct.setQuantity(productRequest.getQuantity());
		Product product = productService.getProductById(productRequest.getProductId());
		if (user.getShoppingCart().contains(cartProduct)) {
			ShoppingCartProductsRequest existingCartProduct = user.getShoppingCart()
					.get(user.getShoppingCart().indexOf(cartProduct));
			if (existingCartProduct.getQuantity() >= product.getStock())
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(new MessageResponse("Cannot add quantity greater than stock available"));
			existingCartProduct.setQuantity(existingCartProduct.getQuantity() + 1);
			existingCartProduct.setSubTotal(existingCartProduct.getPrice() * existingCartProduct.getQuantity());
//                return ResponseEntity.ok(new MessageResponse("Product added to Shopping Cart"));
		} else
			user.getShoppingCart().add(cartProduct);
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Product added to Shopping Cart successfully!"));
	}

	// for removing from cart
//	@DeleteMapping("/remove")
//	public ResponseEntity<?> removeFromCart(@RequestHeader String authorization,
//			@RequestBody ProductRequest productRequest) {
//		User user = jwtUtils.getUserFromRequestHeader(authorization);
//
//		ShoppingCartProductsRequest cartProduct = productService
//				.getShoppingCartProductById(productRequest.getProductId(), 1);
//
//		if (user.getShoppingCart().isEmpty())
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Shopping Cart is Empty"));
//		if (!user.getShoppingCart().contains(cartProduct))
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Product does not exist!"));
//		ShoppingCartProductsRequest existingCartProduct = user.getShoppingCart()
//				.get(user.getShoppingCart().indexOf(cartProduct));
//		if (existingCartProduct.getQuantity() > 1)
//			existingCartProduct.setQuantity(existingCartProduct.getQuantity() - 1);
//		else
//			user.getShoppingCart().remove(existingCartProduct);
//		userService.saveUser(user);
//		return ResponseEntity.ok(new MessageResponse("Product removed from Cart successfully!"));
//	}

	// for removing product from cart
	@DeleteMapping("/remove-product")
	public ResponseEntity<?> removeProductFromCart(@RequestHeader String authorization,
			@RequestBody ProductRequest productRequest) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);

		ShoppingCartProductsRequest cartProduct = productService
				.getShoppingCartProductById(productRequest.getProductId(), 1);

		if (user.getShoppingCart().isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Shopping Cart is Empty"));
		if (!user.getShoppingCart().contains(cartProduct))
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Product does not exist!"));
		ShoppingCartProductsRequest existingCartProduct = user.getShoppingCart()
				.get(user.getShoppingCart().indexOf(cartProduct));
		user.getShoppingCart().remove(existingCartProduct);
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Product removed from Cart successfully!"));
	}

	// for removing all products from cart
	@DeleteMapping("/remove-all")
	public ResponseEntity<?> removeAllProductFromCart(@RequestHeader String authorization) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		if (user.getShoppingCart().isEmpty())
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Shopping Cart is Empty"));
		user.getShoppingCart().clear();
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Product removed from Cart successfully!"));
	}
}
