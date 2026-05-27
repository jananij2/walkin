import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walkin",
  description: "Turn your real closet into outfits inspired by your saved style."
};

const navItems = [
  { href: "/closet", label: "Closet" },
  { href: "/inspiration", label: "Inspiration" },
  { href: "/outfits", label: "Outfits" },
  { href: "/profile", label: "Profile" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b bg-background/90">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-xl font-semibold tracking-[0]">
                Walkin
              </Link>
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2 transition hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
