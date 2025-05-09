import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="relative h-[500px] bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Premium Quality Products for Your Space
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover our curated collection of high-quality products that combine style, functionality, and craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6">
                <Link href="#featured">
                  Explore Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6">
                <Link href="/about">
                  Learn More
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
