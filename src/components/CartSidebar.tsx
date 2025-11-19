import React from "react";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface Props {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number | "ALL") => void;
}

export default function CartSidebar({
  isOpen,
  cartItems,
  onClose,
  onCheckout,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-cart" onClick={onClose}>✕</button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Your cart is empty.</p>
        )}

        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.name} />
            </div>

            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">
                ₦{item.price.toLocaleString()} × {item.quantity}
              </div>

              <div className="cart-quantity-controls" style={{ marginTop: 8 }}>
                <button onClick={() => onDecrease(item.id)}>-</button>
                <span style={{ padding: "0 8px" }}>{item.quantity}</span>
                <button onClick={() => onIncrease(item.id)}>+</button>
              </div>

              <button className="remove-btn" onClick={() => onRemove(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>

        <button
          className="cancel-cart-btn"
          onClick={() => {
            onRemove("ALL");
            onClose();
          }}
        >
          Cancel Cart
        </button>

        <button className="checkout-btn" onClick={onCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}
