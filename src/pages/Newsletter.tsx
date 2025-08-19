import React, { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const NewsletterPage: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>("");

  const trigger = async () => {
    if (!user) return;
    try {
      // Call your FastAPI endpoint here
      await fetch("/api/newsletter/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      setStatus("Request sent. Your daily email will arrive shortly.");
    } catch (e) {
      setStatus("Could not reach backend. Please check your API.");
    }
  };

  return (
    <div className="min-h-screen">
      <SEO title="Newsletter – PulseFeed" description="Manage and trigger your daily personalized newsletter." />
      <Header />
      <main className="container mx-auto py-10 max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Daily Newsletter</h1>
        <p className="text-muted-foreground">Send yourself the latest news based on your chosen categories. Your backend will schedule this every 24 hours.</p>
        <Button onClick={trigger} disabled={!user}>Send me today's newsletter</Button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </main>
    </div>
  );
};

export default NewsletterPage;
