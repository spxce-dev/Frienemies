import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`}>
        <div className="relative bg-[#E0F2FE] aspect-square overflow-hidden mb-2 rounded-sm">
          {product.is_best_seller && (
            <span className="absolute top-3 left-3 bg-[#0EA5E9] text-white text-xs px-3 py-1.5 z-10 tracking-wide">
              Best Sellers
            </span>
          )}
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        <div className="text-center px-2">
          <h3 
            className="text-[#0EA5E9] text-base md:text-lg mb-1 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-500 text-xs md:text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <p className="text-[#0EA5E9] text-sm font-medium">
            {product.price_from && <span className="font-normal">from </span>}
            ${product.price?.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}