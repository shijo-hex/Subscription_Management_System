import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import {
    customersRouter, productsRouter, plansRouter,
    subscriptionsRouter, invoicesRouter, paymentsRouter, discountsRouter,
} from "./routes/stub.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customersRouter);
app.use("/api/products", productsRouter);
app.use("/api/plans", plansRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/discounts", discountsRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));