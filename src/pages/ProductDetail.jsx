import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Heart, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      return products[0];
    },
    enabled: !!productId
  });

  if (isLoading) {
    return (
      <div className="bg-[#F0F9FF] min-h-screen p-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#F0F9FF] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-[#0EA5E9] mb-4">Product not found</h1>
          <Link to={createPageUrl('Home')} className="text-[#0EA5E9] underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F9FF] min-h-screen">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {/* Back Button */}
        <Link 
          to={createPageUrl('Products') + `?category=${product.category}`}
          className="inline-flex items-center text-[#0EA5E9] mb-6 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to {product.category}</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-sm aspect-square flex items-center justify-center p-8"
          >
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {product.is_best_seller && (
              <span className="inline-block bg-[#0EA5E9] text-white text-xs px-3 py-1 mb-4 w-fit">
                Best Seller
              </span>
            )}

            <h1 
              className="text-3xl md:text-4xl text-[#0EA5E9] mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p className="text-gray-600 mb-4">
                {product.description}
              </p>
            )}

            <p className="text-2xl text-[#0EA5E9] font-medium mb-8">
              {product.price_from && <span className="font-normal text-lg">from </span>}
              ${product.price?.toLocaleString()}
            </p>

            <div className="space-y-4 mt-auto">
              <Button 
                className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white py-6 text-base tracking-wide"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Bag
              </Button>

              <Button 
                variant="outline"
                className="w-full border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white py-6 text-base tracking-wide"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#0EA5E9] mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $200</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#0EA5E9] mb-1">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}