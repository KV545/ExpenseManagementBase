/*
  # Create Demo Users for ExpenseFlow

  1. Demo Users
    - Creates user profiles in the public.users table
    - Uses realistic UUIDs that can be referenced
    - Includes different roles and departments

  2. Sample Expenses
    - Various expense types and statuses
    - Different categories and amounts
    - Realistic approval workflows

  3. Attachments and Processing Data
    - Sample file attachments
    - ABBYY processing status examples
    - Extracted data samples

  Note: These users will need to be created through Supabase Auth separately,
  but this provides the profile data structure.
*/

-- Insert demo user profiles
INSERT INTO users (id, name, email, role, department) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john@company.com', 'employee', 'Sales'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah@company.com', 'manager', 'Sales'),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Davis', 'mike@company.com', 'employee', 'Marketing'),
('550e8400-e29b-41d4-a716-446655440004', 'Admin User', 'admin@company.com', 'admin', 'IT')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department;

-- Insert sample expenses
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
  '550e8400-e29b-41d4-a716-446655440101',
  'Client Dinner Meeting',
  127.50,
  'USD',
  'Meals & Entertainment',
  '2024-01-15',
  'Dinner with potential client to discuss new project opportunities',
  'approved',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-01-16 09:00:00+00',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-01-17 14:30:00+00',
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440102',
  'Office Supplies Purchase',
  89.99,
  'USD',
  'Office Supplies',
  '2024-01-18',
  'Notebooks, pens, and other office materials for the team',
  'submitted',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-01-18 11:15:00+00',
  NULL,
  NULL,
  'extracting'
),
(
  '550e8400-e29b-41d4-a716-446655440103',
  'Business Conference Hotel',
  342.00,
  'USD',
  'Travel & Lodging',
  '2024-01-20',
  '2-night stay for annual business conference in Chicago',
  'processing',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-01-21 08:30:00+00',
  NULL,
  NULL,
  'pending'
),
(
  '550e8400-e29b-41d4-a716-446655440104',
  'Design Software License',
  199.00,
  'USD',
  'Software & Technology',
  '2024-01-22',
  'Annual license for Adobe Creative Suite',
  'rejected',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-01-22 16:45:00+00',
  '550e8400-e29b-41d4-a716-446655440002',
  NULL,
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440105',
  'Team Lunch',
  156.75,
  'USD',
  'Meals & Entertainment',
  '2024-01-25',
  'Team building lunch with new hires',
  'approved',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-01-25 15:20:00+00',
  '550e8400-e29b-41d4-a716-446655440004',
  '2024-01-26 09:15:00+00',
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440106',
  'Taxi to Airport',
  45.50,
  'USD',
  'Transportation',
  '2024-01-28',
  'Transportation to airport for business trip',
  'submitted',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-01-28 20:30:00+00',
  NULL,
  NULL,
  'pending'
),
(
  '550e8400-e29b-41d4-a716-446655440107',
  'Marketing Conference Registration',
  450.00,
  'USD',
  'Training & Education',
  '2024-01-30',
  'Registration fee for Digital Marketing Summit 2024',
  'approved',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-01-30 10:00:00+00',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-01-31 11:45:00+00',
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440108',
  'Office Internet Upgrade',
  89.99,
  'USD',
  'Utilities',
  '2024-02-01',
  'Monthly upgrade to high-speed internet for office',
  'paid',
  '550e8400-e29b-41d4-a716-446655440004',
  '2024-02-01 14:20:00+00',
  '550e8400-e29b-41d4-a716-446655440004',
  '2024-02-01 14:25:00+00',
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440109',
  'Monthly Parking Pass',
  75.00,
  'USD',
  'Transportation',
  '2024-02-01',
  'Monthly parking pass for downtown office',
  'approved',
  '550e8400-e29b-41d4-a716-446655440001',
  '2024-02-01 09:00:00+00',
  '550e8400-e29b-41d4-a716-446655440002',
  '2024-02-01 10:30:00+00',
  'completed'
),
(
  '550e8400-e29b-41d4-a716-446655440110',
  'Client Gift Cards',
  200.00,
  'USD',
  'Marketing & Advertising',
  '2024-02-03',
  'Gift cards for client appreciation event',
  'submitted',
  '550e8400-e29b-41d4-a716-446655440003',
  '2024-02-03 14:15:00+00',
  NULL,
  NULL,
  'pending'
),
(
  '550e8400-e29b-41d4-a716-446655440111',
  'Professional Development Course',
  299.99,
  'USD',
  'Training & Education',
  '2024-02-05',
  'Online course for project management certification',
  'draft',
  '550e8400-e29b-41d4-a716-446655440001',
  NULL,
  NULL,
  NULL,
  'pending'
),
(
  '550e8400-e29b-41d4-a716-446655440112',
  'Office Cleaning Service',
  150.00,
  'USD',
  'Professional Services',
  '2024-02-07',
  'Monthly office cleaning service',
  'approved',
  '550e8400-e29b-41d4-a716-446655440004',
  '2024-02-07 16:00:00+00',
  '550e8400-e29b-41d4-a716-446655440004',
  '2024-02-07 16:05:00+00',
  'completed'
)
ON CONFLICT (id) DO NOTHING;

-- Update rejected expense with rejection details
UPDATE expenses 
SET 
  rejected_by = '550e8400-e29b-41d4-a716-446655440002',
  rejected_at = '2024-01-23 10:20:00+00',
  rejection_reason = 'Please provide business justification for this software purchase. Consider using existing tools first.'
WHERE id = '550e8400-e29b-41d4-a716-446655440104' AND rejected_by IS NULL;

-- Insert sample attachments
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
  '550e8400-e29b-41d4-a716-446655440201',
  '550e8400-e29b-41d4-a716-446655440101',
  'restaurant_receipt.pdf',
  245760,
  'application/pdf',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-16 09:00:00+00',
  '2024-01-16 09:01:00+00',
  '2024-01-16 09:03:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440202',
  '550e8400-e29b-41d4-a716-446655440102',
  'office_depot_receipt.jpg',
  186420,
  'image/jpeg',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-18 11:15:00+00',
  '2024-01-18 11:16:00+00',
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440203',
  '550e8400-e29b-41d4-a716-446655440103',
  'hotel_invoice.pdf',
  512000,
  'application/pdf',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-21 08:30:00+00',
  NULL,
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440204',
  '550e8400-e29b-41d4-a716-446655440104',
  'adobe_license_receipt.pdf',
  98304,
  'application/pdf',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-22 16:45:00+00',
  '2024-01-22 16:46:00+00',
  '2024-01-22 16:48:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440205',
  '550e8400-e29b-41d4-a716-446655440105',
  'restaurant_bill.jpg',
  234567,
  'image/jpeg',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-25 15:20:00+00',
  '2024-01-25 15:21:00+00',
  '2024-01-25 15:23:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440206',
  '550e8400-e29b-41d4-a716-446655440106',
  'taxi_receipt.jpg',
  123456,
  'image/jpeg',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-28 20:30:00+00',
  NULL,
  NULL
),
(
  '550e8400-e29b-41d4-a716-446655440207',
  '550e8400-e29b-41d4-a716-446655440107',
  'conference_registration.pdf',
  345678,
  'application/pdf',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
  '2024-01-30 10:00:00+00',
  '2024-01-30 10:01:00+00',
  '2024-01-30 10:03:00+00'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample extracted data from ABBYY processing
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
  '550e8400-e29b-41d4-a716-446655440301',
  '550e8400-e29b-41d4-a716-446655440101',
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
  '550e8400-e29b-41d4-a716-446655440304',
  '550e8400-e29b-41d4-a716-446655440104',
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
  '550e8400-e29b-41d4-a716-446655440305',
  '550e8400-e29b-41d4-a716-446655440105',
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
  '550e8400-e29b-41d4-a716-446655440307',
  '550e8400-e29b-41d4-a716-446655440107',
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