import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProductCard from '../components/products/ProductCard';
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => category 
      ? base44.entities.Product.filter({ category }, '-created_date', 50)
      : base44.entities.Product.list('-created_date', 50),
    initialData: []
  });

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Products';

  return (
    <div className="bg-[#F0F9FF] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 
          className="text-center text-3xl md:text-4xl text-[#0EA5E9] mb-10 tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {categoryTitle}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full bg-white" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}