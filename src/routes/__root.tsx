import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-7xl font-display text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the neon void</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "POPKID MD — All-in-One Resources Hub" },
      { name: "description", content: "POPKID MD Hub: WhatsApp bots, downloaders, movies, hosting, web dev, AI chat & community reviews." },
      { property: "og:title", content: "POPKID MD — All-in-One Resources Hub" },
      { property: "og:description", content: "POPKID MD Hub: WhatsApp bots, downloaders, movies, hosting, web dev, AI chat & community reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "POPKID MD — All-in-One Resources Hub" },
      { name: "twitter:description", content: "POPKID MD Hub: WhatsApp bots, downloaders, movies, hosting, web dev, AI chat & community reviews." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/GEQRhrBrXCeeucTAKEZ1qqI8H3I2/social-images/social-1777401348870-982773.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/GEQRhrBrXCeeucTAKEZ1qqI8H3I2/social-images/social-1777401348870-982773.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-neon shadow-neon flex items-center justify-center font-display font-black text-primary-foreground">P</div>
          <span className="font-display text-lg font-bold tracking-wider">POPKID <span className="text-gradient">MD</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-primary transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/services" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Services</Link>
          <Link to="/community" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Community</Link>
          <Link to="/ai" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>AI Chat</Link>
          <Link to="/auth" className="rounded-lg bg-gradient-neon px-4 py-2 font-semibold text-primary-foreground shadow-neon hover:opacity-90 transition">Sign In</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
      <p>✨ POPKID MD © {new Date().getFullYear()} — All your tools in one place.</p>
    </footer>
  );
}

function RootComponent() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen"><Outlet /></main>
      <Footer />
      <Toaster />
    </>
  );
}
