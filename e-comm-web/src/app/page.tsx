import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=2000&auto=format&fit=crop&q=60"
            alt="Fashion Banner"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            New Season Arrivals
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Discover the latest trends in fashion
          </p>
          <div className="mt-8">
            <Link
              href="/category/all"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md text-base font-medium hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/category/men"
            className="relative overflow-hidden rounded-lg aspect-[16/9] hover:opacity-90"
          >
            <Image
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=60"
              alt="Men's Collection"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-2xl font-bold text-white w-full text-center py-4">
                Men's Collection
              </h3>
            </div>
          </Link>
          <Link
            href="/category/women"
            className="relative overflow-hidden rounded-lg aspect-[16/9] hover:opacity-90"
          >
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60"
              alt="Women's Collection"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-2xl font-bold text-white w-full text-center py-4">
                Women's Collection
              </h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
