import { useState } from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import type { Tour } from '@/type';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={tour.imageUrl} 
          alt={tour.title} 
          className={`w-full h-56 object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {tour.discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {tour.discount}% OFF
          </div>
        )}
        
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-sm">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-medium">{tour.rating}</span>
          </div>
          <span className="text-gray-500 text-sm">({tour.reviews} reviews)</span>
        </div>
        
        <h3 className="font-bold text-xl mb-2 line-clamp-2 hover:text-primary-500 cursor-pointer">
          {tour.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{tour.location}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{tour.duration}</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between pt-3 border-t">
          <div>
            {tour.discount && (
              <span className="text-gray-400 line-through text-sm block">
                TL {tour.originalPrice.toLocaleString()}
              </span>
            )}
            <div className="text-2xl font-bold text-primary-600">
              TL {tour.price.toLocaleString()}
            </div>
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}