import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/82370db00_IMG_6726.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-wide mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Love, Set in Diamonds
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white/90 text-lg md:text-xl max-w-md mx-auto mb-2 font-light tracking-wide"
        >
          Celebrate your story with the perfect Valentine's gift,
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-white/90 text-lg md:text-xl max-w-md mx-auto mb-8 font-light tracking-wide"
        >
          plus a free gift on $200+.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link 
            to={createPageUrl('Products')}
            className="text-white text-sm tracking-[0.2em] uppercase border-b-2 border-white pb-1 hover:opacity-80 transition-opacity"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}