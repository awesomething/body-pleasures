import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function FeaturedProducts() {
  return (
    <section id="shop" className="py-24 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium mb-4 text-balance">
            {"Bestselling Products"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            {"Our most loved products, trusted by customers for their quality and effectiveness"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Large Featured Product 1 */}
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artisan_Soap%5B1%5D.JPG-LJObqRHG2mJDmkfMDvYBaGf3E4TKep.jpeg"
                alt="Artisan Soap Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif font-medium mb-2">Artisan Soap Collection</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {"Choose from over 30 unique scents and formulations"}
              </p>
              <p className="text-xl font-medium mb-4">{"Starting at $6.00"}</p>
              <Button className="w-full">Shop Soaps</Button>
            </div>
          </Card>

          {/* Large Featured Product 2 */}
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beard_Products%5B1%5D-pQ8ZlFQCVAS3bvrmnmPhxfxovGmpAo.jpg"
                alt="Beard Care Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif font-medium mb-2">Complete Beard Care</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {"Premium oils, washes, balms, and conditioners"}
              </p>
              <p className="text-xl font-medium mb-4">{"Starting at $5.00"}</p>
              <Button className="w-full">Shop Beard Care</Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Body%20Cream-N9t1RSSJNw9bXCQNVeD6YpeOzKUB1S.jpg"
                alt="Body Cream"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Body Cream</h4>
              <p className="text-sm text-muted-foreground">{"$8.00"}</p>
            </div>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Relief_Products%5B1%5D.JPG-vRg5JeDBkmzAKszdChqQnXDlVFT18g.jpeg"
                alt="Pain Relief Oil"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Pain Relief Oil</h4>
              <p className="text-sm text-muted-foreground">{"$20.00"}</p>
            </div>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Concrete_Candles%5B1%5D.JPG-tJRWLpPssq5xtfSrv2DBK3nC2CRugO.jpeg"
                alt="Concrete Candles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Concrete Candles</h4>
              <p className="text-sm text-muted-foreground">{"From $15.00"}</p>
            </div>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="aspect-square overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250912_185335%5B1%5D.JPG-juAZNKXLXO2c1B5pMQNDrRYMEs2EZB.jpeg"
                alt="Body Sprays"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-1">Body Sprays</h4>
              <p className="text-sm text-muted-foreground">{"From $6.00"}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
