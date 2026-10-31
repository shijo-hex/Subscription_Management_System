import { Router } from "express";
import { pool } from "../db";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

function addInterval(date: Date, cycle: string): Date {
  const d = new Date(date);
  if (cycle === "daily") d.setDate(d.getDate() + 1);
  else if (cycle === "weekly") d.setDate(d.getDate() + 7);
  else if (cycle === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1); // monthly default
  return d;
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    let query = "SELECT * FROM subscriptions";
    const params: any[] = [];
    if (req.user!.role === "customer") {
      query += ` WHERE customer_id = (SELECT id FROM customers WHERE user_id = $1)`;
      params.push(req.user!.id);
    }
    query += " ORDER BY id DESC LIMIT 100";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load subscriptions" });
  }
});

router.post("/", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const { customer_id, plan_id, quantity } = req.body;
  if (!customer_id || !plan_id) return res.status(400).json({ error: "customer_id and plan_id required" });
  try {
    const plan = await pool.query("SELECT * FROM plans WHERE id = $1", [plan_id]);
    if (!plan.rows.length) return res.status(404).json({ error: "Plan not found" });
    const renewal = addInterval(new Date(), plan.rows[0].billing_cycle);
    const result = await pool.query(
      `INSERT INTO subscriptions (customer_id, plan_id, status, start_date, renewal_date, quantity)
       VALUES ($1,$2,'draft',CURRENT_DATE,$3,$4) RETURNING *`,
      [customer_id, plan_id, renewal, quantity || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create subscription" });
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const { status } = req.body;
  const allowed = ["draft", "confirmed", "active", "paused", "cancelled", "expired"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
  try {
    const col = status === "paused" ? ", paused_at = NOW()" :
                status === "cancelled" ? ", closed_at = NOW()" : "";
    const result = await pool.query(
      `UPDATE subscriptions SET status = $1 ${col} WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Subscription not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update subscription" });
  }
});

router.post("/:id/renew", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  try {
    const sub = await pool.query(
      `SELECT s.*, p.billing_cycle FROM subscriptions s JOIN plans p ON p.id = s.plan_id WHERE s.id = $1`,
      [req.params.id]
    );
    if (!sub.rows.length) return res.status(404).json({ error: "Subscription not found" });
    const current = sub.rows[0];
    const newRenewal = addInterval(new Date(current.renewal_date), current.billing_cycle);
    const result = await pool.query(
      "UPDATE subscriptions SET renewal_date = $1, status = 'active' WHERE id = $2 RETURNING *",
      [newRenewal, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not renew subscription" });
  }
});

export default router;
