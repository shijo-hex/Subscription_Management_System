import { Router } from "express";
import { pool } from "../db";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    let query = `SELECT p.* FROM payments p`;
    const params: any[] = [];
    if (req.user!.role === "customer") {
      query += ` JOIN invoices i ON i.id = p.invoice_id
                 WHERE i.customer_id = (SELECT id FROM customers WHERE user_id = $1)`;
      params.push(req.user!.id);
    }
    query += " ORDER BY p.id DESC LIMIT 100";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Could not load payments" });
  }
});

router.post("/", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const { invoice_id, amount, method, reference, notes } = req.body;
  if (!invoice_id || !amount) return res.status(400).json({ error: "invoice_id and amount required" });
  if (Number(amount) <= 0) return res.status(400).json({ error: "Amount must be positive" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const invoiceResult = await client.query("SELECT * FROM invoices WHERE id = $1 FOR UPDATE", [invoice_id]);
    if (!invoiceResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Invoice not found" });
    }
    const invoice = invoiceResult.rows[0];
    const outstanding = Number(invoice.amount) - Number(invoice.paid_amount || 0);

    if (Number(amount) > outstanding) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: `Payment exceeds outstanding balance (₹${outstanding.toFixed(2)})` });
    }

    const paymentResult = await client.query(
      `INSERT INTO payments (invoice_id, amount, method, reference, notes, status, paid_at)
       VALUES ($1,$2,$3,$4,$5,'completed',NOW()) RETURNING *`,
      [invoice_id, amount, method || "cash", reference || null, notes || null]
    );

    const newPaidAmount = Number(invoice.paid_amount || 0) + Number(amount);
    const newStatus = newPaidAmount >= Number(invoice.amount) ? "paid" : invoice.status;

    await client.query(
      "UPDATE invoices SET paid_amount = $1, status = $2 WHERE id = $3",
      [newPaidAmount, newStatus, invoice_id]
    );

    await client.query("COMMIT");
    res.status(201).json({ payment: paymentResult.rows[0], invoice_status: newStatus, remaining: Number(invoice.amount) - newPaidAmount });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Could not record payment" });
  } finally {
    client.release();
  }
});

export default router;
