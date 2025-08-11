package com.ecommerce.app.services;

import com.ecommerce.app.models.ERole;
import com.ecommerce.app.models.Role;

public interface IRoleService {

	Role getByName(ERole roleAdmin);

}