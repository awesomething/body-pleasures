import { Leaf, Heart, Sparkles } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "We use only the finest natural and organic ingredients in all our products",
  },
  {
    icon: Heart,
    title: "Handcrafted with Love",
    description: "Every product is carefully handmade in small batches for quality assurance",
  },
  {
    icon: Sparkles,
    title: "Wellness Focused",
    description: "Our mission is to elevate your daily self-care routine into a luxurious ritual",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <img
                src="/images/design-mode/20240921_163032%5B1%5D.JPG.jpeg"
                alt="Ms V's Body Pleasures Market Booth"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-6 text-balance">
              {"Artisan wellness for body & soul"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
              {
                "At Ms V's Body Pleasures, we believe that self-care should be an extraordinary experience. Our handcrafted artisan products are designed to transform your daily routine into a delightful wellness journey."
              }
            </p>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed text-pretty">
              {
                "From our signature artisan soaps to our nourishing body care line, each product is made with premium natural ingredients and a commitment to quality that you can feel."
              }
            </p>

            <div className="space-y-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
