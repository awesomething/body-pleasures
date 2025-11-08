import { Card } from "@/components/ui/card"

const categories = [
  {
    name: "Artisan Soaps",
    description: "Handcrafted with natural ingredients for a luxurious cleanse",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artisan_Soap%5B1%5D.JPG-LJObqRHG2mJDmkfMDvYBaGf3E4TKep.jpeg",
  },
  {
    name: "Beard Care",
    description: "Complete grooming solutions for the modern gentleman",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beard_Products%5B1%5D-pQ8ZlFQCVAS3bvrmnmPhxfxovGmpAo.jpg",
  },
  {
    name: "Body Care",
    description: "Nourishing creams and butters for silky smooth skin",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Body%20Cream-N9t1RSSJNw9bXCQNVeD6YpeOzKUB1S.jpg",
  },
  {
    name: "Concrete Candles",
    description: "Elegant candles in artisan concrete vessels",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Concrete_Candles%5B1%5D.JPG-tJRWLpPssq5xtfSrv2DBK3nC2CRugO.jpeg",
  },
  {
    name: "Relief Products",
    description: "Pain relief oils and magnesium products for comfort",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Relief_Products%5B1%5D.JPG-vRg5JeDBkmzAKszdChqQnXDlVFT18g.jpeg",
  },
  {
    name: "Body Sprays & Oils",
    description: "Luxurious scents to refresh and rejuvenate",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250912_185335%5B1%5D.JPG-juAZNKXLXO2c1B5pMQNDrRYMEs2EZB.jpeg",
  },
]

export function ProductCategories() {
  return (
    <section id="collections" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium mb-4 text-balance">
            {"Our Collections"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            {
              "Discover our thoughtfully curated selection of wellness products, each crafted with care and premium ingredients"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
