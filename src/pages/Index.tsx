import React, { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import NewsCard, { NewsItem } from "@/components/news/NewsCard";
import NewsTicker from "@/components/news/NewsTicker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ALL_CATEGORIES } from "@/constants/categories";

const mockItems: NewsItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: String(i + 1),
  title: `Breaking: Market Update ${i + 1}`,
  summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  image: "/placeholder.svg",
  category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
  source: "Wire",
  published_at: new Date(Date.now() - i * 3600_000).toISOString(),
}));

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategories, setSelected] = useState<string[]>(user?.categories || []);
  const [left, setLeft] = useState<NewsItem[]>(mockItems.slice(0, 6));
  const [right, setRight] = useState<NewsItem[]>(mockItems.slice(3, 9));

  useEffect(() => {
    const iv = setInterval(() => {
      const next: NewsItem = {
        id: String(Date.now()),
        title: `Update • ${new Date().toLocaleTimeString()}`,
        summary: "Live update added.",
        category: ALL_CATEGORIES[Math.floor(Math.random() * ALL_CATEGORIES.length)],
      };
      setLeft((l) => [next, ...l].slice(0, 20));
      setRight((r) => [next, ...r].slice(0, 20));
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    if (!selectedCategories.length) return mockItems;
    return mockItems.filter((m) => selectedCategories.includes(m.category || ""));
  }, [selectedCategories]);

  return (
    <div className="min-h-screen">
      <SEO title="PulseFeed – Personalized News Feed" description="Your sleek, personalized news feed with live side streams and Arabic TTS." />
      <Header />
      <main className="container mx-auto py-6 grid grid-cols-12 gap-6">
        <section className="col-span-12">
          <h1 className="text-3xl font-semibold tracking-tight">{user ? `Hello ${user.name}` : "Your Personalized Feed"}</h1>
          <p className="text-muted-foreground">Stay updated with real-time news tailored to your interests.</p>
        </section>

        <aside className="hidden md:block col-span-3">
          <NewsTicker title="Live Stream" items={left} onItemClick={(id) => navigate(`/news/${id}`)} />
        </aside>

        <section className="col-span-12 md:col-span-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {(user?.categories?.length ? user.categories : ALL_CATEGORIES).map((c) => (
              <button
                key={c}
                onClick={() => setSelected((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])}
                className="px-3 py-1 rounded-md border text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-pressed={selectedCategories.includes(c)}
              >
                {selectedCategories.includes(c) ? <Badge variant="secondary">{c}</Badge> : c}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <NewsCard key={item.id} item={item} onClick={() => navigate(`/news/${item.id}`)} />
            ))}
          </div>
        </section>

        <aside className="hidden md:block col-span-3">
          <NewsTicker title="Trending Now" items={right} onItemClick={(id) => navigate(`/news/${id}`)} />
        </aside>
      </main>
    </div>
  );
};

export default Index;
