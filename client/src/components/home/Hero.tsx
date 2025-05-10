import { Link } from "wouter";
import { Bike, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-black text-white">
      {/* Overlay with yellow gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-yellow-900 opacity-80"></div>
      <div 
        className="relative h-[600px] bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590810546139-08fe453e467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center mb-4">
              <Bike className="w-10 h-10 text-yellow-500 mr-2" />
              <span className="text-xl font-semibold text-yellow-500">PREMIUM SELECTION</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">Experience the</span> <span className="text-yellow-500">Thrill</span> <span className="text-white">of the Ride</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Tunisia's premier destination for high-performance motorcycles, quality accessories, protective gear, and expert service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 rounded-md shadow-lg transition-transform hover:scale-105">
                <Link href="#featured" className="flex items-center">
                  Explore Bikes <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-8 py-6 rounded-md transition-all">
                <Link href="/about">
                  About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
