import React from "react";
import { ChefHat, Award, Star, Sparkles } from "lucide-react";

export default function ChefSection() {
  return (
    <section className="relative bg-white mt-10 py-20 px-6 overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-orange-100 rounded-full opacity-40 animate-float"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-amber-100 rounded-full opacity-30 animate-float-delayed"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-orange-50 rounded-full opacity-50 animate-float-slow"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Chef Image with Animation */}
          <div className="relative group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

            {/* Floating icons */}
            <div className="absolute -top-6 -right-6 bg-white p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110">
              <ChefHat className="w-8 h-8 text-orange-500" />
            </div>
            <div className="absolute bottom-10 -left-6 bg-white p-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110">
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            {/* Chef Image Container */}
            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-700 ease-out">
              <div className="relative">
                {/* Chef Image */}
                <div className="relative rounded-3xl overflow-hidden h-[500px]">
                  <img
                    src="chef.png"
                    alt="Professional Chef"
                    className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            <div className="inline-block animate-fade-in">
              <span className="text-orange-500 font-semibold text-sm tracking-widest uppercase bg-orange-100 px-4 py-2 rounded-full">
                Meet Our Chefs
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight animate-slide-up">
              Masters of <span className="text-orange-500">Culinary</span>{" "}
              Excellence
            </h2>

            <div className="flex items-center gap-4 text-gray-600 animate-slide-up">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="font-semibold">Expert Culinary Team</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed animate-slide-up">
              Our talented team of professional chefs brings decades of combined
              experience in fine dining. Trained in prestigious culinary
              institutes worldwide, they craft each meal with passion,
              precision, and authentic flavors that tell a story.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2 p-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Expert Team</h3>
                </div>
                <p className="text-gray-600 text-sm">Certified Professionals</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Fresh Daily</h3>
                </div>
                <p className="text-gray-600 text-sm">Quality Ingredients</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Authentic</h3>
                </div>
                <p className="text-gray-600 text-sm">Traditional Recipes</p>
              </div>

              <div className="space-y-2 p-4 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Innovative</h3>
                </div>
                <p className="text-gray-600 text-sm">Modern Techniques</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
