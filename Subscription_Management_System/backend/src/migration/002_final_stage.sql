ALTER TABLE plans ADD COLUMN IF NOT EXISTS min_quantity INTEGER DEFAULT 1;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS available_from DATE DEFAULT CURRENT_DATE;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS available_to DATE;

ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP;

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS billing_period_start DATE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS billing_period_end DATE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50) UNIQUE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) DEFAULT 0;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0;

-- Prevent duplicate invoice per subscription+period
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_sub_period
  ON invoices(subscription_id, billing_period_start, billing_period_end)
  WHERE subscription_id IS NOT NULL;

ALTER TABLE payments ADD COLUMN IF NOT EXISTS reference VARCHAR(100);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
