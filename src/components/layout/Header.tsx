import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="font-semibold tracking-tight text-lg">
          PulseFeed
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/newsletter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Newsletter</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hello {user.name}</span>
              <Button variant="secondary" size="sm" onClick={() => { signOut(); navigate("/auth"); }}>Sign out</Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
