import { Heart, MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import FilterModal, { ToursFilterState } from './filterModel';

interface NavbarProps {
  onFiltersApply: (filters: ToursFilterState, filterType: 'tours' | 'rents') => void;
  activeFilterType: 'tours' | 'rents';
}

export const Navbar: React.FC<NavbarProps> = ({ onFiltersApply, activeFilterType }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleApplyFilters = (filters: ToursFilterState, filterType: 'tours' | 'rents') => {
    onFiltersApply(filters, filterType);
    setIsFilterOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button 
                onClick={handleFilterOpen} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-transparent bg-clip-text">
                TourApp
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={activeFilterType === 'tours' ? "Search tours..." : "Search rentals..."}
                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="h-6 w-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                </button>
                <button className="ml-2 flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline font-medium">Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        onApplyFilters={(filters, filterType) => handleApplyFilters(filters, filterType)}

        activeFilterType={activeFilterType}
      />
    </>
  );
};