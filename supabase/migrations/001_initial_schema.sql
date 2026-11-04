-- =====================================================================
-- SETHI BOOT HOUSE (RATIA, HARYANA) — POSTGRESQL / SUPABASE INITIAL SCHEMA
-- Footwear Retail ERP + POS + Inventory + GST + E-Commerce Schema
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations and Branches
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'SETHI BOOT HOUSE',
    tagline TEXT,
    gstin VARCHAR(15) NOT NULL,
    pan VARCHAR(10),
    phone VARCHAR(20) NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Ratia',
    state VARCHAR(100) NOT NULL DEFAULT 'Haryana',
    pincode VARCHAR(10) NOT NULL DEFAULT '125051',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL DEFAULT 'Main Road Branch',
    branch_code VARCHAR(20) DEFAULT 'RATIA-01',
    is_main BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users and Roles
CREATE TYPE user_role_enum AS ENUM ('owner', 'accountant', 'manager', 'cashier', 'salesperson');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone VARCHAR(20),
    role user_role_enum NOT NULL DEFAULT 'cashier',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customers and Suppliers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email TEXT,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Ratia',
    state VARCHAR(100) DEFAULT 'Haryana',
    pincode VARCHAR(10),
    birthday DATE,
    customer_type VARCHAR(50) DEFAULT 'Regular',
    preferred_brands TEXT[],
    preferred_sizes TEXT[],
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    total_spent NUMERIC(12, 2) DEFAULT 0.00,
    total_purchases_count INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    phone VARCHAR(20) NOT NULL,
    email TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    gstin VARCHAR(15),
    payment_terms TEXT,
    opening_balance NUMERIC(12, 2) DEFAULT 0.00,
    outstanding_balance NUMERIC(12, 2) DEFAULT 0.00,
    total_purchases NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products and Footwear Variants
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'Men',
    manufacturer TEXT,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    hsn_code VARCHAR(10) NOT NULL DEFAULT '6404',
    gst_rate NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    purchase_cost NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 3,
    reserved_online_quantity INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_variants_barcode ON product_variants(barcode);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- 5. Immutable Inventory Movements Ledger
CREATE TYPE movement_type_enum AS ENUM (
    'opening_stock', 'sale', 'sale_return', 'purchase_receipt', 
    'purchase_return', 'damaged', 'adjustment', 'exchange_in', 'exchange_out'
);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    movement_type movement_type_enum NOT NULL,
    reference_id TEXT,
    reason TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sales, Invoices and Items
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_type VARCHAR(30) DEFAULT 'gst_tax_invoice',
    status VARCHAR(30) DEFAULT 'completed',
    date TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone VARCHAR(20),
    customer_address TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_total NUMERIC(12, 2) DEFAULT 0.00,
    taxable_total NUMERIC(12, 2) NOT NULL,
    cgst_total NUMERIC(12, 2) NOT NULL,
    sgst_total NUMERIC(12, 2) NOT NULL,
    igst_total NUMERIC(12, 2) DEFAULT 0.00,
    round_off NUMERIC(6, 2) DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL,
    channel VARCHAR(30) DEFAULT 'pos',
    cashier_name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    product_name TEXT NOT NULL,
    brand VARCHAR(100),
    size VARCHAR(20),
    color VARCHAR(50),
    hsn_code VARCHAR(10),
    quantity INT NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    taxable_value NUMERIC(10, 2) NOT NULL,
    gst_rate NUMERIC(4, 2) NOT NULL,
    cgst_amount NUMERIC(10, 2) NOT NULL,
    sgst_amount NUMERIC(10, 2) NOT NULL,
    igst_amount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL
);

-- 7. Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_number VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    paid_to TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    recorded_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Customer and Supplier Ledgers
CREATE TABLE IF NOT EXISTS customer_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id TEXT,
    debit NUMERIC(10, 2) DEFAULT 0.00,
    credit NUMERIC(10, 2) DEFAULT 0.00,
    balance NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50) NOT NULL,
    reference_id TEXT,
    debit NUMERIC(10, 2) DEFAULT 0.00,
    credit NUMERIC(10, 2) DEFAULT 0.00,
    balance NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Online Orders
CREATE TABLE IF NOT EXISTS online_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'pending',
    status VARCHAR(30) DEFAULT 'new',
    courier_name TEXT,
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Security Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated staff to read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated staff to read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Allow authenticated staff to read invoices" ON invoices FOR SELECT USING (true);
