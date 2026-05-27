import type { Metadata } from "next";
import Link from "next/link";
import { Figtree, Lobster_Two } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "walkin⋆˙⟡",
  description: "Turn your real closet into outfits inspired by your saved style."
};

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree"
});

const lobsterTwo = Lobster_Two({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lobster-two"
});

const navItems = [
  { href: "/inspiration", label: "Inspo" },
  { href: "/closet", label: "Closet" },
  { href: "/outfits", label: "Lookbook" }
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${lobsterTwo.variable} font-sans`}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b bg-background/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="font-title text-3xl font-bold tracking-[0] text-primary">
                walkin⋆˙⟡
              </Link>
              <nav className="flex items-center gap-1 rounded-full border bg-background/70 p-1 text-sm font-medium text-muted-foreground">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-3 py-2 transition hover:bg-primary hover:text-primary-foreground"
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
