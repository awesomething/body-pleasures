import { Flower2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="h-6 w-6" />
              <h3 className="text-xl font-serif font-semibold">{"Ms V's Body Pleasures"}</h3>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {
                "Artisan soaps & body products. Elevate your daily routine into an extraordinary and delightful wellness journey."
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Artisan Soaps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Beard Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Body Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Candles
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Markets & Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  Wholesale
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>{"© 2025 Ms V's Body Pleasures. All rights reserved."}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
