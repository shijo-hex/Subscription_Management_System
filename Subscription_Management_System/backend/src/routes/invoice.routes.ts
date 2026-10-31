import { Router } from "express";
import { pool } from "../db";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    let query = "SELECT * FROM invoices";
    const params: any[] = [];
    if (req.user!.role === "customer") {
      query += " WHERE customer_id = (SELECT id FROM customers WHERE user_id = $1)";
      params.push(req.user!.id);
    }
    query += " ORDER BY id DESC LIMIT 100";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load invoices" });
  }
});

// Admin-triggered generation for all active, unpaused, uninvoiced-this-period subscriptions
router.post("/generate-due", requireAuth, requireRole("admin", "staff"), async (_req, res) => {
  const client = await pool.connect();
  const created: any[] = [];
  const skipped: any[] = [];
  try {
    const subs = await client.query(
      `SELECT s.*, p.price, p.billing_cycle FROM subscriptions s
       JOIN plans p ON p.id = s.plan_id
       WHERE s.status = 'active'`
    );

    for (const sub of subs.rows) {
      const periodStart = new Date();
      periodStart.setDate(1);
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0);

      await client.query("BEGIN");
      try {
        const invoiceNumber = `INV-${sub.id}-${periodStart.getFullYear()}${periodStart.getMonth() + 1}`;
        const amount = Number(sub.price) * Number(sub.quantity || 1);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const result = await client.query(
          `INSERT INTO invoices (subscription_id, customer_id, amount, status, due_date, billing_period_start, billing_period_end, invoice_number)
           VALUES ($1,$2,$3,'draft',$4,$5,$6,$7)
           ON CONFLICT (subscription_id, billing_period_start, billing_period_end) DO NOTHING
           RETURNING *`,
          [sub.id, sub.customer_id, amount, dueDate, periodStart, periodEnd, invoiceNumber]
        );
        await client.query("COMMIT");
        if (result.rows.length) created.push(result.rows[0]);
        else skipped.push({ subscription_id: sub.id, reason: "already invoiced this period" });
      } catch (innerErr) {
        await client.query("ROLLBACK");
        console.error(innerErr);
        skipped.push({ subscription_id: sub.id, reason: "error" });
      }
    }
    res.json({ created: created.length, skipped: skipped.length, invoices: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate invoices" });
  } finally {
    client.release();
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const { status } = req.body;
  if (!["draft", "confirmed", "paid", "overdue", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  try {
    const result = await pool.query("UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Invoice not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Could not update invoice" });
  }
});

export default router;
