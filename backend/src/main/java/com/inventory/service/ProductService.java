package com.inventory.service;

import com.inventory.model.Category;
import com.inventory.model.Product;
import com.inventory.model.Supplier;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    private Category resolveCategory(Object categoryObj) {
        if (categoryObj == null) return null;
        if (categoryObj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) categoryObj;
            Object idVal = map.get("id") != null ? map.get("id") : map.get("_id");
            if (idVal != null) {
                try {
                    return categoryRepository.findById(Long.parseLong(idVal.toString())).orElse(null);
                } catch (Exception ignored) {}
            }
            if (map.get("name") != null) {
                return categoryRepository.findByName(map.get("name").toString()).orElse(null);
            }
        }
        String catStr = categoryObj.toString().trim();
        if (catStr.isEmpty()) return null;
        try {
            Long categoryId = Long.parseLong(catStr);
            return categoryRepository.findById(categoryId).orElse(null);
        } catch (NumberFormatException e) {
            return categoryRepository.findByName(catStr).orElse(null);
        }
    }

    private Supplier resolveSupplier(Object supplierObj) {
        if (supplierObj == null) return null;
        if (supplierObj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) supplierObj;
            Object idVal = map.get("id") != null ? map.get("id") : map.get("_id");
            if (idVal != null) {
                try {
                    return supplierRepository.findById(Long.parseLong(idVal.toString())).orElse(null);
                } catch (Exception ignored) {}
            }
        }
        String supStr = supplierObj.toString().trim();
        if (supStr.isEmpty()) return null;
        try {
            Long supplierId = Long.parseLong(supStr);
            return supplierRepository.findById(supplierId).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public Product createProduct(Map<String, Object> productData) {
        Product.ProductBuilder builder = Product.builder();

        builder.name(productData.get("name") != null ? productData.get("name").toString() : "Untitled Product");
        builder.sku(productData.get("sku") != null ? productData.get("sku").toString() : "SKU-" + System.currentTimeMillis());
        
        if (productData.get("barcode") != null) {
            builder.barcode(productData.get("barcode").toString());
        }

        double price = 0.0;
        if (productData.get("price") != null && !productData.get("price").toString().trim().isEmpty()) {
            try { price = Double.parseDouble(productData.get("price").toString()); } catch (Exception ignored) {}
        }
        builder.price(price);

        int quantity = 0;
        if (productData.get("quantity") != null && !productData.get("quantity").toString().trim().isEmpty()) {
            try { quantity = Integer.parseInt(productData.get("quantity").toString()); } catch (Exception ignored) {}
        }
        builder.quantity(quantity);

        if (productData.get("description") != null) {
            builder.description(productData.get("description").toString());
        }

        builder.isActive(productData.get("isActive") == null || Boolean.parseBoolean(productData.get("isActive").toString()));

        // Resolve Category & Supplier safely
        builder.category(resolveCategory(productData.get("category")));
        builder.supplier(resolveSupplier(productData.get("supplier")));

        // Handle images
        if (productData.get("images") != null) {
            if (productData.get("images") instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> images = (List<String>) productData.get("images");
                builder.images(new ArrayList<>(images));
            }
        }

        return productRepository.save(builder.build());
    }

    public Product updateProduct(Long id, Map<String, Object> productData) {
        Product product = getProductById(id);

        if (productData.containsKey("name") && productData.get("name") != null) {
            product.setName(productData.get("name").toString());
        }
        if (productData.containsKey("sku") && productData.get("sku") != null) {
            product.setSku(productData.get("sku").toString());
        }
        if (productData.containsKey("barcode")) {
            product.setBarcode(productData.get("barcode") != null ? productData.get("barcode").toString() : null);
        }
        if (productData.containsKey("price") && productData.get("price") != null) {
            try {
                product.setPrice(Double.parseDouble(productData.get("price").toString()));
            } catch (Exception ignored) {}
        }
        if (productData.containsKey("quantity") && productData.get("quantity") != null) {
            try {
                product.setQuantity(Integer.parseInt(productData.get("quantity").toString()));
            } catch (Exception ignored) {}
        }
        if (productData.containsKey("description")) {
            product.setDescription(productData.get("description") != null ? productData.get("description").toString() : null);
        }
        if (productData.containsKey("isActive") && productData.get("isActive") != null) {
            product.setIsActive(Boolean.parseBoolean(productData.get("isActive").toString()));
        }

        if (productData.containsKey("category")) {
            product.setCategory(resolveCategory(productData.get("category")));
        }

        if (productData.containsKey("supplier")) {
            product.setSupplier(resolveSupplier(productData.get("supplier")));
        }

        if (productData.containsKey("images") && productData.get("images") != null) {
            if (productData.get("images") instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> images = (List<String>) productData.get("images");
                product.setImages(new ArrayList<>(images));
            }
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.searchProducts(query);
    }
}
