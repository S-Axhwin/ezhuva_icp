import React from "react";
import { Button } from "../components/ui/button";
import { Twitter, Facebook, Instagram } from "lucide-react";

const ParaPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex  items-center justify-center relative ">
      {/* Logo */}
      
      {/* Social Media Box */}
      <div className="bg-[#f95841] text-black p-8 rounded-2xl grid place-items-center shadow-lg text-center h-96 max-w-4xl">
        <h2 className="text-7xl font-bold flex flex-wrap justify-center gap-2">
          Follow us on 
          <span className="inline">
          X<Twitter   className="inline mb-2" />,
          </span>
          <span className="inline">
          Insta<Instagram className="inline mb-2" />,
          </span>
          <span className="inline">
          Facebook<Facebook className="inline mb-2" />
          </span>
        </h2>
        <p className="mt-2 text-lg">You can always write us if you have any questions.</p>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 flex space-x-4 text-gray-400">
        <Button variant="ghost" className="text-sm">Terms of Service</Button>
        <Button variant="ghost" className="text-sm">Privacy Policy</Button>
        <Button variant="ghost" className="text-sm">Support</Button>
      </div>
    </div>
  );
};

export default ParaPage;