const API_BASE = "/api"; // Point this to your FastAPI base URL

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string; categories: string[]; newsletter: boolean };

export const api = {
  async login(payload: LoginPayload) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  async signup(payload: SignupPayload) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  },
  async getFeed(categories?: string[]) {
    const qs = categories?.length ? `?categories=${encodeURIComponent(categories.join(","))}` : "";
    const res = await fetch(`${API_BASE}/news/feed${qs}`);
    if (!res.ok) throw new Error("Feed fetch failed");
    return res.json();
  },
  async getNewsById(id: string) {
    const res = await fetch(`${API_BASE}/news/${id}`);
    if (!res.ok) throw new Error("News fetch failed");
    return res.json();
  },
  async subscribeNewsletter(email: string, subscribe: boolean) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subscribe }),
    });
    if (!res.ok) throw new Error("Subscription failed");
    return res.json();
  },
  async triggerDailyEmail(email: string) {
    const res = await fetch(`${API_BASE}/newsletter/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Trigger failed");
    return res.json();
  },
};
