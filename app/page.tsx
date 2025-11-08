import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProductCategories } from "@/components/product-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
