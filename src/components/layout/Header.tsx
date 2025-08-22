import React from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext"; // Auth disabled
// import { Button } from "@/components/ui/button"; // Auth buttons removed

const Header: React.FC = () => {
  // const { user, signOut } = useAuth(); // Auth disabled
  // const navigate = useNavigate(); // Auth disabled

  return (
    <header className="w-full border-b border-gray-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/90">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link to="/" className="font-semibold tracking-tight text-lg text-white hover:text-gray-300 transition-colors">
          PulseFeed
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/newsletter" className="text-sm text-gray-300 hover:text-white transition-colors">Newsletter</Link>
          {/* Auth buttons removed */}
          {/* {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hello {user.name}</span>
              <Button variant="secondary" size="sm" onClick={() => { signOut(); navigate("/auth"); }}>Sign out</Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
          )} */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
