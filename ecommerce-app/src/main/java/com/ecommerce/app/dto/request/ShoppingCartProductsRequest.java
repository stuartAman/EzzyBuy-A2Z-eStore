package com.ecommerce.app.dto.request;

import java.util.Objects;

import lombok.Data;

@Data
public class ShoppingCartProductsRequest {

	String id, name, image;
	Double price;
	Integer quantity = 1;
	Double subTotal;
	Boolean isStockAvailable=true;

	public ShoppingCartProductsRequest(String id, String name, String image, Double price, Integer quantity) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.price = price;
		this.quantity = quantity;
		this.subTotal = price * quantity;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ShoppingCartProductsRequest other = (ShoppingCartProductsRequest) obj;
		return Objects.equals(id, other.id);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
