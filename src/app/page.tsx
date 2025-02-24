'use client'

import { useState, useEffect } from 'react';
import type { Tour } from '@/type';
import toursData from '@/data/tours.json'; 
import { Navbar } from '@/component/navBar';
import TourCard from '@/component/tourCard';
import { ToursFilterState } from '@/component/filterModel';

export interface Rent extends Tour {}

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [rents, setRents] = useState<Rent[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [filteredRents, setFilteredRents] = useState<Rent[]>([]);
  const [currentFilters, setCurrentFilters] = useState<ToursFilterState>({
    theme: [],
    activity: [],
    price: 5000,
    startTime: "17:00",
    groupSize: 40,
    vehicle: [],
    features: [],
    location: "", 
  });
  const [activeFilterType, setActiveFilterType] = useState<'tours' | 'rents' | 'all'>('all');

  useEffect(() => {
    setTours(toursData.tours); 
    setFilteredTours(toursData.tours);
    setRents(toursData.rents);
    setFilteredRents(toursData.rents);
  }, []);

  const applyTourFilters = (filters: ToursFilterState) => {
    setCurrentFilters(filters);
    setActiveFilterType('tours');

    let filtered = tours.filter(tour => {
      if (tour.price > filters.price) return false;

      const tourStartTime = parseInt(tour.startTime.split(':')[0]);
      const filterHour = parseInt(filters.startTime.split(':')[0]);
      if (tourStartTime > filterHour) return false;

      if (tour.groupSize > filters.groupSize) return false;

      if (filters.theme.length > 0) {
        if (!filters.theme.some(filterTheme => {
          const regex = new RegExp(`\\b${filterTheme.trim().toLowerCase()}\\b`, 'i');
          return regex.test(tour.theme.toLowerCase());
        })) return false;
      }

      if (filters.activity.length > 0) {
        const tourActivities = tour.activity.map(a => a.toLowerCase());
        if (!filters.activity.some(activity => 
          tourActivities.some(tourActivity => tourActivity.includes(activity.toLowerCase()))
        )) return false;
      }

      if (filters.vehicle.length > 0) {
        const tourVehicle = tour.vehicle.toLowerCase();
        if (!filters.vehicle.some(vehicle => tourVehicle.includes(vehicle.toLowerCase()))) return false;
      }

      if (filters.features.length > 0) {
        const tourFeatures = tour.features.map(f => f.toLowerCase());
        if (!filters.features.some(feature => 
          tourFeatures.some(tourFeature => tourFeature.includes(feature.toLowerCase()))
        )) return false;
      }

      return true;
    });

    setFilteredTours(filtered);
  };

  const applyRentFilters = (filters: ToursFilterState) => {
    setCurrentFilters(filters);
    setActiveFilterType('rents');

    let filtered = rents.filter(rent => {
      if (rent.price > filters.price) return false;

      if (rent.startTime.includes(':')) {
        const rentStartTime = parseInt(rent.startTime.split(':')[0]);
        const filterHour = parseInt(filters.startTime.split(':')[0]);
        if (rentStartTime > filterHour) return false;
      }

      if (rent.groupSize > filters.groupSize) return false;

      if (filters.theme.length > 0) {
        if (!filters.theme.some(filterTheme => {
          const regex = new RegExp(`\\b${filterTheme.trim().toLowerCase()}\\b`, 'i');
          return regex.test(rent.theme.toLowerCase());
        })) return false;
      }

      if (filters.activity.length > 0) {
        const rentActivities = rent.activity.map(a => a.toLowerCase());
        if (!filters.activity.some(activity => 
          rentActivities.some(rentActivity => rentActivity.includes(activity.toLowerCase()))
        )) return false;
      }

      if (filters.vehicle.length > 0) {
        const rentVehicle = rent.vehicle.toLowerCase();
        if (!filters.vehicle.some(vehicle => rentVehicle.includes(vehicle.toLowerCase()))) return false;
      }

      if (filters.features.length > 0) {
        const rentFeatures = rent.features.map(f => f.toLowerCase());
        if (!filters.features.some(feature => 
          rentFeatures.some(rentFeature => rentFeature.includes(feature.toLowerCase()))
        )) return false;
      }

      return true;
    });

    setFilteredRents(filtered);
  };

  const applyFilters = (filters: ToursFilterState, filterType?: 'tours' | 'rents') => {
  console.log("applyFilters Called:", filters, "Filter Type:", filterType);

  if (filterType === 'tours') {
    applyTourFilters(filters);
    setActiveFilterType('tours'); 
  } else if (filterType === 'rents') {
    applyRentFilters(filters);
    setActiveFilterType('rents'); 
  } else {
    setActiveFilterType('all');
    applyTourFilters(filters);
    applyRentFilters(filters);
  }
};

  return (
    <main className="min-h-screen bg-orange">
      <Navbar onFiltersApply={applyFilters} activeFilterType={activeFilterType} />

      
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
        
        {activeFilterType !== 'rents' && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {filteredTours.length > 0 ? 'Available Tours' : 'No tours found'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}

        
        {activeFilterType !== 'tours' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {filteredRents.length > 0 ? 'Available Rentals' : 'No rentals found'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRents.map(rent => (
                <TourCard key={rent.id} tour={rent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
