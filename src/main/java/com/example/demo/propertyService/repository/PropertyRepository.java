package com.example.demo.propertyService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.propertyService.dto.PropertyDTO;

public interface PropertyRepository extends JpaRepository<PropertyDTO, Integer> {
}
