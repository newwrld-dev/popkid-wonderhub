import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Bot, Code, Server, Megaphone, Palette, Wrench } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — POPKID MD" },
      { name: "description", content: "POPKID MD services: WhatsApp bot hosting, web development, custom bots, branding & more." },
    ],
  }),
  component: Services,
});

const plans = [
  {
    icon: Server, name: "Bot Hosting", price: "100", unit: "/= per month",
    highlight: false,
    features: ["24/7 uptime", "Free session setup", "WhatsApp bot deployment", "Auto-restart on crash", "Basic support"],
  },
  {
    icon: Code, name: "Web Development", price: "3,000", unit: "/= starting",
    highlight: true,
    features: ["Custom responsive design", "Up to 5 pages included", "Mobile + desktop optimized", "Free hosting setup help", "30-day support"],
  },
  {
    icon: Bot, name: "Custom Bot Build", price: "1,500", unit: "/= starting",
    highlight: false,
    features: ["Tailored commands", "Custom branding", "Source code delivered", "Deployment help", "Bug fixes for 14 days"],
  },
];

const more = [
  { icon: Palette, t: "Logo & Branding", d: "Eye-catching identity for your brand" },
  { icon: Megaphone, t: "Social Media Setup", d: "Profile setup + content templates" },
  { icon: Wrench, t: "Bot Maintenance", d: "Updates, fixes & monitoring" },
  { icon: Code, t: "Landing Pages", d: "High-converting one-pagers" },
];

function Services() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl font-black">
          <span className="text-gradient">Services</span> & Pricing
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Affordable, professional, and built for creators. Pick a plan or request something custom.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name}
               className={`relative glass rounded-3xl p-8 ${p.highlight ? "border-primary shadow-neon" : ""}`}>
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-neon px-3 py-1 text-xs font-bold text-primary-foreground">
                MOST POPULAR
              </span>
            )}
            <p.icon className="h-10 w-10 text-accent" />
            <h3 className="mt-4 font-display text-2xl font-bold">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-black text-gradient">{p.price}</span>
              <span className="text-muted-foreground text-sm">{p.unit}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-accent flex-shrink-0" /> <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="https://github.com/popkidmain" target="_blank" rel="noopener noreferrer"
               className={`mt-8 block text-center rounded-xl py-3 font-semibold transition ${p.highlight ? "bg-gradient-neon text-primary-foreground shadow-neon" : "glass hover:border-primary"}`}>
              Get Started
            </a>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <h2 className="font-display text-3xl font-bold">And <span className="text-gradient">More</span> Services</h2>
        <p className="mt-2 text-muted-foreground">Quote on request — every project is different.</p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {more.map((m) => (
          <div key={m.t} className="glass rounded-2xl p-6 hover:border-primary transition">
            <m.icon className="h-7 w-7 text-primary" />
            <h3 className="mt-3 font-display font-bold">{m.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{m.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 glass rounded-3xl p-10 text-center neon-border">
        <h3 className="font-display text-2xl font-bold">Ready to launch?</h3>
        <p className="text-muted-foreground mt-2">Chat with us, leave a review, or talk to POPKID AI.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/community" className="rounded-xl bg-gradient-neon px-6 py-3 font-semibold text-primary-foreground shadow-neon">Open Community</Link>
          <Link to="/ai" className="rounded-xl glass px-6 py-3 font-semibold hover:border-primary">Ask POPKID AI</Link>
        </div>
      </div>
    </div>
  );
}
