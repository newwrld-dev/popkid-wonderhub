import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import botUltra from "@/assets/bot-ultra.png";
import botNeon from "@/assets/bot-neon.png";
import botPopkid from "@/assets/bot-popkid.png";
import {
  Bot, Download, Film, Github, FolderArchive, KeyRound, MessageCircle,
  Sparkles, Star, Server, Code2, Rocket, Shield, Zap, Globe, Phone,
  Mail, ArrowRight, CheckCircle2, Users, TrendingUp, Cpu, Cloud,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POPKID MD Hub — Bots, Downloaders, Movies, Hosting & More" },
      { name: "description", content: "All-in-one POPKID MD Hub: WhatsApp bots (ULTRA-MD, NEON-MD, POPKID-XD, AUTO-MD), social downloaders, movies, hosting from 100/=, web dev from 3000/=, AI chat & community." },
    ],
  }),
  component: Home,
});

const bots = [
  { name: "ULTRA-MD", img: botUltra, desc: "Powerful multi-device WhatsApp bot — 1000+ commands, AI, downloader, games.", fork: "https://github.com/popkidmain/ULTRA-MD/fork", repo: "https://github.com/popkidmain/ULTRA-MD", color: "from-pink-500 to-fuchsia-500" },
  { name: "NEON-MD", img: botNeon, desc: "Lightweight, fast, neon-themed bot. Perfect for daily WhatsApp automation.", fork: "https://github.com/popkidmain/NEON-MD/fork", repo: "https://github.com/popkidmain/NEON-MD", color: "from-emerald-500 to-cyan-500" },
  { name: "POPKID-XD", img: botPopkid, desc: "Original POPKID-MD-BOT package. Auto-status, anti-delete, downloads & more.", fork: "https://www.mediafire.com/file/xiwluxlsncup5be/POPKID-MD-BOT.zip/file", repo: "https://www.mediafire.com/file/xiwluxlsncup5be/POPKID-MD-BOT.zip/file", color: "from-purple-500 to-indigo-500" },
  { name: "AUTO-MD", img: botUltra, desc: "Automation-first WhatsApp bot. Schedule messages, auto-react & broadcast.", fork: "https://www.mediafire.com/file/egkq7j0rmh8kchw/AUTO-MD-main.zip/file", repo: "https://www.mediafire.com/file/egkq7j0rmh8kchw/AUTO-MD-main.zip/file", color: "from-orange-500 to-red-500" },
];

const tools = [
  { icon: Bot, title: "MiniBot Connect", desc: "Quick connect your POPKID MiniBot session.", href: "https://popkid-minibot-0cc55afac1fa.herokuapp.com/", tag: "Bot" },
  { icon: KeyRound, title: "Mega Session Loader", desc: "Generate your bot Session ID instantly.", href: "https://popkidmegasessionloader-e798641163ad.herokuapp.com/", tag: "Session" },
  { icon: Download, title: "Social Media Downloader", desc: "Download from TikTok, IG, YT, FB & more.", href: "https://downloaders-five.vercel.app/", tag: "Tool" },
  { icon: Film, title: "POPKID Movies", desc: "Stream the latest blockbusters & series.", href: "https://popkidmoviessitenew.onrender.com/", tag: "Stream" },
  { icon: Github, title: "POPKID GitHub", desc: "Browse all official POPKID repositories.", href: "https://github.com/popkidmain", tag: "Dev" },
  { icon: FolderArchive, title: "AUTO-MD ZIP", desc: "Direct download AUTO-MD source package.", href: "https://www.mediafire.com/file/egkq7j0rmh8kchw/AUTO-MD-main.zip/file", tag: "Download" },
];

const services = [
  { icon: Server, title: "Bot Hosting", price: "100/=", per: "per month", desc: "24/7 uptime hosting for your WhatsApp bot. Fast deploy, auto-restart, free SSL.", features: ["24/7 uptime", "Auto restart", "Free SSL", "Logs & monitoring"], color: "from-pink-500 to-rose-500" },
  { icon: Code2, title: "Web Development", price: "3000/=", per: "per project", desc: "Modern responsive websites built with React, Next, TanStack. SEO-ready & lightning fast.", features: ["Responsive design", "SEO optimized", "Free domain setup", "1 month support"], color: "from-cyan-500 to-blue-500" },
  { icon: Rocket, title: "Bot Deployment", price: "500/=", per: "one time", desc: "We deploy your bot to Heroku, Render, Koyeb, Railway or any platform of your choice.", features: ["Any platform", "Session setup", "Config tuning", "Test & verify"], color: "from-purple-500 to-fuchsia-500" },
  { icon: Cloud, title: "VPS & Panels", price: "From 1500/=", per: "monthly", desc: "Dedicated VPS servers and bot panels. Full root access, choose RAM and storage.", features: ["Root access", "DDOS protection", "Snapshot backups", "Pterodactyl panel"], color: "from-emerald-500 to-teal-500" },
  { icon: TrendingUp, title: "Social Media Boost", price: "From 200/=", per: "package", desc: "Grow followers, likes, and views on TikTok, Instagram, YouTube and WhatsApp channels.", features: ["Real engagement", "Fast delivery", "Multi-platform", "Safe & private"], color: "from-orange-500 to-amber-500" },
  { icon: Sparkles, title: "Custom Tech Help", price: "Talk to us", per: "any service", desc: "Got a tech problem? Custom bots, API integrations, scripts, AI tools — we handle it.", features: ["Custom builds", "API integration", "AI tools", "24h response"], color: "from-indigo-500 to-violet-500" },
];

const stats = [
  { icon: Users, value: "10K+", label: "Active Users" },
  { icon: Bot, value: "8+", label: "Bots Released" },
  { icon: Cpu, value: "99.9%", label: "Uptime" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
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
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Your All-In-One Tech Hub
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight">
            <span className="text-gradient">POPKID MD</span>
            <br />
            <span className="text-foreground">Resources Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground px-2">
            Bots, downloaders, movies, hosting, web development, AI chat and a live community — everything POPKID, simple and clean.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <a href="#bots" className="rounded-xl bg-gradient-neon px-6 py-3 font-semibold text-primary-foreground shadow-neon animate-pulse-glow text-sm md:text-base">
              Explore Bots
            </a>
            <a href="#services" className="rounded-xl glass px-6 py-3 font-semibold hover:border-primary transition text-sm md:text-base">
              View Pricing
            </a>
            <a href="#contact" className="rounded-xl border border-border px-6 py-3 font-semibold hover:border-primary transition text-sm md:text-base">
              Get In Touch
            </a>
          </div>

          {/* STATS */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 md:p-5">
                <s.icon className="h-6 w-6 text-accent mx-auto" />
                <p className="mt-2 font-display text-2xl md:text-3xl font-black text-gradient">{s.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTS — main attraction */}
      <section id="bots" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent">🤖 WhatsApp Bots</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold">All <span className="text-gradient">POPKID Bots</span></h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Fork, deploy and run your own WhatsApp bot in minutes. Click any bot to fork its repo.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {bots.map((b) => (
            <div key={b.name} className="group glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
              <div className="flex items-start gap-5">
                <div className={`shrink-0 h-24 w-24 rounded-2xl bg-gradient-to-br ${b.color} p-3 shadow-neon flex items-center justify-center`}>
                  <img src={b.img} alt={b.name} loading="lazy" width={96} height={96} className="h-full w-full object-contain animate-float" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl font-bold text-gradient">{b.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={b.fork} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-neon px-4 py-2 text-xs font-semibold text-primary-foreground shadow-neon">
                      <Github className="h-3.5 w-3.5" /> Fork & Deploy
                    </a>
                    <a href={b.repo} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:border-primary transition">
                      View Repo <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent">🛠️ Tools & Resources</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold">Everything <span className="text-gradient">in one click</span></h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((r) => (
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
              <p className="mt-4 text-xs text-primary font-semibold inline-flex items-center gap-1">Open <ArrowRight className="h-3 w-3" /></p>
            </a>
          ))}
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent">💼 Services & Pricing</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold">Affordable <span className="text-gradient">Tech Services</span></h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Bot hosting from 100/=, web dev from 3000/= and more. Quality you can trust.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition relative overflow-hidden">
              <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
              <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-neon`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="relative mt-4 font-display text-xl font-bold">{s.title}</h3>
              <div className="relative mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-black text-gradient">{s.price}</span>
                <span className="text-xs text-muted-foreground">{s.per}</span>
              </div>
              <p className="relative mt-3 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="relative mt-4 space-y-1.5">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="relative mt-5 inline-flex w-full justify-center rounded-lg bg-gradient-neon px-4 py-2 text-sm font-semibold text-primary-foreground shadow-neon hover:opacity-90 transition">
                Order Now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-accent">⭐ Why POPKID MD</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold">Built for <span className="text-gradient">Speed & Trust</span></h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Optimized hosting & code for instant response." },
            { icon: Shield, title: "Secure & Private", desc: "End-to-end encrypted sessions, never shared." },
            { icon: Globe, title: "Always Online", desc: "99.9% uptime backed by global infrastructure." },
            { icon: Sparkles, title: "AI Powered", desc: "Built-in AI assistant for support 24/7." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 text-center hover:border-primary hover:shadow-neon transition">
              <f.icon className="h-8 w-8 mx-auto text-accent" />
              <h3 className="mt-3 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI / COMMUNITY CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/community" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <MessageCircle className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">Community Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">Live chat with other POPKID users & post your reviews.</p>
            <p className="mt-3 text-xs text-primary font-semibold inline-flex items-center gap-1">Join Now <ArrowRight className="h-3 w-3" /></p>
          </Link>
          <Link to="/ai" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <Sparkles className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">POPKID AI Assistant</h3>
            <p className="text-sm text-muted-foreground mt-1">Talk to our AI 24/7 — bot help, deployment, pricing & more.</p>
            <p className="mt-3 text-xs text-primary font-semibold inline-flex items-center gap-1">Chat with AI <ArrowRight className="h-3 w-3" /></p>
          </Link>
          <Link to="/services" className="glass rounded-2xl p-6 hover:border-primary hover:shadow-neon transition">
            <Star className="h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-xl font-bold">Full Pricing</h3>
            <p className="text-sm text-muted-foreground mt-1">See all our packages & order any service in one click.</p>
            <p className="mt-3 text-xs text-primary font-semibold inline-flex items-center gap-1">View Pricing <ArrowRight className="h-3 w-3" /></p>
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24">
        <div className="glass rounded-3xl p-8 md:p-12 text-center shadow-glow">
          <span className="text-xs uppercase tracking-widest text-accent">📞 Get In Touch</span>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold">Ready to <span className="text-gradient">level up?</span></h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Order hosting, request a website, deploy a bot or just chat — we reply fast.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-xl bg-gradient-neon px-6 py-3 font-semibold text-primary-foreground shadow-neon">
              <Phone className="h-4 w-4" /> WhatsApp Us
            </a>
            <a href="mailto:popkidmain@gmail.com"
               className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 font-semibold hover:border-primary transition">
              <Mail className="h-4 w-4" /> Email
            </a>
            <a href="https://github.com/popkidmain" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-semibold hover:border-primary transition">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
