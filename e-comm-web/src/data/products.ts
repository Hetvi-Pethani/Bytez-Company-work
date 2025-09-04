import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    category: 'men',
    subCategory: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60',
    description: 'Premium cotton classic fit white t-shirt for everyday wear.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 79.99,
    category: 'men',
    subCategory: 'jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=60',
    description: 'Modern slim fit jeans in dark wash denim.',
    sizes: ['30x32', '32x32', '34x32', '36x32']
  },
  {
    id: '3',
    name: 'Floral Summer Dress',
    price: 89.99,
    category: 'women',
    subCategory: 'dresses',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=60',
    description: 'Beautiful floral print summer dress with adjustable straps.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: '4',
    name: 'High-Waisted Yoga Pants',
    price: 59.99,
    category: 'women',
    subCategory: 'activewear',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=60',
    description: 'Comfortable high-waisted yoga pants with pocket.',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '5',
    name: 'Casual Blazer',
    price: 129.99,
    category: 'men',
    subCategory: 'jackets',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60',
    description: 'Versatile casual blazer perfect for any occasion.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '6',
    name: 'Silk Blouse',
    price: 69.99,
    category: 'women',
    subCategory: 'tops',
    image: 'https://images.unsplash.com/photo-1604336732494-d8386c7029e3?w=800&auto=format&fit=crop&q=60',
    description: 'Elegant silk blouse with pearl buttons.',
    sizes: ['XS', 'S', 'M', 'L']
  }
]; 