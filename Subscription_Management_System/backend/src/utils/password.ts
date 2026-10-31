export function validatePassword(pw: string): string | null {
  if (pw.length <= 8) return "Password must be more than 8 characters";
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter";
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(pw)) return "Password must contain a special character";
  return null;
}
