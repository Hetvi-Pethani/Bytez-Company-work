'use client';

import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-xl text-gray-900">${product.price}</p>
          
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-gray-500">{product.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-900">Size</h2>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`border rounded-md py-2 px-3 text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 text-base font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 