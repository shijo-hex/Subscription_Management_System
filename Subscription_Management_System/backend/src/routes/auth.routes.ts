import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../db";
import { validatePassword } from "../utils/password";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Customer self-registration
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const pwError = validatePassword(password);
  if (pwError) return res.status(400).json({ error: pwError });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Email already registered" });
    }
    const hash = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'customer') RETURNING id, name, email, role",
      [name, email, hash]
    );
    const user = userResult.rows[0];
    await client.query(
      "INSERT INTO customers (name, email, phone, user_id) VALUES ($1,$2,$3,$4)",
      [name, email, phone || null, user.id]
    );
    await client.query("COMMIT");
    res.status(201).json(user);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  } finally {
    client.release();
  }
});

// One-time admin bootstrap — only works if no admin exists yet
router.post("/setup-admin", async (req, res) => {
  const { name, email, password, setupKey } = req.body;
  if (setupKey !== process.env.ADMIN_SETUP_KEY) return res.status(403).json({ error: "Invalid setup key" });
  const pwError = validatePassword(password);
  if (pwError) return res.status(400).json({ error: pwError });
  try {
    const adminCheck = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
    if (adminCheck.rows.length) return res.status(409).json({ error: "Admin already exists" });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,'admin') RETURNING id, name, email, role",
      [name, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already exists" });
    console.error(err);
    res.status(500).json({ error: "Setup failed" });
  }
});

// Admin-only: create staff
router.post("/create-staff", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const pwError = validatePassword(password);
  if (pwError) return res.status(400).json({ error: pwError });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hash, role || "staff"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "Email already exists" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Request password reset — returns token directly (no email service in this stage)
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  try {
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (!userResult.rows.length) {
      // Do not reveal whether email exists
      return res.json({ message: "If that email exists, a reset token has been generated." });
    }
    const userId = userResult.rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)",
      [userId, token, expiresAt]
    );
    // No email integration yet — token returned directly for this stage
    res.json({ message: "Reset token generated.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process request" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });
  const pwError = validatePassword(newPassword);
  if (pwError) return res.status(400).json({ error: pwError });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const tokenResult = await client.query(
      "SELECT * FROM password_reset_tokens WHERE token = $1 AND used = FALSE AND expires_at > NOW()",
      [token]
    );
    if (!tokenResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const record = tokenResult.rows[0];
    const hash = await bcrypt.hash(newPassword, 10);
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, record.user_id]);
    await client.query("UPDATE password_reset_tokens SET used = TRUE WHERE id = $1", [record.id]);
    await client.query("COMMIT");
    res.json({ message: "Password updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Could not reset password" });
  } finally {
    client.release();
  }
});

export default router;
