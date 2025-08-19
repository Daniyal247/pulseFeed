import React from "react";
import { useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useArabicTTS } from "@/hooks/useArabicTTS";

// In real integration, fetch news by ID from backend
const sample = {
  title: "Global Markets Rally as Tech Leads Gains",
  image: "/placeholder.svg",
  content:
    "قفزت الأسواق العالمية اليوم مع قيادة قطاع التكنولوجيا للمكاسب، حيث سجلت الأسهم ارتفاعات واسعة مدعومة بتقارير أرباح قوية وتراجع المخاوف التضخمية.",
};

const NewsDetail: React.FC = () => {
  const { id } = useParams();
  const { speak, stop, ready } = useArabicTTS();
  const text = sample.content;

  return (
    <div className="min-h-screen">
      <SEO title={`News #${id} – PulseFeed`} description={sample.title} />
      <Header />
      <main className="container mx-auto py-6 grid grid-cols-12 gap-6">
        <article className="col-span-12 lg:col-span-8 space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">{sample.title}</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sample.image} alt={sample.title} className="w-full rounded-lg border" loading="lazy" />
          <p className="leading-relaxed text-lg">{text}</p>
          <div className="flex items-center gap-3">
            <Button onClick={() => speak(text)} disabled={!ready}>Read in Arabic</Button>
            <Button variant="secondary" onClick={stop}>Stop</Button>
          </div>
        </article>
        <aside className="hidden lg:block col-span-4">
          <div className="sticky top-6 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Related</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Tech earnings beat expectations</li>
              <li>Inflation outlook softens</li>
              <li>Analysts raise forecasts</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default NewsDetail;
