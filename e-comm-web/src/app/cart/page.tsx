'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="mt-8">
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Your cart is empty</div>
            <Link
              href="/category/all"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 text-base font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {items.map((item) => (
            <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 py-6 border-b">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <Link href={`/product/${item.id}`} className="hover:text-gray-600">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Size: {item.selectedSize}</p>
                
                <div className="flex items-center justify-between text-sm mt-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-sm font-medium text-gray-900">Free</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 text-base font-medium">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 