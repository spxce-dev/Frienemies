import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Instagram, Facebook, Twitter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const FooterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/20 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:cursor-default"
      >
        <h3 
          className="text-white text-lg tracking-[0.15em] uppercase"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {title}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-white md:hidden transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:overflow-visible md:mt-4"
          >
            <div className="pb-4 md:pb-0 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await base44.entities.Newsletter.create({ email });
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe');
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-[#0EA5E9] pt-10 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-0 md:gap-8">
          <FooterSection title="About">
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Our Story</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Craftsmanship</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Sustainability</a>
          </FooterSection>

          <FooterSection title="Help">
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Contact Us</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Shipping & Returns</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Size Guide</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">FAQs</a>
          </FooterSection>

          <FooterSection title="More">
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Gift Cards</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Store Locator</a>
            <a href="#" className="block text-white/70 hover:text-white text-sm transition-colors">Press</a>
          </FooterSection>

          <div className="mt-6 md:mt-0">
            <h3 
              className="text-white text-lg tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Newsletter
            </h3>
            
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-white hover:opacity-70 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:opacity-70 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:opacity-70 transition-opacity">
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            <form onSubmit={handleSubscribe} className="flex border-b border-white/50">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your E-mail"
                className="flex-1 bg-transparent text-white placeholder-white/50 text-sm py-2 outline-none"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="text-white text-sm tracking-[0.1em] uppercase hover:opacity-70 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Logo & Copyright */}
        <div className="mt-12 text-center">
          <div className="mb-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69825c576ea90587a8aa211f/e909bd1fd_c5b21d22-5dbd-4e28-8366-706fbcbb0681.jpeg"
              alt="ICEDOUT Store"
              className="w-20 h-20 mx-auto rounded-full object-cover"
            />
          </div>
          <p className="text-white/50 text-sm">
            © 2026 ICEDOUT Official
          </p>
        </div>
      </div>
    </footer>
  );
}