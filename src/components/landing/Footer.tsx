import { Linkedin, Twitter, Instagram, Youtube } from "lucide-react";

const links = {
  Product: ["Browse Profiles", "PsycheMap™", "Founder Sprint", "Pricing"],
  Resources: ["Blog", "Guides", "Webinars", "Community"],
  Company: ["About Us", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-accent text-lg font-semibold">
              CoFounder <span className="text-primary">✦</span> Matrimony
            </span>
            <p className="text-sm text-background/50 mt-3 leading-relaxed">
              Where visionary founders find their perfect co-builder.
            </p>
            <div className="flex gap-3 mt-4">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full border border-background/10 hover:border-primary hover:text-primary transition-colors" aria-label="Social link">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-background/80">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-background/50 hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-background/10 pt-8 mb-8">
          <div className="max-w-md">
            <h4 className="text-sm font-semibold mb-2">Stay in the loop</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-background/5 border border-background/10 rounded-lg px-4 py-2.5 text-sm text-background placeholder:text-background/30 focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <p>© 2026 CoFounder Matrimony. All rights reserved.</p>
          <p>Made with ♡ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
