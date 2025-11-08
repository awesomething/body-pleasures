"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingBag } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-serif font-semibold text-foreground">{"Ms V's Body Pleasures"}</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#shop" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
            <Button size="sm" variant="ghost">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#shop" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#collections" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Collections
            </a>
            <a href="#about" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              About
            </a>
            <a href="#contact" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
