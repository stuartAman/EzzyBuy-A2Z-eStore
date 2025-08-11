package com.ecommerce.app.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.app.dto.request.NewOrderRequest;
import com.ecommerce.app.dto.request.OrderRequest;
import com.ecommerce.app.dto.request.ProductRequest;
import com.ecommerce.app.dto.request.ShoppingCartProductsRequest;
import com.ecommerce.app.models.Order;
import com.ecommerce.app.models.User;
import com.ecommerce.app.repository.OrderRepository;
import com.ecommerce.app.repository.UserRepository;

@Service
@Transactional
public class OrderServiceImplementation implements IOrderService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	IProductService productService;

//	@Override
//	public Stream<OrderRequest> getLatestOrders() {
//		
//		return orderRepository.getLatestOrders();
//	}
//	
	@Override
	public Double getOrderAmount(List<ShoppingCartProductsRequest> listOfProducts) {
		Double amount = 0.0;

		for (ShoppingCartProductsRequest product : listOfProducts) {
			amount += product.getSubTotal();
		}
		return amount;
	}

	@Override
	public Order saveOrder(Order order) {
		return orderRepository.save(order);
	}

	@Override
	public Order getOrderById(String orderId) {

		return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order Id Not Found !!"));
	}

	@Override
	public Order createNewOrder(OrderRequest orderRequest) {
		return new Order(getOrderAmount(orderRequest.getListOfProducts()), orderRequest.getListOfProducts(),
				orderRequest.getShippingAddress(), orderRequest.getBillingAddress());
	}

	@Override
	public OrderRequest createNewOrderRequest(NewOrderRequest newOrderRequest, User user) {
		OrderRequest orderRequest = new OrderRequest();
		for (ProductRequest productRequest : newOrderRequest.getProductsList()) {
			orderRequest.getListOfProducts().add(productService
					.getShoppingCartProductById(productRequest.getProductId(), productRequest.getQuantity()));
		}
		orderRequest.setBillingAddress(user.getAddresses().get(newOrderRequest.getBillingAddressId()));
		orderRequest.setShippingAddress(user.getAddresses().get(newOrderRequest.getShippingAddressId()));

		return orderRequest;
	}

	@Override
	public Order getOrderByRazorpayId(Set<Order> orderList, String razorpayId) {
		for (Order order : orderList) {
			if (order.getRazorpayOrderId().equals(razorpayId)) {
				return order;
			}
		}
		return null;
	}

	@Override
	public List<Order> getListOfOrder(Set<Order> orderList, String orderId) {
		List<Order> orders = new ArrayList<>();
		for (Order order : orderList) {
			if (order.getId().equals(orderId)) {
				orders.add(order);
				return orders;
			}
		}
		return null;
	}

}
