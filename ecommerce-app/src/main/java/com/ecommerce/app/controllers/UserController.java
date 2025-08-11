package com.ecommerce.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.app.dto.request.AddAddressRequest;
import com.ecommerce.app.dto.request.ChangeAddressRequest;
import com.ecommerce.app.dto.request.PasswordChangeRequest;
import com.ecommerce.app.dto.request.UserDetailsUpdateRequest;
import com.ecommerce.app.dto.response.MessageResponse;
import com.ecommerce.app.models.Address;
import com.ecommerce.app.models.AddressType;
import com.ecommerce.app.models.User;
import com.ecommerce.app.security.jwt.JwtUtils;
import com.ecommerce.app.services.IUserService;

@RestController
@RequestMapping("/api/user-details")
@CrossOrigin("*")
public class UserController {

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	IUserService userService;

	@Autowired
	PasswordEncoder encoder;

	// Display Profile Details
	@GetMapping("/display")
	public ResponseEntity<?> displayProfile(@RequestHeader String authorization) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		return new ResponseEntity<>(userService.getProfile(user), HttpStatus.OK);
	}

	// Display List of Addresses
	@GetMapping("/address/display")
	public ResponseEntity<?> displayAddress(@RequestHeader String authorization) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		return new ResponseEntity<>(user.getAddresses(), HttpStatus.OK);
	}

	// Edit Profile Details
	@PostMapping("/edit")
	public ResponseEntity<?> editUserDetails(@RequestHeader String authorization,
			@RequestBody UserDetailsUpdateRequest userDetails) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		user.setFirstname(userDetails.getFirstname());
		user.setLastname(userDetails.getLastname());
		// user.setPassword(encoder.encode(userDetails.getPassword()));
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("User details updated successfully"));
	}

	// Change password Details
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestHeader String authorization,
			@RequestBody PasswordChangeRequest changePassword) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		if (!encoder.matches(changePassword.getOldPassword(), user.getPassword())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Old Password Mismatch"));
		}
		user.setPassword(encoder.encode(changePassword.getNewPassword()));
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
	}

	// Add Address
	@PostMapping("/address/add")
	public ResponseEntity<?> addAddress(@RequestHeader String authorization,
			@RequestBody AddAddressRequest addAddress) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		Address address = new Address(AddressType.valueOf(addAddress.getTypeOfAddress().toUpperCase()),
				addAddress.getCountry(), addAddress.getState(), addAddress.getFullName(), addAddress.getMobileNumber(),
				addAddress.getPincode(), addAddress.getLine1(), addAddress.getLine2(), addAddress.getLandmark(),
				addAddress.getTownCity());
		if (user.getAddresses().containsKey(address.getId()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Address already present"));
		user.getAddresses().put(address.getId(), address);
		if (user.getBillingAddress() == null)
			user.setBillingAddress(address);
		if (user.getShippingAddress() == null)
			user.setShippingAddress(address);
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Address added successfully"));
	}

	// Delete Address
	@DeleteMapping("/address/delete")
	public ResponseEntity<?> deleteAddress(@RequestHeader String authorization,
			@RequestBody ChangeAddressRequest deleteAddress) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		if (!user.getAddresses().containsKey(deleteAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Address not found."));
		if (user.getBillingAddress().getId().equals(deleteAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(
					"Default Address can not be remove!! first change the Default Address then Delete"));
		user.getAddresses().remove(deleteAddress.getAddressId());
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Address removed successfully"));
	}

	// Select Default Address
	@PostMapping("/address/change-billing")
	public ResponseEntity<?> changeDefaultBillingAddress(@RequestHeader String authorization,
			@RequestBody ChangeAddressRequest changeAddress) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		if (!user.getAddresses().containsKey(changeAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Billing Address not found."));
		if (user.getBillingAddress().getId().equals(changeAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new MessageResponse("This Billing address is already set to default"));
		user.setBillingAddress(user.getAddresses().get(changeAddress.getAddressId()));
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Default Billing Address changed successfully"));
	}

	// Select Default Address
	@PostMapping("/address/change-shipping")
	public ResponseEntity<?> changeDefaultShippingAddress(@RequestHeader String authorization,
			@RequestBody ChangeAddressRequest changeAddress) {
		User user = jwtUtils.getUserFromRequestHeader(authorization);
		if (!user.getAddresses().containsKey(changeAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Shipping Address not found."));
		if (user.getShippingAddress().getId().equals(changeAddress.getAddressId()))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new MessageResponse("This Shipping address is already set to default"));
		user.setShippingAddress(user.getAddresses().get(changeAddress.getAddressId()));
		userService.saveUser(user);
		return ResponseEntity.ok(new MessageResponse("Default Shipping Address changed successfully"));
	}
}