export function Footer() {
  return (
    <footer className="border-t border-ai-border bg-ai-navy/80 px-4 py-4 text-[11px] text-ai-text-secondary backdrop-blur dark:border-ai-border dark:bg-ai-navy/80 dark:text-ai-text-secondary">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Aman Verma. All rights reserved.</p>
        <p className="hidden sm:block">Engineering student · Backend &amp; Java focused.</p>
      </div>
    </footer>
  )
}

