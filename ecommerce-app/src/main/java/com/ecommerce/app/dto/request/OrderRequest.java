package com.ecommerce.app.dto.request;

import java.util.ArrayList;
import java.util.List;

import com.ecommerce.app.models.Address;

import lombok.Data;

@Data
public class OrderRequest {

	List<ShoppingCartProductsRequest> listOfProducts = new ArrayList<>();
	Address billingAddress;
	Address shippingAddress;

}
