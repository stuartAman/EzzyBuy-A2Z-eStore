package com.ecommerce.app.controllers;

import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.app.config.RazorPayClientConfig;
import com.ecommerce.app.dto.request.NewOrderRequest;
import com.ecommerce.app.dto.request.TransactionRequest;
import com.ecommerce.app.dto.response.MessageResponse;
import com.ecommerce.app.dto.response.OrderResponse;
import com.ecommerce.app.models.Order;
import com.ecommerce.app.models.OrderStatus;
import com.ecommerce.app.models.User;
import com.ecommerce.app.repository.OrderRepository;
import com.ecommerce.app.security.jwt.JwtUtils;
import com.ecommerce.app.services.IOrderService;
import com.ecommerce.app.services.IProductService;
import com.ecommerce.app.services.IUserService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

	private RazorpayClient client;

	@SuppressWarnings("unused")
	private RazorPayClientConfig razorPayClientConfig;

	@Autowired
	IOrderService orderService;

	@Autowired
	OrderRepository orderRepository;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private IUserService userService;

	@Autowired
	private IProductService productService;

	@Value("${file.upload.location}/invoice")
	private String location;


	public OrderController(RazorPayClientConfig razorpayClientConfig) throws RazorpayException {
		this.razorPayClientConfig = razorpayClientConfig;
		this.client = new RazorpayClient(razorpayClientConfig.getKey(), razorpayClientConfig.getSecret());
	}
//	//For Admin
//	@GetMapping("/admin/display")
//	public ResponseEntity<?> getLatestOrders(){
//		//Need to create check for admin users
//        List<OrderRequest> orders;
//        try(Stream<OrderRequest> stream = orderService.getLatestOrders()) {
//            orders = stream.collect(Collectors.toList());
//        }
//        return ResponseEntity.ok(orders);
//    }

	// For User
	@GetMapping("/display")
	public ResponseEntity<?> getLatestOrders(@RequestHeader String authorization) {

		User user = jwtUtils.getUserFromRequestHeader(authorization);
		List<Order> orders;
		try (Stream<Order> stream = user.getOrders().stream()
				.sorted((o1, o2) -> o2.getOrderDate().compareTo(o1.getOrderDate()))) {
			orders = stream.collect(Collectors.toList());
		}
		return ResponseEntity.ok(orders);
	}

	@PostMapping("/create")
	public ResponseEntity<?> createOrder(@RequestHeader String authorization,
			@RequestBody NewOrderRequest newOrderRequest) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		
		if (newOrderRequest.getProductsList().isEmpty() || newOrderRequest.getBillingAddressId() == null
				|| newOrderRequest.getShippingAddressId() == null)
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Cannot create order !!!"));
		
		Order newOrder = orderService.createNewOrder(orderService.createNewOrderRequest(newOrderRequest, user));
		if (productService.stockUnavailable(newOrder.getItemList()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new MessageResponse("Cannot order as stock is unavailable"));

		OrderResponse razorPay = null;
		try {
			// The transaction amount is expressed in the currency subunit, such
			// as paise (in case of INR)
			String amountInPaise = convertRupeeToPaise(newOrder.getOrderAmount().toString());
			// Create an order in RazorPay and get the order id
			//cannot convert from com.razorpay.Order to com.ecommerce.app.models.Order here order mismatch error coming thats why we are using inline import
			com.razorpay.Order order = createRazorPayOrder(amountInPaise);
			razorPay = getOrderResponse((String) order.get("id"));
			newOrder.setRazorpayOrderId(razorPay.getRazorpayOrderId());
			// Save order in the database

			user.getOrders().add(orderService.saveOrder(newOrder));
			user.setShoppingCart(new ArrayList<>());
			userService.saveUser(user);
		} catch (RazorpayException e) {

			return ResponseEntity.ok("Did't work!!");
		}
		return ResponseEntity.ok(razorPay);

	}

	private OrderResponse getOrderResponse(String orderId) {
		OrderResponse razorPay = new OrderResponse();

		razorPay.setRazorpayOrderId(orderId);

		return razorPay;
	}

	private com.razorpay.Order createRazorPayOrder(String amount) throws RazorpayException {
		JSONObject options = new JSONObject();
		options.put("amount", amount);
		options.put("currency", "INR");
		options.put("receipt", "txn_123456");
		return client.Orders.create(options);
	}

	private String convertRupeeToPaise(String paise) {
		BigDecimal b = new BigDecimal(paise);
		BigDecimal value = b.multiply(new BigDecimal("100"));
		return value.setScale(0, RoundingMode.UP).toString();
	}

	@PostMapping("/transaction-handler")
	public ResponseEntity<?> transactionHandler(@RequestHeader String authorization,
			@RequestBody TransactionRequest transactionRequest) {

		User user = jwtUtils.getUserFromRequestHeader(authorization);
		Order order = orderService.getOrderByRazorpayId(user.getOrders(), transactionRequest.getRazorpayOrderId());
		// Order order =
		// orderService.getOrderByrazorpayId(transactionRequest.getRazorpayOrderId());
		if (order != null) {
			if (!(order.getOrderStatus() == OrderStatus.PAYMENT_PENDING || order.getOrderStatus() == OrderStatus.FAILED))
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Payment Already Done!"));
			if (!transactionRequest.isPaid()) {
				order.setOrderStatus(OrderStatus.FAILED);
				orderService.saveOrder(order);
				return ResponseEntity.ok(new MessageResponse("Payment Failed !!"));
			}
			System.out.println(transactionRequest.toString());

			productService.reduceStock(order.getItemList());

			order.setOrderStatus(OrderStatus.PLACED);
			order.setTransactionId(transactionRequest.getTransactionId());
			orderService.saveOrder(order);
			return ResponseEntity.ok(order.getId());
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Order Not Found"));
	}

	@GetMapping(value = "/invoice/{orderId}", produces = MediaType.APPLICATION_PDF_VALUE)
	public ResponseEntity<?> downloadInvoice(@RequestHeader String authorization, @PathVariable String orderId)
	        throws JRException, IOException {

	    // Extract user information from the JWT token in the Authorization header
	    User user = jwtUtils.getUserFromRequestHeader(authorization);

	    // Retrieve the list of orders for the user that match the given orderId
	    List<Order> orders = orderService.getListOfOrder(user.getOrders(), orderId);

	    // Proceed only if matching orders are found
	    if (!orders.isEmpty()) {

	        // Convert the list of orders into a JasperReports-compatible data source
	        JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(orders, false);

	        // Load and compile the JasperReports template from the specified file path
	        JasperReport compileReport = JasperCompileManager
	                .compileReport(new FileInputStream("src/main/resources/invoice.jrxml"));

	        // Initialize an empty map for report parameters (can be used for dynamic fields)
	        Map<String, Object> parameters = new HashMap<>();

	        // Fill the compiled report with data and parameters to produce a printable report
	        JasperPrint jasperPrint = JasperFillManager.fillReport(compileReport, parameters, beanCollectionDataSource);

	        // Export the filled report to a PDF byte array (in-memory, not saved to disk)
	        byte data[] = JasperExportManager.exportReportToPdf(jasperPrint);

	        // Set HTTP headers to display the PDF inline and name it using the orderId
	        HttpHeaders headers = new HttpHeaders();
	        headers.set("Content-Disposition", "inline; filename=" + orderId + ".pdf");

	        // Return a 200 OK response with the PDF content and headers
	        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF).body(data);
	    }

	    // If no matching orders are found, return a 400 Bad Request with an error message
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Order Not Found"));
	}


	@GetMapping("/invoice/image/{imageName}")
	public ResponseEntity<byte[]> getFile(@PathVariable String imageName) throws IOException {
		Path path = Paths.get(location, imageName);
		byte[] imageData = Files.readAllBytes(path);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imageName + "\"")
				.body(imageData);
	}
}
