package com.ecommerce.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.app.models.ERole;
import com.ecommerce.app.models.Role;
import com.ecommerce.app.repository.RoleRepository;

@Service
@Transactional
public class RoleServiceImplementation implements IRoleService {
	@Autowired
	RoleRepository roleRepository;

	@Override
	public Role getByName(ERole roleAdmin) {

		return roleRepository.findByName(roleAdmin).orElseThrow(() -> new RuntimeException("Role is not found."));
	}

}