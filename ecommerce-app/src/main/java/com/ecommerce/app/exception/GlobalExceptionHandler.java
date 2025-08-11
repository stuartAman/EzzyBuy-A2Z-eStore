package com.ecommerce.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ecommerce.app.dto.response.MessageResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

	// Runtime exception
	@ExceptionHandler({ RuntimeException.class })
	protected ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
		return ResponseEntity.internalServerError().body(new MessageResponse(ex.getMessage()));
	}
	
	// Security Exception
	@ExceptionHandler({AccessDeniedException.class})
	protected ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse(ex.getMessage()));
	}
}
