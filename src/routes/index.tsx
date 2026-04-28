import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { Bot, Download, Film, Github, FolderArchive, KeyRound, MessageCircle, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POPKID MD Hub — Bots, Downloaders, Movies & More" },
      { name: "description", content: "Your all-in-one POPKID MD Resources Hub: WhatsApp bots, downloaders, movies, hosting, web dev, AI chat & community." },
    ],
  }),
  component: Home,
});

const resources = [
  { icon: Bot, title: "MiniBot Link", desc: "Connect your POPKID MiniBot session", href: "https://popkid-minibot-0cc55afac1fa.herokuapp.com/", tag: "Bot" },
  { icon: Download, title: "Social Media Downloader", desc: "Download from any platform fast", href: "https://downloaders-five.vercel.app/", tag: "Tool" },
  { icon: Film, title: "POPKID Movies", desc: "Stream the latest blockbusters", href: "https://popkidmoviessitenew.onrender.com/", tag: "Stream" },
  { icon: Github, title: "ULTRA-MD Bot", desc: "Fork and deploy ULTRA-MD WhatsApp bot", href: "https://github.com/popkidmain/ULTRA-MD/fork", tag: "Deploy" },
  { icon: Github, title: "NEON-MD Bot", desc: "Fork and deploy NEON-MD WhatsApp bot", href: "https://github.com/popkidmain/NEON-MD/fork", tag: "Deploy" },
  { icon: Sparkles, title: "Developer", desc: "Visit POPKID main GitHub", href: "https://github.com/popkidmain", tag: "Dev" },
  { icon: FolderArchive, title: "AUTO-MD File", desc: "Download AUTO-MD source ZIP", href: "https://www.mediafire.com/file/egkq7j0rmh8kchw/AUTO-MD-main.zip/file", tag: "Download" },
  { icon: FolderArchive, title: "POPKID XD ZIP", desc: "Download POPKID-MD-BOT package", href: "https://www.mediafire.com/file/xiwluxlsncup5be/POPKID-MD-BOT.zip/file", tag: "Download" },
  { icon: KeyRound, title: "Session ID Loader", desc: "Generate your bot Session ID", href: "https://popkidmegasessionloader-e798641163ad.herokuapp.com/", tag: "Tool" },
];

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-36 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" /> All-in-One Resources Hub
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-black tracking-tight">
            <span className="text-gradient">POPKID MD</span>
            <br />
            <span className="text-foreground">Resources Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Bots, downloaders, movies, hosting, web dev, AI chat and a live community — simple, clean, and easy to access.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#resources" className="rounded-xl bg-gradient-neon px-7 py-3.5 font-semibold text-primary-foreground shadow-neon animate-pulse-glow">
              Explore Tools
            </a>
            <Link to="/services" className="rounded-xl glass px-7 py-3.5 font-semibold hover:border-primary transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold">🌟 Resources <span className="text-gradient">Hub</span></h2>
          <p className="mt-3 text-muted-foreground">Everything POPKID MD in one click.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer"
               className="group glass rounded-2xl p-6 transition hover:border-primary hover:shadow-neon hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-neon/20 border border-primary/30 flex items-center justify-center group-hover:bg-gradient-neon transition">
                  <r.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-accent">{r.tag}</span>
              </div>
              <h3 className="font-display text-lg font-bold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <p className="mt-4 text-xs text-primary font-semibold">Open →</p>
            </a>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/services" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <Star className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">Services & Pricing</h3>
            <p className="text-sm text-muted-foreground mt-1">Bot hosting from 100/= · Web dev from 3000/=</p>
          </Link>
          <Link to="/community" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <MessageCircle className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">Community Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">Live chat & post your reviews</p>
          </Link>
          <Link to="/ai" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <Sparkles className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">POPKID AI</h3>
            <p className="text-sm text-muted-foreground mt-1">Talk to our AI assistant 24/7</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
