import React from 'react';
import { Product } from '../data/products';

type Props = {
  product: Product;
  onAdd: (id: number) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="product-card fade-in">
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">${product.price.toLocaleString()}</div>

        <button className="add-to-cart" onClick={() => onAdd(product.id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
