import { Medal, Users, Globe, Package } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex items-center gap-12">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Our Showroom" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">About Our Showroom</h2>
            <p className="text-gray-600 mb-4">
              Welcome to ModernShowroom, where we believe that exceptional products should be accessible to everyone. 
              Established in 2010, we've been curating high-quality furniture, lighting, electronics, and home decor 
              items from around the world.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to provide our customers with products that combine innovative design, exceptional 
              craftsmanship, and sustainable production practices. We work directly with designers and manufacturers 
              to ensure every product meets our rigorous standards.
            </p>
            <p className="text-gray-600 mb-6">
              Visit our physical showroom locations or browse our extensive online catalog to discover pieces that 
              will transform your space and reflect your unique style.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <div className="text-primary text-3xl font-bold mb-2 flex justify-center">
                  <Medal className="mr-2" size={28} />
                  10+
                </div>
                <p className="text-gray-600">Years of Experience</p>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold mb-2 flex justify-center">
                  <Users className="mr-2" size={28} />
                  50K+
                </div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold mb-2 flex justify-center">
                  <Globe className="mr-2" size={28} />
                  25+
                </div>
                <p className="text-gray-600">Countries Served</p>
              </div>
              <div className="text-center">
                <div className="text-primary text-3xl font-bold mb-2 flex justify-center">
                  <Package className="mr-2" size={28} />
                  5K+
                </div>
                <p className="text-gray-600">Products Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
