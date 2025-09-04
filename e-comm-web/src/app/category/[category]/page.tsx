import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { notFound } from 'next/navigation';

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;
  
  if (!['men', 'women', 'all'].includes(category)) {
    notFound();
  }

  const filteredProducts = category === 'all'
    ? products
    : products.filter((product) => product.category === category);

  const categoryTitle = category === 'all'
    ? 'All Products'
    : `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryTitle}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products found in this category.
        </p>
      )}
    </div>
  );
} 