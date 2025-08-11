package com.ecommerce.app.dto.request;

import lombok.Value;

@Value
public class ProductDetailsRequest {

	String id, name, image;
	Double price;

}
