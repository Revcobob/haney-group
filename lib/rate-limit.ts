import "server-only";
import { createHash } from "node:crypto";

// Per-IP, in-process rate limiter for the public contact form.
// Lightweight: resets on server restart, no Redis dependency.
// Sufficient for a low-traffic firm site; promote to a durable store
// (Upstash, Vercel KV) if abuse becomes a problem.

const buckets = new Map<string, number[]>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const LIMIT = 5;

export function hashIp(raw: string): string {
  if (!raw) return "anon";
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const arr = (buckets.get(key) ?? []).filter((t) => t > cutoff);
  if (arr.length >= LIMIT) {
    buckets.set(key, arr);
    return { allowed: false, remaining: 0 };
  }
  arr.push(now);
  buckets.set(key, arr);
  // Tidy up other expired buckets occasionally.
  if (buckets.size > 256) {
    for (const [k, v] of buckets.entries()) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) buckets.delete(k);
      else buckets.set(k, fresh);
    }
  }
  return { allowed: true, remaining: LIMIT - arr.length };
}

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  if (first) return first;
  return request.headers.get("x-real-ip") ?? "";
}
