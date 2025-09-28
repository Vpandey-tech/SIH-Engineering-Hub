import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, LayoutDashboard, Mail, LogOut } from "lucide-react"; // added Mail icon
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "../App";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseClient";
import axios from "axios";
import { toast } from "sonner";

const navLinks = [
  { name: "Home", to: "/", icon: Home },
  { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { name: "Contact Us", to: "/contact", icon: Mail }, // added Contact Us
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    console.log("Current user in Navbar:", user);
    try {
      if (user) {
        await axios.post("http://localhost:5000/api/logout", { uid: user.uid });
      }
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-background border-b shadow-sm fixed w-full z-30 top-0">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <img
            src="../images/Our-Logo.jpg" 
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover" 
          />

          <span className="font-bold text-xl tracking-tight text-primary">
            Engineering Study Hub
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center space-x-3">
          {navLinks.map(({ name, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-3 py-2 rounded font-medium ${
                location.pathname === to
                  ? "bg-muted text-primary"
                  : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              } transition`}
            >
              <Icon className="mr-2 h-5 w-5" />
              <span className="hidden md:inline">{name}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline">
                Welcome, {user.displayName}
              </span>
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-full">
                  <User className="mr-2 w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" size="sm" className="rounded-full">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
