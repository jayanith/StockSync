package com.inventory.config;

import com.inventory.model.*;
import com.inventory.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private WarehouseInventoryRepository warehouseInventoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users with explicit enterprise roles (Admin, Manager, Warehouse Staff, Supplier)
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = User.builder()
                    .name("Alexander Sterling")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("Admin")
                    .status("Active")
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Seeded Admin User: admin@example.com / admin123 (Role: Admin)");
        }

        if (!userRepository.existsByEmail("manager@example.com")) {
            User manager = User.builder()
                    .name("Victoria Windsor")
                    .email("manager@example.com")
                    .password(passwordEncoder.encode("manager123"))
                    .role("Manager")
                    .status("Active")
                    .build();
            userRepository.save(manager);
            System.out.println(">>> Seeded Manager User: manager@example.com / manager123 (Role: Manager)");
        }

        if (!userRepository.existsByEmail("staff@example.com")) {
            User staff = User.builder()
                    .name("Arthur Pendelton")
                    .email("staff@example.com")
                    .password(passwordEncoder.encode("staff123"))
                    .role("Warehouse Staff")
                    .status("Active")
                    .build();
            userRepository.save(staff);
            System.out.println(">>> Seeded Warehouse Staff: staff@example.com / staff123 (Role: Warehouse Staff)");
        }

        if (!userRepository.existsByEmail("supplier@example.com")) {
            User supplierUser = User.builder()
                    .name("Henri de Montmollin")
                    .email("supplier@example.com")
                    .password(passwordEncoder.encode("supplier123"))
                    .role("Supplier")
                    .status("Active")
                    .build();
            userRepository.save(supplierUser);
            System.out.println(">>> Seeded Supplier User: supplier@example.com / supplier123 (Role: Supplier)");
        }

        // 2. Seed Categories
        if (categoryRepository.count() == 0) {
            Category timepieces = categoryRepository.save(Category.builder().name("Fine Watches & Timepieces").description("Haute horlogerie and chronographs").build());
            Category leather = categoryRepository.save(Category.builder().name("Leather Goods & Luggage").description("Handcrafted Italian leather accessories").build());
            Category furniture = categoryRepository.save(Category.builder().name("Antique & Bespoke Furniture").description("Mahogany and Chesterfield collections").build());
            Category spirits = categoryRepository.save(Category.builder().name("Rare Spirits & Fine Wine").description("Vintage cellared collections").build());
            Category apparel = categoryRepository.save(Category.builder().name("Heritage Tailoring & Apparel").description("Cashmere, tweed and formal evening wear").build());
            Category electronics = categoryRepository.save(Category.builder().name("Executive Tech & Audio").description("Precision engineered executive electronics").build());

            // 3. Seed Suppliers
            Supplier sup1 = supplierRepository.save(Supplier.builder()
                    .name("Geneva Horological Guild")
                    .contactPerson("Henri de Montmollin")
                    .email("supplier@example.com")
                    .phone("+41 22 700 8820")
                    .address("14 Rue du Rhône, Geneva, Switzerland")
                    .website("https://genevawatches.ch")
                    .notes("Primary supplier of luxury timepieces")
                    .productsSupplied(4)
                    .build());

            Supplier sup2 = supplierRepository.save(Supplier.builder()
                    .name("Savile Row Clothiers")
                    .contactPerson("Charles Beauchamp")
                    .email("bespoke@savilerow.co.uk")
                    .phone("+44 20 7946 0912")
                    .address("8 Savile Row, Mayfair, London, UK")
                    .website("https://savilerowtailors.co.uk")
                    .notes("Highland wool and cashmere mill direct")
                    .productsSupplied(6)
                    .build());

            Supplier sup3 = supplierRepository.save(Supplier.builder()
                    .name("Bordeaux Heritage Cellars")
                    .contactPerson("Élise Laurent")
                    .email("chateau@heritagecellars.fr")
                    .phone("+33 5 56 00 12 34")
                    .address("Grand Cru Estate, Saint-Émilion, France")
                    .website("https://heritagecellars.fr")
                    .notes("Reserve vineyard vintages")
                    .productsSupplied(3)
                    .build());

            // 4. Seed Warehouses
            Warehouse w1 = warehouseRepository.save(Warehouse.builder()
                    .name("Mayfair Vault & Depository")
                    .location("London, Mayfair")
                    .address("22 Berkeley Square, London W1J 6ES")
                    .capacity(5000)
                    .manager("Edward Kensington")
                    .phone("+44 20 7123 4567")
                    .email("mayfair.depot@inventory.com")
                    .status("Active")
                    .build());

            Warehouse w2 = warehouseRepository.save(Warehouse.builder()
                    .name("Edinburgh Highland Depot")
                    .location("Edinburgh, Scotland")
                    .address("10 Royal Mile, Edinburgh EH1 2PB")
                    .capacity(8000)
                    .manager("Alistair MacLeod")
                    .phone("+44 131 496 0888")
                    .email("highland.depot@inventory.com")
                    .status("Active")
                    .build());

            Warehouse w3 = warehouseRepository.save(Warehouse.builder()
                    .name("Geneva FreePort Vault")
                    .location("Geneva, Switzerland")
                    .address("Route du Grand-Lancy 6, 1227 Carouge, Switzerland")
                    .capacity(12000)
                    .manager("Jean-Paul Vaneck")
                    .phone("+41 22 300 4000")
                    .email("geneva.vault@inventory.com")
                    .status("Active")
                    .build());

            // 5. Seed Products
            Product p1 = productRepository.save(Product.builder()
                    .name("Royal Oak Chronograph 18k Rose Gold")
                    .sku("RO-CHRONO-RG01")
                    .barcode("7613298401123")
                    .price(42500.00)
                    .quantity(8)
                    .category(timepieces)
                    .supplier(sup1)
                    .description("Self-winding chronograph in 18-carat pink gold with Grande Tapisserie dial and hand-finished alligator strap.")
                    .isActive(true)
                    .images(List.of("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop"))
                    .build());

            Product p2 = productRepository.save(Product.builder()
                    .name("Double-Breasted Cashmere Overcoat")
                    .sku("SR-COAT-CSH02")
                    .barcode("5012345678901")
                    .price(3850.00)
                    .quantity(15)
                    .category(apparel)
                    .supplier(sup2)
                    .description("Pure Scottish cashmere overcoat tailored with horn buttons and silk cupro lining.")
                    .isActive(true)
                    .images(List.of("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop"))
                    .build());

            Product p3 = productRepository.save(Product.builder()
                    .name("Chesterfield Deep-Tufted Leather Armchair")
                    .sku("CH-LEATH-ARM03")
                    .barcode("5012345678902")
                    .price(2900.00)
                    .quantity(12)
                    .category(furniture)
                    .supplier(sup2)
                    .description("Hand-burnished antique saddle brown leather with solid mahogany turned legs and brass castors.")
                    .isActive(true)
                    .images(List.of("https://images.unsplash.com/photo-1580481077197-6a4a0c83a54d?w=500&auto=format&fit=crop"))
                    .build());

            Product p4 = productRepository.save(Product.builder()
                    .name("Château Grand Cru Reserve 2010 (Case of 6)")
                    .sku("BD-CRU-2010-04")
                    .barcode("3105345678903")
                    .price(6200.00)
                    .quantity(24)
                    .category(spirits)
                    .supplier(sup3)
                    .description("Exceptional vintage cellared in Saint-Émilion. Notes of blackcurrant, cedar and crushed violets.")
                    .isActive(true)
                    .images(List.of("https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop"))
                    .build());

            Product p5 = productRepository.save(Product.builder()
                    .name("Full-Grain Bridle Leather Weekender Bag")
                    .sku("LG-WKND-BRN05")
                    .barcode("5012345678905")
                    .price(1650.00)
                    .quantity(18)
                    .category(leather)
                    .supplier(sup2)
                    .description("English bridle leather luggage with solid brass Raccagni hardware and detachable wool strap.")
                    .isActive(true)
                    .images(List.of("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop"))
                    .build());

            // 6. Seed Warehouse Inventory Link
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w1).product(p1).quantity(5).build());
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w3).product(p1).quantity(3).build());
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w1).product(p2).quantity(10).build());
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w2).product(p2).quantity(5).build());
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w1).product(p3).quantity(8).build());
            warehouseInventoryRepository.save(WarehouseInventory.builder().warehouse(w2).product(p3).quantity(4).build());

            // 7. Seed Customer Orders
            Order o1 = Order.builder()
                    .customerName("Lord Alistair Sterling")
                    .customerEmail("sterling@estates.co.uk")
                    .shippingAddress("Highland Manor, Stirlingshire, Scotland")
                    .notes("Private courier required with signature upon delivery.")
                    .status("Delivered")
                    .total(46350.00)
                    .date(LocalDate.now().minusDays(3))
                    .items(new ArrayList<>())
                    .build();

            o1.getItems().add(OrderItem.builder().order(o1).productId(p1.getId()).productName(p1.getName()).quantity(1).unitPrice(p1.getPrice()).build());
            o1.getItems().add(OrderItem.builder().order(o1).productId(p2.getId()).productName(p2.getName()).quantity(1).unitPrice(p2.getPrice()).build());
            orderRepository.save(o1);

            // 8. Seed Purchase Orders
            PurchaseOrder po1 = PurchaseOrder.builder()
                    .supplier(sup1)
                    .supplierName(sup1.getName())
                    .date(LocalDate.now().minusDays(10))
                    .expectedDeliveryDate(LocalDate.now().plusDays(5))
                    .status("Approved")
                    .notes("Annual spring allotment of Geneva chronographs.")
                    .itemsCount(1)
                    .total(170000.00)
                    .items(new ArrayList<>())
                    .build();
            po1.getItems().add(PurchaseOrderItem.builder().purchaseOrder(po1).productId(p1.getId()).productName(p1.getName()).quantity(5).unitCost(34000.00).receivedQuantity(2).build());
            purchaseOrderRepository.save(po1);

            // 9. Seed Deliveries
            Delivery d1 = Delivery.builder()
                    .type("OUTBOUND")
                    .orderId(o1.getId())
                    .trackingNumber("GB-MAYFAIR-89201")
                    .carrier("Brinks Diamond Express")
                    .status("Delivered")
                    .origin("Mayfair Vault & Depository")
                    .destination("Highland Manor, Stirlingshire")
                    .estimatedDelivery(LocalDate.now().minusDays(1))
                    .actualDelivery(LocalDate.now().minusDays(1))
                    .notes("Armored transport completed.")
                    .items(new ArrayList<>())
                    .build();
            d1.getItems().add(DeliveryItem.builder().delivery(d1).productId(p1.getId()).productName(p1.getName()).quantity(1).build());
            deliveryRepository.save(d1);

            System.out.println(">>> Seeded complete enterprise database with Admin, Manager, Staff, and Supplier roles!");
        }
    }
}
