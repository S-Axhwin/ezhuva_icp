import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';


const Navbar = ({ className }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-8 lg:px-12 transition-all duration-300 ease-out animate-fade-in", 
        scrolled ? "bg-para-black/90 backdrop-blur-md shadow-md" : "bg-transparent", 
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-white text-2xl font-bold tracking-tighter">
            EZHUVA
          </a>
        </div>
        
        <div className="flex items-center space-x-6">
          <a 
            href="/auth" 
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-5 py-2 rounded-full transition-colors"
          >
            Start
          </a>
          <>
          <ModeToggle/>
          </>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;