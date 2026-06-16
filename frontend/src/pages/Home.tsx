import { ArrowRight, Heart, Images, Shirt, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ClosetDoor } from "@/components/closet-door";

const flows = [
  {
    to: "/inspiration",
    icon: Images,
    title: "Inspo",
    description: ""
  },
  {
    to: "/closet",
    icon: Shirt,
    title: "Closet",
    description: ""
  },
  {
    to: "/outfits",
    icon: Sparkles,
    title: "Lookbook",
    description: ""
  }
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <p className="mb-7 text-sm font-medium lowercase tracking-[0.08em] text-primary">
          your curated closet awaits...
        </p>
        <div className="door-stage w-full max-w-sm">
          <ClosetDoor />
        </div>
      </section>

      <section
        id="walkin-sections"
        className="mx-auto grid min-h-[calc(100vh-73px)] scroll-mt-24 content-start gap-8 px-6 py-12 lg:max-w-6xl lg:pt-20"
      >
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/inspiration"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:translate-y-[-1px]"
            >
              Start with inspo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/outfits"
              className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-5 py-3 text-sm font-bold transition hover:bg-muted"
            >
              Lookbook
              <Heart className="h-4 w-4" />
            </Link>
          </div>
          <h1 className="mt-8 max-w-3xl text-4xl font-black leading-tight tracking-[0] text-foreground md:text-6xl">
            Introducing your personal lookbook, styled from your closet with your inspo.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Upload your inspo, add items in your closet, and walkin to your Lookbook.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {flows.map((flow) => (
            <Link
              key={flow.to}
              to={flow.to}
              className="group rounded-2xl border bg-background/65 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
            >
              <flow.icon className="mb-4 h-5 w-5 text-primary" />
              <h2 className="text-lg font-black tracking-[0]">{flow.title}</h2>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
