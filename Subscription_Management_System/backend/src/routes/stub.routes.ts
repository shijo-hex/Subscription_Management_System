import { Router } from "express";
import { pool } from "../db";
import { requireAuth } from "../middleware/auth";

function makeStubRouter(table: string) {
    const router = Router();
    router.get("/", requireAuth, async (_req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 50`);
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: `Could not load ${table}` });
        }
    });
    return router;
}

export const customersRouter = makeStubRouter("customers");
export const productsRouter = makeStubRouter("products");
export const plansRouter = makeStubRouter("plans");
export const subscriptionsRouter = makeStubRouter("subscriptions");
export const invoicesRouter = makeStubRouter("invoices");
export const paymentsRouter = makeStubRouter("payments");
export const discountsRouter = makeStubRouter("discounts");