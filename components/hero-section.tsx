import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-6xl w-full mx-auto text-center">
        {/* Decorative element */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Handcrafted with Care</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium text-balance mb-6 leading-tight">
          {"Elevate your wellness"}
          <span className="block text-primary">{"journey"}</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
          {
            "Transform your daily routine into an extraordinary experience with our artisan soaps, body care products, and wellness essentials"
          }
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="min-w-[200px]">
            Explore Collection
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent">
            Learn Our Story
          </Button>
        </div>

        {/* Hero Image Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src="/images/design-mode/Artisan_Soap%5B1%5D.JPG.jpeg"
              alt="Artisan Soaps Collection"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src="/images/design-mode/Body%20Cream.jpg"
              alt="Body Creams"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src="/images/design-mode/Concrete_Candles%5B1%5D.JPG.jpeg"
              alt="Concrete Candles"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src="/images/design-mode/Beard_Products%5B1%5D.jpg"
              alt="Beard Care Products"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
