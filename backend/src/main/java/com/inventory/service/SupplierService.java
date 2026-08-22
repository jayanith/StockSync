package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.model.Supplier;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplierData) {
        Supplier supplier = getSupplierById(id);
        if (supplierData.getName() != null) supplier.setName(supplierData.getName());
        if (supplierData.getContactPerson() != null) supplier.setContactPerson(supplierData.getContactPerson());
        if (supplierData.getEmail() != null) supplier.setEmail(supplierData.getEmail());
        if (supplierData.getPhone() != null) supplier.setPhone(supplierData.getPhone());
        if (supplierData.getAddress() != null) supplier.setAddress(supplierData.getAddress());
        if (supplierData.getWebsite() != null) supplier.setWebsite(supplierData.getWebsite());
        if (supplierData.getNotes() != null) supplier.setNotes(supplierData.getNotes());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }

    public List<Product> getSupplierProducts(Long supplierId) {
        return productRepository.findBySupplierId(supplierId);
    }
}
