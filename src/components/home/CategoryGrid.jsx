import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const categories = [
  {
    name: 'Watches',
    slug: 'watches',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/0f0dfe30c_c5190f96-adc4-4503-8d1f-d328c4633430.jpeg'
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/4298b61ed_d5a2120b-3529-4732-93f4-dee1d75116e4.jpeg'
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/83e9fc5d1_6c432e2d-7115-4b8b-881e-accd9545caf5.jpeg'
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/ec93f8a16_b536a7e8-68a7-49af-86c9-1eeb1e56314b.jpeg'
  }
];

export default function CategoryGrid() {
  return (
    <div className="bg-[#F0F9FF] py-2">
      <div className="grid grid-cols-2 gap-2 px-2">
        {categories.map((category, index) => (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              to={createPageUrl('Products') + `?category=${category.slug}`}
              className="block bg-white rounded-sm overflow-hidden group"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 
                className="text-center py-4 text-lg tracking-wide text-[#0EA5E9]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {category.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}