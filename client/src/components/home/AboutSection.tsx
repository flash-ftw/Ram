import { Medal, Users, Globe, Package, Wrench, Settings, Award, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex items-center gap-16">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-500 rounded-lg"></div>
              <div 
                className="rounded-lg shadow-lg w-full h-80 bg-gray-800 relative z-10 flex items-center justify-center"
              >
                <div className="text-center text-gray-500">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg font-medium">Motorcycle Showroom</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-black py-2 px-4 rounded-lg font-bold z-20">
                Est. 2015
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="inline-block mb-6">
              <h2 className="text-4xl font-bold mb-2 moto-heading">The Rammeh MotoScoot Story</h2>
            </div>
            <p className="text-gray-300 mb-4 text-lg">
              Welcome to Rammeh MotoScoot, Tunisia's premier motorcycle showroom. Founded in 2015 by motorcycle enthusiasts, 
              we've grown into the country's most trusted destination for high-performance bikes, quality accessories, and expert service.
            </p>
            <p className="text-gray-300 mb-4 text-lg">
              Our passion drives everything we do. We carefully select each motorcycle for its performance, reliability, and value. 
              Our team of certified technicians provides exceptional maintenance and customization services to keep your bike 
              running at its best.
            </p>
            <p className="text-gray-300 mb-6 text-lg">
              Visit our state-of-the-art showroom in Tunis or browse our online catalog to discover your perfect ride. At Rammeh MotoScoot, 
              we don't just sell motorcycles – we deliver dreams on two wheels.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Award className="mr-2" size={28} />
                  8+
                </div>
                <p className="text-gray-300">Years of Excellence</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Users className="mr-2" size={28} />
                  5K+
                </div>
                <p className="text-gray-300">Satisfied Riders</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Wrench className="mr-2" size={28} />
                  10K+
                </div>
                <p className="text-gray-300">Services Completed</p>
              </div>
              <div className="text-center bg-gray-900 p-5 rounded-lg border-l-4 border-yellow-500">
                <div className="text-yellow-500 text-3xl font-bold mb-2 flex justify-center">
                  <Settings className="mr-2" size={28} />
                  200+
                </div>
                <p className="text-gray-300">Models Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
