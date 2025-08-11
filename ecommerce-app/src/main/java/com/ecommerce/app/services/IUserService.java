package com.ecommerce.app.services;

import com.ecommerce.app.dto.response.ProfileResponse;
import com.ecommerce.app.models.User;

public interface IUserService {

	User getById(String userId);

	User getByEmail(String email);

	User saveUser(User user);

	ProfileResponse getProfile(User user);

}
