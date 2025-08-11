package com.ecommerce.app.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TransactionRequest {
	private String transactionId;
	private String razorpayOrderId;
//	@JsonProperty("isPaid")
	private boolean isPaid;


}
