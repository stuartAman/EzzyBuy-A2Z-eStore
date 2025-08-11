package com.ecommerce.app.dto.request;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class NewOrderRequest {
	List<ProductRequest> productsList = new ArrayList<>();
	Integer billingAddressId;
	Integer shippingAddressId;
}
