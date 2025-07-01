/*
  # Seed Dummy Data for ExpenseFlow Application

  1. New Users
    - John Smith (john@company.com) - Employee, Sales
    - Sarah Johnson (sarah@company.com) - Manager, Sales  
    - Mike Davis (mike@company.com) - Employee, Marketing
    - Admin User (admin@company.com) - Admin, IT

  2. Sample Expenses
    - 12 realistic expenses with various statuses
    - Different categories and amounts
    - Proper approval workflows

  3. Attachments and Extracted Data
    - File attachments with ABBYY processing status
    - Extracted data from document processing
    - Realistic confidence scores and timestamps

  4. Security
    - All data respects existing RLS policies
    - Uses proper foreign key relationships
*/

-- Insert user profiles (skip if already exists)
INSERT INTO users (id, name, email, role, department) VALUES
('11111111-1111-1111-1111-111111111111', 'John Smith', 'john@company.com', 'employee', 'Sales'),
('22222222-2222-2222-2222-222222222222', 'Sarah Johnson', 'sarah@company.com', 'manager', 'Sales'),
('33333333-3333-3333-3333-333333333333', 'Mike Davis', 'mike@company.com', 'employee', 'Marketing'),
('44444444-4444-4444-4444-444444444444', 'Admin User', 'admin@company.com', 'admin', 'IT')
ON CONFLICT (email) DO NOTHING;

-- Insert sample expenses (skip if already exists)
INSERT INTO expenses (
  id,
  title,
  amount,
  currency,
  category,
  date,
  description,
  status,
  submitted_by,
  submitted_at,
  approved_by,
  approved_at,
  processing_status
) VALUES
(
  'exp_001',
  'Client Dinner Meeting',
  127.50,
  'USD',
  'Meals & Entertainment',
  '2024-01-15',
  'Dinner with potential client to discuss new project opportunities',
  'approved',
  '11111111-1111-1111-1111-111111111111',
  '2024-01-16 09:00:00+00',
  '22222222-2222-2222-2222-222222222222',
  '2024-01-17 14:30:00+00',
  'completed'
),
(
  'exp_002',
  'Office Supplies Purchase',
  89.99,
  'USD',
  'Office Supplies',
  '2024-01-18',
  'Notebooks, pens, and other office materials for the team',
  'submitted',
  '33333333-3333-3333-3333-333333333333',
  '2024-01-18 11:15:00+00',
  NULL,
  NULL,
  'extracting'
),
(
  'exp_003',
  'Business Conference Hotel',
  342.00,
  'USD',
  'Travel & Lodging',
  '2024-01-20',
  '2-night stay for annual business conference in Chicago',
  'processing',
  '11111111-1111-1111-1111-111111111111',
  '2024-01-21 08:30:00+00',
  NULL,
  NULL,
  'pending'
),
(
  'exp_004',
  'Design Software License',
  199.00,
  'USD',
  'Software & Technology',
  '2024-01-22',
  'Annual license for Adobe Creative Suite',
  'rejected',
  '33333333-3333-3333-3333-333333333333',
  '2024-01-22 16:45:00+00',
  '22222222-2222-2222-2222-222222222222',
  NULL,
  'completed'
),
(
  'exp_005',
  'Team Lunch',
  156.75,
  'USD',
  'Meals & Entertainment',
  '2024-01-25',
  'Team building lunch with new hires',
  'approved',
  '22222222-2222-2222-2222-222222222222',
  '2024-01-25 15:20:00+00',
  '44444444-4444-4444-4444-444444444444',
  '2024-01-26 09:15:00+00',
  'completed'
),
(
  'exp_006',
  'Taxi to Airport',
  45.50,
  'USD',
  'Transportation',
  '2024-01-28',
  'Transportation to airport for business trip',
  'submitted',
  '11111111-1111-1111-1111-111111111111',
  '2024-01-28 20:30:00+00',
  NULL,
  NULL,
  'pending'
),
(
  'exp_007',
  'Marketing Conference Registration',
  450.00,
  'USD',
  'Training & Education',
  '2024-01-30',
  'Registration fee for Digital Marketing Summit 2024',
  'approved',
  '33333333-3333-3333-3333-333333333333',
  '2024-01-30 10:00:00+00',
  '22222222-2222-2222-2222-222222222222',
  '2024-01-31 11:45:00+00',
  'completed'
),
(
  'exp_008',
  'Office Internet Upgrade',
  89.99,
  'USD',
  'Utilities',
  '2024-02-01',
  'Monthly upgrade to high-speed internet for office',
  'paid',
  '44444444-4444-4444-4444-444444444444',
  '2024-02-01 14:20:00+00',
  '44444444-4444-4444-4444-444444444444',
  '2024-02-01 14:25:00+00',
  'completed'
),
(
  'exp_009',
  'Monthly Parking Pass',
  75.00,
  'USD',
  'Transportation',
  '2024-02-01',
  'Monthly parking pass for downtown office',
  'approved',
  '11111111-1111-1111-1111-111111111111',
  '2024-02-01 09:00:00+00',
  '22222222-2222-2222-2222-222222222222',
  '2024-02-01 10:30:00+00',
  'completed'
),
(
  'exp_010',
  'Client Gift Cards',
  200.00,
  'USD',
  'Marketing & Advertising',
  '2024-02-03',
  'Gift cards for client appreciation event',
  'submitted',
  '33333333-3333-3333-3333-333333333333',
  '2024-02-03 14:15:00+00',
  NULL,
  NULL,
  'pending'
),
(
  'exp_011',
  'Professional Development Course',
  299.99,
  'USD',
  'Training & Education',
  '2024-02-05',
  'Online course for project management certification',
  'draft',
  '11111111-1111-1111-1111-111111111111',
  NULL,
  NULL,
  NULL,
  'pending'
),
(
  'exp_012',
  'Office Cleaning Service',
  150.00,
  'USD',
  'Professional Services',
  '2024-02-07',
  'Monthly office cleaning service',
  'approved',
  '44444444-4444-4444-4444-444444444444',
  '2024-02-07 16:00:00+00',
  '44444444-4444-4444-4444-444444444444',
  '2024-02-07 16:05:00+00',
  'completed'
)
ON CONFLICT (id) DO NOTHING;

-- Update rejected expense with rejection details (only if not already set)
UPDATE expenses 
SET 
  rejected_by = '22222222-2222-2222-2222-222222222222',
  rejected_at = '2024-01-23 10:20:00+00',
  rejection_reason = 'Please provide business justification for this software purchase. Consider using existing tools first.'
WHERE id = 'exp_004' AND rejected_by IS NULL;

-- Insert sample attachments (skip if already exists)
INSERT INTO attachments (
  id,
  expense_id,
  name,
  size,
  type,
  url,
  uploaded_at,
  abbyy_sent_at,
  abbyy_processed_at
) VALUES
(
  'att_001',
  'exp_001',
  'restaurant_receipt.pdf',
  245760,
  'application/pdf',
  'https://example.com/files/restaurant_receipt.pdf',
  '2024-01-16 09:00:00+00',
  '2024-01-16 09:01:00+00',
  '2024-01-16 09:03:00+00'
),
(
  'att_002',
  'exp_002',
  'office_depot_receipt.jpg',
  186420,
  'image/jpeg',
  'https://example.com/files/office_depot_receipt.jpg',
  '2024-01-18 11:15:00+00',
  '2024-01-18 11:16:00+00',
  NULL
),
(
  'att_003',
  'exp_003',
  'hotel_invoice.pdf',
  512000,
  'application/pdf',
  'https://example.com/files/hotel_invoice.pdf',
  '2024-01-21 08:30:00+00',
  NULL,
  NULL
),
(
  'att_004',
  'exp_004',
  'adobe_license_receipt.pdf',
  98304,
  'application/pdf',
  'https://example.com/files/adobe_license_receipt.pdf',
  '2024-01-22 16:45:00+00',
  '2024-01-22 16:46:00+00',
  '2024-01-22 16:48:00+00'
),
(
  'att_005',
  'exp_005',
  'restaurant_bill.jpg',
  234567,
  'image/jpeg',
  'https://example.com/files/restaurant_bill.jpg',
  '2024-01-25 15:20:00+00',
  '2024-01-25 15:21:00+00',
  '2024-01-25 15:23:00+00'
),
(
  'att_006',
  'exp_006',
  'taxi_receipt.jpg',
  123456,
  'image/jpeg',
  'https://example.com/files/taxi_receipt.jpg',
  '2024-01-28 20:30:00+00',
  NULL,
  NULL
),
(
  'att_007',
  'exp_007',
  'conference_registration.pdf',
  345678,
  'application/pdf',
  'https://example.com/files/conference_registration.pdf',
  '2024-01-30 10:00:00+00',
  '2024-01-30 10:01:00+00',
  '2024-01-30 10:03:00+00'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample extracted data from ABBYY processing (skip if already exists)
INSERT INTO extracted_data (
  id,
  expense_id,
  vendor,
  amount,
  currency,
  date,
  invoice_number,
  category,
  confidence,
  extracted_at
) VALUES
(
  'ext_001',
  'exp_001',
  'The Steakhouse Restaurant',
  127.50,
  'USD',
  '2024-01-15',
  'REST-2024-001234',
  'Restaurant',
  0.95,
  '2024-01-16 09:03:00+00'
),
(
  'ext_004',
  'exp_004',
  'Adobe Systems Inc.',
  199.00,
  'USD',
  '2024-01-22',
  'ADO-2024-001234',
  'Software',
  0.98,
  '2024-01-22 16:48:00+00'
),
(
  'ext_005',
  'exp_005',
  'Bistro Downtown',
  156.75,
  'USD',
  '2024-01-25',
  'BIS-2024-005678',
  'Restaurant',
  0.92,
  '2024-01-25 15:23:00+00'
),
(
  'ext_007',
  'exp_007',
  'Digital Marketing Summit',
  450.00,
  'USD',
  '2024-01-30',
  'DMS-2024-REG-789',
  'Conference',
  0.97,
  '2024-01-30 10:03:00+00'
)
ON CONFLICT (id) DO NOTHING;