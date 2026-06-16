export default function ProfilePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-[0]">Style Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Store user preferences, extracted aesthetic themes, fit notes, and future shopping signals.
      </p>
      <div className="mt-8 rounded-lg border bg-background p-5">
        <h2 className="text-lg font-semibold tracking-[0]">MVP preferences</h2>
        <div className="mt-5 grid gap-4">
          {["Preferred colors", "Avoided items", "Common occasions", "Comfort notes"].map((label) => (
            <label key={label} className="grid gap-2 text-sm font-medium">
              {label}
              <input className="rounded-md border bg-background px-3 py-2 font-normal" />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
