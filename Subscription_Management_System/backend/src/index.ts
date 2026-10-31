import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import invoiceRoutes from "./routes/invoice.routes";
import paymentRoutes from "./routes/payment.routes";
import { requireAuth, requireRole } from "./middleware/auth";
import {
  customersRouter, productsRouter, plansRouter, discountsRouter,
} from "./routes/stub.routes";

dotenv.config();

if (!process.env.JWT_SECRET || !process.env.ADMIN_SETUP_KEY) {
  console.error("FATAL: JWT_SECRET and ADMIN_SETUP_KEY must be set in .env — no insecure fallback in production.");
  if (process.env.NODE_ENV === "production") process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth/create-staff", requireAuth, requireRole("admin")); // guard applied before route below
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/plans", plansRouter);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/discounts", discountsRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
