import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import BestSellers from '../components/home/BestSellers';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <BestSellers />
    </div>
  );
}