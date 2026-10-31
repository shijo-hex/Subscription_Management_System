import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/summary", requireAuth, async (_req, res) => {
    try {
        const [customers, activeSubs, invoices, revenue, outstanding, overdue] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM customers"),
            pool.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active'"),
            pool.query("SELECT COUNT(*) FROM invoices"),
            pool.query("SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status = 'paid'"),
            pool.query("SELECT COALESCE(SUM(amount),0) FROM invoices WHERE status = 'pending'"),
            pool.query("SELECT COUNT(*) FROM invoices WHERE status = 'overdue'"),
        ]);

        res.json({
            totalCustomers: Number(customers.rows[0].count),
            activeSubscriptions: Number(activeSubs.rows[0].count),
            totalInvoices: Number(invoices.rows[0].count),
            revenueCollected: Number(revenue.rows[0].coalesce),
            outstandingPayments: Number(outstanding.rows[0].coalesce),
            overdueInvoices: Number(overdue.rows[0].count),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not load dashboard summary" });
    }
});

router.get("/monthly-revenue", requireAuth, async (_req, res) => {
    try {
        const result = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon') AS month, COALESCE(SUM(amount),0) AS total
      FROM invoices WHERE status = 'paid'
      GROUP BY month, DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
      LIMIT 12
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not load revenue chart" });
    }
});

router.get("/recent-invoices", requireAuth, async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, customer_id, amount, status, due_date FROM invoices ORDER BY created_at DESC LIMIT 5"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Could not load recent invoices" });
    }
});

export default router;