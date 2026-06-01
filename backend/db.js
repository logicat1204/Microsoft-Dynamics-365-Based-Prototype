const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'dynamics365.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create all tables
db.exec(`
  -- FINANCE MODULE
  CREATE TABLE IF NOT EXISTS finance_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL, name TEXT NOT NULL, type TEXT DEFAULT 'Asset',
    balance REAL DEFAULT 0, currency TEXT DEFAULT 'USD', active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_receivables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL, invoice_number TEXT, amount REAL NOT NULL,
    due_date TEXT, status TEXT DEFAULT 'Pending', currency TEXT DEFAULT 'USD',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_payables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor TEXT NOT NULL, invoice_number TEXT, amount REAL NOT NULL,
    due_date TEXT, status TEXT DEFAULT 'Pending', currency TEXT DEFAULT 'USD',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL, category TEXT, allocated REAL DEFAULT 0,
    spent REAL DEFAULT 0, period TEXT, status TEXT DEFAULT 'Active',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_cashflow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL, type TEXT DEFAULT 'Inflow', amount REAL NOT NULL,
    date TEXT, category TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_fixed_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, category TEXT, acquisition_cost REAL, acquisition_date TEXT,
    depreciation_rate REAL DEFAULT 10, current_value REAL, location TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_bank_reconciliation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_account TEXT NOT NULL, statement_date TEXT, statement_balance REAL,
    book_balance REAL, difference REAL DEFAULT 0, status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS finance_currencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL, name TEXT NOT NULL, exchange_rate REAL DEFAULT 1,
    active INTEGER DEFAULT 1, updated_at TEXT DEFAULT (datetime('now'))
  );

  -- SUPPLY CHAIN MODULE
  CREATE TABLE IF NOT EXISTS sc_warehouses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL, name TEXT NOT NULL, location TEXT,
    capacity INTEGER DEFAULT 0, used INTEGER DEFAULT 0, manager TEXT,
    active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sc_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL, name TEXT NOT NULL, warehouse_id INTEGER,
    quantity INTEGER DEFAULT 0, unit TEXT DEFAULT 'units', min_stock INTEGER DEFAULT 0,
    unit_cost REAL DEFAULT 0, lot_number TEXT, serial_number TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sc_purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_number TEXT, vendor TEXT NOT NULL, order_date TEXT,
    expected_date TEXT, total REAL DEFAULT 0, status TEXT DEFAULT 'Draft',
    items TEXT DEFAULT '[]', created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sc_quality_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT NOT NULL, product TEXT, inspector TEXT,
    check_date TEXT, result TEXT DEFAULT 'Pending', notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sc_maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_name TEXT NOT NULL, type TEXT DEFAULT 'Preventive',
    scheduled_date TEXT, completed_date TEXT, technician TEXT,
    status TEXT DEFAULT 'Scheduled', cost REAL DEFAULT 0, notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- COMMERCE MODULE
  CREATE TABLE IF NOT EXISTS commerce_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT, name TEXT NOT NULL, category TEXT, price REAL DEFAULT 0,
    cost REAL DEFAULT 0, stock INTEGER DEFAULT 0, description TEXT,
    active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS commerce_pos_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_number TEXT, store TEXT, cashier TEXT,
    items TEXT DEFAULT '[]', subtotal REAL DEFAULT 0, tax REAL DEFAULT 0,
    total REAL DEFAULT 0, payment_method TEXT DEFAULT 'Cash',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS commerce_promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, type TEXT DEFAULT 'Percentage', value REAL DEFAULT 0,
    start_date TEXT, end_date TEXT, category TEXT,
    active INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS commerce_loyalty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL, email TEXT, points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Bronze', join_date TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- PROJECT OPERATIONS MODULE
  CREATE TABLE IF NOT EXISTS project_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, client TEXT, manager TEXT,
    start_date TEXT, end_date TEXT, budget REAL DEFAULT 0,
    spent REAL DEFAULT 0, status TEXT DEFAULT 'Planning', progress INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS project_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, role TEXT, skill TEXT, project_id INTEGER,
    allocation_pct INTEGER DEFAULT 100, hourly_rate REAL DEFAULT 0,
    available INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS project_timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee TEXT NOT NULL, project_id INTEGER, task TEXT,
    date TEXT, hours REAL DEFAULT 0, billable INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Draft', created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS project_invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT, project_id INTEGER, client TEXT,
    amount REAL DEFAULT 0, due_date TEXT, status TEXT DEFAULT 'Draft',
    milestone TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS project_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_number TEXT, client TEXT NOT NULL, type TEXT DEFAULT 'Fixed Price',
    value REAL DEFAULT 0, start_date TEXT, end_date TEXT,
    status TEXT DEFAULT 'Active', created_at TEXT DEFAULT (datetime('now'))
  );

  -- HUMAN RESOURCES MODULE
  CREATE TABLE IF NOT EXISTS hr_employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT, first_name TEXT NOT NULL, last_name TEXT NOT NULL,
    email TEXT, department TEXT, position TEXT, hire_date TEXT,
    salary REAL DEFAULT 0, status TEXT DEFAULT 'Active', manager TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hr_timeoff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER, employee_name TEXT, type TEXT DEFAULT 'Vacation',
    start_date TEXT, end_date TEXT, days INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Pending', reason TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hr_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER, employee_name TEXT, date TEXT,
    check_in TEXT, check_out TEXT, hours_worked REAL DEFAULT 0,
    status TEXT DEFAULT 'Present', created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hr_recruitment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, department TEXT, location TEXT,
    type TEXT DEFAULT 'Full-time', applicants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Open', posted_date TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS hr_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER, employee_name TEXT, evaluator TEXT,
    period TEXT, score REAL DEFAULT 0, rating TEXT DEFAULT 'Meets Expectations',
    comments TEXT, status TEXT DEFAULT 'Draft',
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- BUSINESS CENTRAL MODULE
  CREATE TABLE IF NOT EXISTS bc_chart_of_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_no TEXT NOT NULL, name TEXT NOT NULL, type TEXT DEFAULT 'Posting',
    category TEXT, balance REAL DEFAULT 0, dimension1 TEXT, dimension2 TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bc_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, company TEXT, email TEXT, phone TEXT,
    type TEXT DEFAULT 'Customer', segment TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bc_opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, contact_id INTEGER, value REAL DEFAULT 0,
    stage TEXT DEFAULT 'Prospecting', probability INTEGER DEFAULT 10,
    expected_close TEXT, assigned_to TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bc_production_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT, product TEXT NOT NULL, quantity INTEGER DEFAULT 1,
    bom TEXT, route TEXT, work_center TEXT,
    start_date TEXT, due_date TEXT, status TEXT DEFAULT 'Planned',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS bc_service_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT, customer TEXT NOT NULL, description TEXT,
    assigned_to TEXT, priority TEXT DEFAULT 'Normal',
    scheduled_date TEXT, status TEXT DEFAULT 'Open',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed data
const count = db.prepare('SELECT COUNT(*) as c FROM finance_accounts').get();
if (count.c === 0) {
  const seedStatements = [
    // Finance
    `INSERT INTO finance_accounts (code, name, type, balance, currency) VALUES
      ('1000','Cash and Equivalents','Asset',125000,'USD'),
      ('1100','Accounts Receivable','Asset',85000,'USD'),
      ('1200','Inventory','Asset',200000,'USD'),
      ('2000','Accounts Payable','Liability',65000,'USD'),
      ('3000','Equity','Equity',500000,'USD'),
      ('4000','Revenue','Revenue',350000,'USD'),
      ('5000','Cost of Goods Sold','Expense',180000,'USD')`,
    `INSERT INTO finance_receivables (customer, invoice_number, amount, due_date, status) VALUES
      ('Acme Corp','INV-001',15000,'2026-06-15','Pending'),
      ('Global Ltd','INV-002',8500,'2026-06-20','Pending'),
      ('Tech Solutions','INV-003',22000,'2026-05-30','Overdue')`,
    `INSERT INTO finance_payables (vendor, invoice_number, amount, due_date, status) VALUES
      ('SupplyChain Co','BILL-001',12000,'2026-06-10','Pending'),
      ('Raw Materials Inc','BILL-002',8000,'2026-06-25','Pending')`,
    `INSERT INTO finance_budgets (department, category, allocated, spent, period, status) VALUES
      ('Marketing','Operations',50000,32000,'2026-Q2','Active'),
      ('IT','Infrastructure',80000,45000,'2026-Q2','Active'),
      ('HR','Training',25000,10000,'2026-Q2','Active')`,
    `INSERT INTO finance_cashflow (description, type, amount, date, category) VALUES
      ('Product Sales','Inflow',45000,'2026-05-15','Sales'),
      ('Supplier Payment','Outflow',12000,'2026-05-18','Procurement'),
      ('Service Revenue','Inflow',8500,'2026-05-20','Services')`,
    `INSERT INTO finance_fixed_assets (name, category, acquisition_cost, acquisition_date, depreciation_rate, current_value, location) VALUES
      ('CNC Machine','Machinery',120000,'2024-01-15',10,96000,'Plant A'),
      ('Office Building','Real Estate',500000,'2020-06-01',5,375000,'HQ'),
      ('Fleet Vehicles','Vehicles',85000,'2023-03-10',20,54400,'Logistics')`,
    `INSERT INTO finance_currencies (code, name, exchange_rate, active) VALUES
      ('USD','US Dollar',1,1),('EUR','Euro',0.92,1),('BOB','Boliviano',6.91,1),('GBP','British Pound',0.79,1)`,
    `INSERT INTO finance_bank_reconciliation (bank_account, statement_date, statement_balance, book_balance, difference, status) VALUES
      ('BNB - Cta. Corriente USD', '2026-05-31', 45000.00, 45000.00, 0.00, 'Reconciled'),
      ('Banco Mercantil BOB', '2026-05-31', 12500.00, 12650.00, -150.00, 'Pending')`,

    // Supply Chain
    `INSERT INTO sc_warehouses (code, name, location, capacity, used, manager) VALUES
      ('WH-001','Main Warehouse','Industrial Zone A',10000,6500,'Carlos Mendez'),
      ('WH-002','Distribution Center','Port Area B',5000,3200,'Ana García')`,
    `INSERT INTO sc_inventory (sku, name, warehouse_id, quantity, unit, min_stock, unit_cost, lot_number) VALUES
      ('RAW-001','Steel Sheets',1,500,'kg',100,12.50,'LOT-2026-001'),
      ('RAW-002','Aluminum Bars',1,300,'units',50,8.75,'LOT-2026-002'),
      ('FIN-001','Widget A',2,1200,'units',200,25.00,'LOT-2026-003')`,
    `INSERT INTO sc_purchase_orders (po_number, vendor, order_date, expected_date, total, status) VALUES
      ('PO-2026-001','Steel Suppliers Inc','2026-05-01','2026-06-01',15000,'Approved'),
      ('PO-2026-002','Packaging Co','2026-05-10','2026-05-28',4500,'Received')`,
    `INSERT INTO sc_quality_checks (reference, product, inspector, check_date, result, notes) VALUES
      ('PO-2026-002', 'Packaging Cartons', 'Ing. Laura Gómez', '2026-05-28', 'Approved', 'Espesor de cartón cumple con normas ISO 9001'),
      ('PO-2026-001', 'Steel Sheets', 'Ing. Carlos Ortiz', '2026-06-01', 'Pending', 'Inspección de rugosidad en progreso')`,
    `INSERT INTO sc_maintenance (asset_name, type, scheduled_date, completed_date, technician, status, cost, notes) VALUES
      ('CNC Machine H3', 'Preventive', '2026-05-20', '2026-05-20', 'Juan Perez', 'Completed', 450.00, 'Cambio de filtros de aceite y lubricación general'),
      ('Fleet Truck #2', 'Corrective', '2026-06-05', NULL, 'Roberto Gomez', 'Scheduled', 0.00, 'Revisión de frenos delanteros y discos')`,

    // Commerce
    `INSERT INTO commerce_products (sku, name, category, price, cost, stock, description) VALUES
      ('PROD-001','Wireless Headphones','Electronics',89.99,45.00,150,'Premium BT headphones'),
      ('PROD-002','Ergonomic Keyboard','Electronics',129.99,65.00,80,'Mechanical keyboard'),
      ('PROD-003','Running Shoes','Footwear',119.99,55.00,200,'Performance running shoes'),
      ('PROD-004','Backpack Pro','Accessories',79.99,35.00,120,'Water-resistant backpack')`,
    `INSERT INTO commerce_promotions (name, type, value, start_date, end_date, category) VALUES
      ('Summer Sale','Percentage',15,'2026-06-01','2026-06-30','Electronics'),
      ('Back to School','Fixed',10,'2026-08-01','2026-08-31','Accessories')`,
    `INSERT INTO commerce_loyalty (customer_name, email, points, tier) VALUES
      ('María López','maria@email.com',2500,'Silver'),
      ('Juan Pérez','juan@email.com',800,'Bronze')`,
    `INSERT INTO commerce_pos_transactions (transaction_number, store, cashier, items, subtotal, tax, total, payment_method) VALUES
      ('TX-87625143', 'Tienda Central LP', 'Cajero Principal', '[{"sku":"PROD-001","name":"Wireless Headphones","price":89.99,"quantity":1,"total":89.99}]', 89.99, 11.70, 101.69, 'Card')`,

    // Projects
    `INSERT INTO project_projects (name, client, manager, start_date, end_date, budget, spent, status, progress) VALUES
      ('ERP Implementation','Acme Corp','Laura Smith','2026-01-15','2026-07-15',150000,85000,'In Progress',60),
      ('Website Redesign','Global Ltd','Mark Johnson','2026-03-01','2026-05-30',45000,42000,'In Progress',90),
      ('Mobile App Dev','Tech Solutions','Sara Chen','2026-04-01','2026-09-30',200000,50000,'In Progress',25)`,
    `INSERT INTO project_resources (name, role, skill, project_id, allocation_pct, hourly_rate) VALUES
      ('John Developer','Developer','Full Stack',1,100,75),
      ('Alice Designer','Designer','UI/UX',2,50,65),
      ('Bob Analyst','Analyst','Business Analysis',1,80,60)`,
    `INSERT INTO project_contracts (contract_number, client, type, value, start_date, end_date, status) VALUES
      ('CTR-001','Acme Corp','Fixed Price',150000,'2026-01-15','2026-07-15','Active'),
      ('CTR-002','Global Ltd','Time & Materials',45000,'2026-03-01','2026-05-30','Active')`,
    `INSERT INTO project_timesheets (employee, project_id, task, date, hours, billable, status) VALUES
      ('John Developer', 1, 'Programación de Controladores Express', '2026-05-28', 8.0, 1, 'Approved'),
      ('Alice Designer', 2, 'Diseño de Prototipos de Interfaz Figma', '2026-05-29', 6.5, 1, 'Submitted')`,

    // HR
    `INSERT INTO hr_employees (employee_id, first_name, last_name, email, department, position, hire_date, salary, status) VALUES
      ('EMP-001','Carlos','Mendez','carlos@dynamics365.com','Engineering','Senior Developer','2023-03-15',85000,'Active'),
      ('EMP-002','Ana','García','ana@dynamics365.com','Marketing','Marketing Manager','2022-08-01',72000,'Active'),
      ('EMP-003','Luis','Torres','luis@dynamics365.com','Finance','Financial Analyst','2024-01-10',65000,'Active'),
      ('EMP-004','María','Rojas','maria@dynamics365.com','HR','HR Specialist','2023-06-20',60000,'Active')`,
    `INSERT INTO hr_recruitment (title, department, location, type, applicants, status, posted_date) VALUES
      ('Frontend Developer','Engineering','Remote','Full-time',12,'Open','2026-05-01'),
      ('Data Analyst','Finance','HQ','Full-time',8,'Open','2026-05-15')`,
    `INSERT INTO hr_timeoff (employee_name, type, start_date, end_date, days, status, reason) VALUES
      ('Carlos Mendez', 'Vacation', '2026-07-01', '2026-07-10', 10, 'Approved', 'Vacaciones familiares programadas'),
      ('Ana García', 'Sick Leave', '2026-06-03', '2026-06-04', 2, 'Pending', 'Reposo médico por cuadro gripal')`,
    `INSERT INTO hr_attendance (employee_name, date, check_in, check_out, hours_worked, status) VALUES
      ('Carlos Mendez', '2026-05-29', '08:30', '17:30', 9.0, 'Present'),
      ('Ana García', '2026-05-29', '09:15', '17:30', 8.25, 'Late')`,
    `INSERT INTO hr_evaluations (employee_name, evaluator, period, score, rating, comments, status) VALUES
      ('Carlos Mendez', 'Laura Smith', '2026-Q1', 4.8, 'Outstanding', 'Excelente desempeño técnico y liderazgo del equipo.', 'Completed'),
      ('Ana García', 'Laura Smith', '2026-Q1', 4.0, 'Meets Expectations', 'Cumple con los objetivos de marketing fijados para el trimestre.', 'Completed')`,

    // Business Central
    `INSERT INTO bc_chart_of_accounts (account_no, name, type, category, balance) VALUES
      ('10100','Cash','Posting','Current Assets',95000),
      ('12000','Accounts Receivable','Posting','Current Assets',45000),
      ('20100','Accounts Payable','Posting','Current Liabilities',32000),
      ('40100','Sales Revenue','Posting','Income',280000)`,
    `INSERT INTO bc_contacts (name, company, email, phone, type, segment) VALUES
      ('Roberto Silva','Silva Industries','roberto@silva.com','+591-4-123456','Customer','Enterprise'),
      ('Carmen Flores','Flores Trading','carmen@flores.com','+591-4-654321','Vendor','SMB')`,
    `INSERT INTO bc_opportunities (name, contact_id, value, stage, probability, expected_close, assigned_to) VALUES
      ('ERP License Deal', 1, 75000, 'Negotiation', 60, '2026-07-15', 'Sales Team A'),
      ('Consulting Package', 2, 25000, 'Qualification', 30, '2026-08-01', 'Sales Team B')`,
    `INSERT INTO bc_production_orders (order_no, product, quantity, work_center, start_date, due_date, status) VALUES
      ('MO-001','Widget A',500,'Assembly Line 1','2026-05-20','2026-06-05','In Progress'),
      ('MO-002','Widget B',200,'Assembly Line 2','2026-06-01','2026-06-15','Planned')`,
    `INSERT INTO bc_service_orders (order_no, customer, description, assigned_to, priority, scheduled_date, status) VALUES
      ('SO-001','Acme Corp','Annual maintenance review','Tech Team A','High','2026-06-10','Open'),
      ('SO-002','Global Ltd','System upgrade','Tech Team B','Normal','2026-06-20','Open')`
  ];
  const insertMany = db.transaction(() => {
    for (const sql of seedStatements) { db.exec(sql); }
  });
  insertMany();
  console.log('Database seeded with demo data.');
}

module.exports = db;
