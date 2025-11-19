export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;   // <-- updated from emoji → image
  badge?: string;
};

export const products: Product[] = [
  { id: 1,  name: 'Lavender Dreams Soap',        category: 'soaps',   price: 12.99, image: '/products/Bath_scrub.jpeg', badge: 'Bestseller' },
  { id: 2,  name: 'Rose Petal Body Cream',       category: 'creams',  price: 24.99, image: '/products/Body_Cream.jpg', badge: 'New' },
  { id: 3,  name: 'Eucalyptus Mint Candle',      category: 'candles', price: 32.99, image: '/products/Concrete_Candles.jpeg' },
  { id: 4,  name: 'Cedarwood Beard Oil',         category: 'beard',   price: 18.99, image: '/products/Beard_Products.jpg' },
  { id: 5,  name: 'Muscle Relief Balm',          category: 'relief',  price: 22.99, image: '/products/Relief_Products.jpeg', badge: 'Popular' },
  { id: 6,  name: 'Vanilla Amber Body Spray',    category: 'sprays',  price: 16.99, image: '/products/Oil.jpeg' },
  { id: 7,  name: 'Honey Oat Soap Bar',          category: 'soaps',   price: 11.99, image: '/products/soap.jpg' },
  { id: 8,  name: 'Shea Butter Body Cream',      category: 'creams',  price: 26.99, image: '/products/Body_Cream.jpg', badge: 'Bestseller' },
  { id: 9,  name: 'Sandalwood Concrete Candle',  category: 'candles', price: 34.99, image: '/products/Concrete_Candles.jpeg', badge: 'New' },
  { id: 10, name: 'Beard Grooming Kit',          category: 'beard',   price: 45.99, image: '/products/Beard_Products.jpg' },
  { id: 11, name: 'Arnica Relief Cream',         category: 'relief',  price: 28.99, image: '/products/Relief_Products.jpeg' },
  { id: 12, name: 'Jasmine Body Oil',            category: 'sprays',  price: 19.99, image: '/products/oil.jpeg', badge: 'Popular' }
];
