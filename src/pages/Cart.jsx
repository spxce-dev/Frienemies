import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Cart() {
  return (
    <div className="bg-[#F0F9FF] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg p-12 shadow-sm">
          <div className="w-20 h-20 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#0EA5E9]" />
          </div>
          
          <h1 
            className="text-2xl md:text-3xl text-[#0EA5E9] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Cart is Empty
          </h1>
          
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>

          <Link to={createPageUrl('Products')}>
            <Button className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-8 py-6 text-base tracking-wide">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}