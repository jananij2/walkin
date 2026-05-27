import Link from "next/link";
import { ArrowRight, Images, Shirt, Sparkles } from "lucide-react";

const flows = [
  {
    href: "/closet",
    icon: Shirt,
    title: "Build your closet",
    description: "Upload clothing photos, add the basics, and let the app create a usable inventory."
  },
  {
    href: "/inspiration",
    icon: Images,
    title: "Capture your taste",
    description: "Paste Pinterest boards or add inspiration images so Walkin can understand your style."
  },
  {
    href: "/outfits",
    icon: Sparkles,
    title: "Generate outfits",
    description: "Combine your real wardrobe with your saved aesthetic to create wearable looks."
  }
];

export default function HomePage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_420px] lg:items-center">
      <div>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Personal styling from your real closet
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-[0] text-foreground">
          Turn saved outfit inspiration into things you can actually wear.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Walkin connects your closet inventory with the styles you save, then generates realistic
          outfit ideas using pieces you already own.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/closet"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Start with closet
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/outfits"
            className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition hover:bg-muted"
          >
            View outfit flow
          </Link>
        </div>
      </div>
      <div className="grid gap-3">
        {flows.map((flow) => (
          <Link
            key={flow.href}
            href={flow.href}
            className="group rounded-lg border bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
          >
            <flow.icon className="mb-4 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-[0]">{flow.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{flow.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
