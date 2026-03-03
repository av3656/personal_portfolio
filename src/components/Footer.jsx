export function Footer() {
  return (
    <footer className="border-t border-slate-900/5 bg-surface-light/80 px-4 py-4 text-[11px] text-slate-500 backdrop-blur dark:border-slate-50/10 dark:bg-slate-950/80 dark:text-slate-400">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Aman Verma. All rights reserved.</p>
        <p className="hidden sm:block">Engineering student · Backend &amp; Java focused.</p>
      </div>
    </footer>
  )
}

