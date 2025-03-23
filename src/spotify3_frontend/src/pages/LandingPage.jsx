import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { cn } from '@/lib/utils';
import ParaPage from '../components/ParaPage';


import { Link } from 'react-router-dom';


const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Set loaded after a short delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  return <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      <main className="relative pt-20">
        {/* Original Section */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
          <div className="container mx-auto">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            
              <h1 className={cn("text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight transition-all", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
              animationDelay: "200ms"
            }}>
                A brand new way 
                <br /> 
                to monitor uptime effortlessly!
              </h1>
              
              <Link to={`/login`} className={cn("px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xl transition-all shadow-lg", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
              animationDelay: "600ms"
            }}>
                Start monitoring
              </Link>
            </div>
          </div>
          
          {/* Background gradient effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full aspect-square bg-para-green/10 rounded-full blur-[100px] opacity-30 animate-pulse-light" />
            <div className="absolute -top-1/4 -right-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-1/3 -left-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
          </div>
        </section>
        
        {/* New Colored Sections */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12">
          <div className="container mx-auto max-w-5xl space-y-6">
            {/* Green Section */}
            <div className={cn("bg-[#bbff55] text-black p-8 md:p-12 rounded-3xl transition-all", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
            animationDelay: "200ms"
          }}>
              <h1 className="text-2xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Ezhuva is the easiest way to monitor uptime.
              </h1>
            </div>


            <div className="text-center my-12 py-8">
              <h2 className="text-3xl md:text-7xl font-extrabold text-white relative lg:text-5xl">
                EZHUVA X <span className="worker-glow">WORKER</span>
              </h2>
            </div>
            
            {/* Pink Section */}
            <div className={cn("bg-[#ffb6f0] text-black p-8 md:p-12 rounded-3xl transition-all", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
            animationDelay: "400ms"
          }}>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold leading-tight mb-8">
              Turn Your Compute into Cash<br /> Join Ezhuva X Worker and Get Paid!
              </h2>
              
              <a href="/worker" className={cn("block w-full bg-black text-white text-center text-xl md:text-2xl font-semibold py-4 rounded-full hover:bg-gray-900 transition-colors", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
              animationDelay: "600ms"
            }}>
                Start earning
              </a>
            </div>
          </div>
          <div>
            <ParaPage/>
          </div>
          {/* Background gradient effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full aspect-square bg-para-green/10 rounded-full blur-[100px] opacity-30 animate-pulse-light" />
            <div className="absolute -top-1/4 -right-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-1/3 -left-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
          </div>
        </section>
      </main>
    </div>;
};
export default LandingPage;