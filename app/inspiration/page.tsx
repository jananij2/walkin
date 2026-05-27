import { LinkIcon, Upload } from "lucide-react";

export default function InspirationPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-[0]">Inspiration</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Save Pinterest boards or inspiration images so Walkin can extract your aesthetic.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-background p-5">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-lg font-semibold tracking-[0]">Pinterest board</h2>
          <div className="mt-4 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="https://pinterest.com/..."
            />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Add
            </button>
          </div>
        </div>
        <div className="rounded-lg border bg-background p-5">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-lg font-semibold tracking-[0]">Upload images</h2>
          <button className="mt-4 flex min-h-32 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground hover:bg-muted">
            Drop screenshots or photos
          </button>
        </div>
      </div>
    </section>
  );
}
