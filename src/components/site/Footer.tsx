export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-2xl text-gradient">Collabry.</span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Collabry. Crafted for creators & brands.
        </p>
      </div>
    </footer>
  );
}
