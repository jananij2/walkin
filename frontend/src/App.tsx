import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import Closet from "./pages/Closet";
import Home from "./pages/Home";
import Inspiration from "./pages/Inspiration";
import Outfits from "./pages/Outfits";
import Profile from "./pages/Profile";

const navItems = [
  { to: "/inspiration", label: "Inspo" },
  { to: "/closet", label: "Closet" },
  { to: "/outfits", label: "Lookbook" }
];

function RootLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-title text-3xl font-bold tracking-[0] text-primary">
            walkin⋆˙⟡
          </Link>
          <nav className="flex items-center gap-1 rounded-full border bg-background/70 p-1 text-sm font-medium text-muted-foreground">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-2 transition hover:bg-primary hover:text-primary-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
