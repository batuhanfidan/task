'use client'

import { useState, useEffect } from 'react';
import type { Tour } from '@/type';
import toursData from '@/data/tours.json'; 
import { Navbar } from '@/component/navBar';
import TourCard from '@/component/tourCard';
import { ToursFilterState } from '@/component/filterModel';

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [currentFilters, setCurrentFilters] = useState<ToursFilterState>({
    theme: [],
    activity: [],
    price: 5000,
    startTime: "17:00",
    groupSize: 40,
    vehicle: [],
    features: []
  });

  useEffect(() => {
    setTours(toursData.tours); 
    setFilteredTours(toursData.tours); 
  }, []);

  const applyFilters = (filters: ToursFilterState) => {
    setCurrentFilters(filters);
    
    let filtered = tours.filter(tour => {

      if (tour.price > filters.price) {
        return false;
      }

      const tourStartTime = parseInt(tour.startTime.split(':')[0]);
      const filterHour = parseInt(filters.startTime.split(':')[0]);
      if (tourStartTime > filterHour) {
        return false;
      }

      if (tour.groupSize > filters.groupSize) {
        return false;
      }


      if (filters.theme.length > 0) {
        if (!filters.theme.some(filterTheme => {
          const regex = new RegExp(`\\b${filterTheme.trim().toLowerCase()}\\b`, 'i');
          return regex.test(tour.theme.toLowerCase());
        })) {
          return false;
        }
      }
      

      if (filters.activity.length > 0) {
        const tourActivities = tour.activity.map(a => a.toLowerCase());
        if (!filters.activity.some(activity => 
          tourActivities.some(tourActivity => tourActivity.includes(activity.toLowerCase()))
        )) {
          return false;
        }
      }

      
      if (filters.vehicle.length > 0) {
        const tourVehicle = tour.vehicle.toLowerCase();
        if (!filters.vehicle.some(vehicle => tourVehicle.includes(vehicle.toLowerCase()))) {
          return false;
        }
      }


      if (filters.features.length > 0) {
        const tourFeatures = tour.features.map(f => f.toLowerCase());
        if (!filters.features.some(feature => 
          tourFeatures.some(tourFeature => tourFeature.includes(feature.toLowerCase()))
        )) {
          return false;
        }
      }

      return true;
    });

    setFilteredTours(filtered);
  };

  return (
    <main className="min-h-screen bg-orange">
      <Navbar onFiltersApply={applyFilters} />
      
      <div className="bg-gradient-to-r from-primary-400 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Places
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Find and book the best tours, activities and attractions around World
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {filteredTours.length > 0 ? 'Available Tours' : 'No tours found'}
          </h2>
          <div className="text-sm text-gray-600">
            {filteredTours.length} tours found
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </main>
  );
}