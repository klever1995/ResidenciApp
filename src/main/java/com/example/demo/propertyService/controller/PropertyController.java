package com.example.demo.propertyService.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import com.example.demo.propertyService.dao.PropertyDAO;
import com.example.demo.propertyService.dto.PropertyDTO;


@RestController
@RequestMapping("/api/property")
public class PropertyController {
    @Autowired
    private PropertyDAO propertyDAO;

    @GetMapping("/properties")
    public List<PropertyDTO> getAllProperties() {
         return propertyDAO.getAllProperties();
    }
     
/*   @GetMapping("/properties/{id}")
    public PropertyDTO getPropertyById(@PathVariable int id) {
         return propertyDAO.getPropertyById(id);
    }
     
    @PostMapping("/properties")
    public PropertyDTO addProperty(@RequestBody PropertyDTO property) {
         return propertyDAO.addProperty(property);
    }
     
    @PutMapping("/properties")
    public PropertyDTO updateProperty(@RequestBody PropertyDTO property) {
         return propertyDAO.updateProperty(property);
    }
     
    @DeleteMapping("/properties/{id}")
    public void deleteProperty(@PathVariable int id) {
         propertyDAO.deleteProperty(id);
    }*/
}
