// const API_BASE = import.meta.env.VITE_API_URL || "http://20.242.200.78:8000/api";
// const WS_BASE = (import.meta.env.VITE_WS_URL as string) || API_BASE.replace(/^http/, "ws");
const API_BASE = import.meta.env.VITE_API_URL || "https://pulse-feed-backend.azurewebsites.net/";

// Derive WS_BASE properly (wss if https, ws if http)
const WS_BASE = import.meta.env.VITE_WS_URL || API_BASE.replace(/^http/, "ws");


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
  openNewsStream(params?: { categories?: string[]; sources?: string[]; limit?: number }) {
    const qsParts: string[] = [];
    if (params?.categories?.length) qsParts.push(`categories=${encodeURIComponent(params.categories.join(","))}`);
    if (params?.sources?.length) qsParts.push(`sources=${encodeURIComponent(params.sources.join(","))}`);
    if (params?.limit) qsParts.push(`limit=${params.limit}`);
    const qs = qsParts.length ? `?${qsParts.join("&")}` : "";
    const wsUrl = `${WS_BASE}/news/stream${qs}`;
    console.log('Creating WebSocket connection to:', wsUrl);
    console.log('WS_BASE:', WS_BASE);
    console.log('API_BASE:', API_BASE);
    return new WebSocket(wsUrl);
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
