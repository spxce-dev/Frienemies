import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProductCard from '../products/ProductCard';
import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellers() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['bestSellers'],
    queryFn: () => base44.entities.Product.filter({ is_best_seller: true }, '-created_date', 6),
    initialData: []
  });

  return (
    <div className="bg-[#F0F9FF] py-12 px-4">
      <h2 
        className="text-center text-2xl md:text-3xl text-[#0EA5E9] mb-10 tracking-wide"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Best Sellers
      </h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))
        ) : (
          products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        )}
      </div>
    </div>
  );
}