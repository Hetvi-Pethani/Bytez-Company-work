export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women';
  subCategory: string;
  image: string;
  description: string;
  sizes: string[];
};

export type CartItem = Product & {
  quantity: number;
  selectedSize: string;
}; 