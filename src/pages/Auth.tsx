import React, { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ALL_CATEGORIES } from "@/constants/categories";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const toggle = (c: string) => setSelected((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <div className="min-h-screen">
      <SEO title="Sign in – PulseFeed" description="Access your personalized PulseFeed news feed." />
      <Header />
      <main className="container mx-auto py-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Welcome back</h1>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button onClick={async () => { await signIn(email, password); navigate("/"); }}>Sign in</Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email2">Email</Label>
              <Input id="email2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password2">Password</Label>
              <Input id="password2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Choose your categories</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={selected.includes(c)} onCheckedChange={() => toggle(c)} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={newsletter} onCheckedChange={(v) => setNewsletter(Boolean(v))} />
              <span>Subscribe to daily newsletter via email</span>
            </label>
            <Button onClick={async () => { await signUp(name, email, password, selected, newsletter); navigate("/"); }}>Create account</Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AuthPage;
