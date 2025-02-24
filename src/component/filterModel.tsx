import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ToursFilterState {
  theme: string[];
  activity: string[];
  price: number;
  startTime: string;
  groupSize: number;
  vehicle: string[];
  features: string[];
  location: string;  
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ToursFilterState, filterType: 'tours' | 'rents' | 'ticket' | 'transfer') => void;
  activeFilterType: 'tours' | 'rents' | 'ticket' | 'transfer';
  toursData?: any[];
  rentsData?: any[];
}

interface FilterItem {
  id: string;
  label: string;
  count: number;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  activeFilterType,
  toursData = [],
  rentsData = []
}) => {
  const [filterType, setFilterType] = useState<'tours' | 'rents' | 'ticket' | 'transfer'>(activeFilterType);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [startTime, setStartTime] = useState<string>("17:00");
  const [groupSize, setGroupSize] = useState<number>(40);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);

  
  const isToursLike = (type: string) => type === 'tours' || type === 'ticket';
  const isRentsLike = (type: string) => type === 'rents' || type === 'transfer';

  
  const tourLocations = [
    "Krabi Pier",
    "Bangkok City Center",
    "Phuket Elephant Sanctuary",
    "Khao Lak",
    "Phuket Marina",
    "Rassada Pier, Phuket"
  ];

  const rentLocations = [
    "Malé, Maldives",
    "Palawan, Philippines",
    "Ubud, Bali",
    "Ari Atoll, Maldives",
    "Cebu, Philippines",
    "Tanah Lot, Bali"
  ];

  
  const activeLocations = isToursLike(filterType) ? tourLocations : rentLocations;

  
  const filteredLocations = location
    ? activeLocations.filter(loc => loc.toLowerCase().includes(location.toLowerCase()))
    : activeLocations;

  
  useEffect(() => {
    setFilterType(activeFilterType);
  }, [activeFilterType]);

  
  const handleSearchFocus = () => {
    setShowLocationDropdown(true);
  };

  
  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

  
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  const generateFilterItems = (data: any[], field: string): FilterItem[] => {
    if (!data || data.length === 0) return [];
    
    const countMap = new Map<string, number>();
    
    
    data.forEach(item => {
      const values = Array.isArray(item[field]) ? item[field] : [item[field]];
      values.forEach(value => {
        if (value) {
          const count = countMap.get(value.toString().toLowerCase()) || 0;
          countMap.set(value.toString().toLowerCase(), count + 1);
        }
      });
    });
    
    
    return Array.from(countMap.entries()).map(([id, count]) => ({
      id: id,
      label: id.charAt(0).toUpperCase() + id.slice(1), 
      count
    }));
  };

  
  const tourThemes = toursData.length ? generateFilterItems(toursData, 'theme') : [
    { id: 'island tour', label: 'Island Tour', count: 4 },
    { id: 'land', label: 'Land tour', count: 1 },
    { id: 'safari', label: 'Safari', count: 1 },
  ];

  const tourActivities = toursData.length ? generateFilterItems(toursData, 'activity') : [
    { id: 'swimming', label: 'Swimming', count: 4 },
    { id: 'running', label: 'Running', count: 1 },
    { id: 'elephant', label: 'Elephant care', count: 1 },
    { id: 'snorkelling', label: 'Snorkelling', count: 2 },
  ];

  const tourVehicles = toursData.length ? generateFilterItems(toursData, 'vehicle') : [
    { id: 'yacht', label: 'Yacht', count: 0 },
    { id: 'speedboat', label: 'Speedboat', count: 2 },
    { id: 'safari', label: 'Safari', count: 2 },
    { id: 'catamaran', label: 'Catamaran', count: 2 },
    { id: 'speedcatamaran', label: 'Speedcatamaran', count: 1 },
  ];

  const tourFeatures = toursData.length ? generateFilterItems(toursData, 'features') : [
    { id: 'transfer', label: 'Transfer', count: 6 },
    { id: 'halal', label: 'Halal Food', count: 4 },
    { id: 'vegetarian', label: 'Vegetarian food', count: 4 },
  ];

  const rentThemes = rentsData.length ? generateFilterItems(rentsData, 'theme') : [
    { id: 'luxury beach', label: 'Luxury Beach', count: 1 },
    { id: 'island tour', label: 'Island Tour', count: 1 },
    { id: 'cultural & nature', label: 'Cultural & Nature', count: 1 },
    { id: 'adventure', label: 'Adventure', count: 1 },
    { id: 'adventure & wildlife', label: 'Adventure & Wildlife', count: 1 },
    { id: 'cultural & scenic', label: 'Cultural & Scenic', count: 1 },
  ];

  const rentActivities = rentsData.length ? generateFilterItems(rentsData, 'activity') : [
    { id: 'snorkelling', label: 'Snorkelling', count: 3 },
    { id: 'swimming', label: 'Swimming', count: 3 },
    { id: 'sunset dinner', label: 'Sunset Dinner', count: 1 },
    { id: 'kayaking', label: 'Kayaking', count: 1 },
    { id: 'cultural tour', label: 'Cultural Tour', count: 1 },
    { id: 'sightseeing', label: 'Sightseeing', count: 2 },
    { id: 'scuba diving', label: 'Scuba Diving', count: 1 },
    { id: 'waterfall trekking', label: 'Waterfall Trekking', count: 1 },
    { id: 'photography', label: 'Photography', count: 1 },
  ];

  const rentVehicles = rentsData.length ? generateFilterItems(rentsData, 'vehicle') : [
    { id: 'seaplane', label: 'Seaplane', count: 1 },
    { id: 'speedboat', label: 'Speedboat', count: 2 },
    { id: 'private car', label: 'Private Car', count: 2 },
    { id: 'private van', label: 'Private Van', count: 1 },
  ];

  const rentFeatures = rentsData.length ? generateFilterItems(rentsData, 'features') : [
    { id: 'all inclusive', label: 'All Inclusive', count: 1 },
    { id: 'private pool', label: 'Private Pool', count: 1 },
    { id: 'transfer', label: 'Transfer', count: 2 },
    { id: 'buffet lunch', label: 'Buffet Lunch', count: 1 },
    { id: 'local guide', label: 'Local Guide', count: 2 },
    { id: 'diving equipment', label: 'Diving Equipment', count: 1 },
    { id: 'instructor', label: 'Instructor', count: 1 },
    { id: 'lunch', label: 'Lunch', count: 1 },
    { id: 'entrance fees', label: 'Entrance Fees', count: 1 },
  ];

  const toggleItem = (item: FilterItem, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter(id => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const FilterSection: React.FC<{
    title: string;
    subtitle?: string;
    items: FilterItem[];
    selectedItems: string[];
    onToggle: (item: FilterItem) => void;
  }> = ({ title, subtitle, items, selectedItems, onToggle }) => (
    <div className="mb-6">
      <div className="mb-2">
        <h3 className="text-base font-medium">{title}</h3>
        {subtitle && <span className="text-gray-400 text-sm">{subtitle}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onToggle(item)}
            className={`px-3 py-1.5 rounded-full text-sm border
              ${selectedItems.includes(item.id)
                ? 'bg-orange-400 text-white border-orange-400'
                : 'bg-white border-gray-200 text-gray-700'
              }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>
    </div>
  );

  const SliderSection: React.FC<{
    title: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    formatValue?: (value: number) => string;
  }> = ({ title, value, min, max, onChange, formatValue }) => {
    const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onChange(newValue);
    }, [onChange]);

    return (
      <div className="mb-6">
        <h3 className="text-base font-medium mb-4">{title}</h3>
        <div className="px-2">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400 hover:accent-orange-500"
            style={{
              background: `linear-gradient(to right, #fb923c 0%, #fb923c ${(value - min) / (max - min) * 100}%, #e5e7eb ${(value - min) / (max - min) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{formatValue ? formatValue(min) : min}</span>
            <span>{formatValue ? formatValue(value) : value}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleReset = () => {
    setSelectedThemes([]);
    setSelectedActivities([]);
    setPriceRange(5000);
    setStartTime("17:00");
    setGroupSize(40);
    setSelectedVehicles([]);
    setSelectedFeatures([]);
    setLocation("");
  };

  const handleApply = () => {
    onApplyFilters({
      theme: selectedThemes,
      activity: selectedActivities,
      price: priceRange,
      startTime,
      groupSize,
      vehicle: selectedVehicles,
      features: selectedFeatures,
      location
    }, filterType);
    onClose();
  };

  
  const themes = isToursLike(filterType) ? tourThemes : rentThemes;
  const activities = isToursLike(filterType) ? tourActivities : rentActivities;
  const vehicles = isToursLike(filterType) ? tourVehicles : rentVehicles;
  const features = isToursLike(filterType) ? tourFeatures : rentFeatures;

  const switchFilterType = (type: 'tours' | 'rents' | 'ticket' | 'transfer') => {
    setFilterType(type);
    handleReset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-11/12 h-[85vh] rounded-lg shadow-lg flex flex-col">
        <div className="sticky top-0 bg-white border-b z-10 rounded-t-lg">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4 overflow-x-auto">
              <button 
                className={`font-medium whitespace-nowrap ${filterType === 'tours' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
                onClick={() => switchFilterType('tours')}
              >
                TOURS
              </button>
              <button 
                className={`font-medium whitespace-nowrap ${filterType === 'ticket' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
                onClick={() => switchFilterType('ticket')}
              >
                TICKET
              </button>
              <button 
                className={`font-medium whitespace-nowrap ${filterType === 'rents' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
                onClick={() => switchFilterType('rents')}
              >
                RENT
              </button>
              <button 
                className={`font-medium whitespace-nowrap ${filterType === 'transfer' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}
                onClick={() => switchFilterType('transfer')}
              >
                TRANSFER
              </button>
              <span className="text-gray-600 whitespace-nowrap">Filter</span>
            </div>
            <button onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 relative" ref={searchRef}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder={isToursLike(filterType) 
                ? "Where you wanna visit? (Pick the location...)" 
                : "Search for rentals (Location, type...)"}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
            />
            {showLocationDropdown && filteredLocations.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLocations.map((loc) => (
                  <div 
                    key={loc}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationSelect(loc)}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FilterSection
            title="Theme"
            items={themes}
            selectedItems={selectedThemes}
            onToggle={(item) => toggleItem(item, selectedThemes, setSelectedThemes)}
          />

          <FilterSection
            title="Activity"
            items={activities}
            selectedItems={selectedActivities}
            onToggle={(item) => toggleItem(item, selectedActivities, setSelectedActivities)}
          />

          <SliderSection
            title="Price"
            value={priceRange}
            min={0}
            max={5000}
            onChange={setPriceRange}
          />

          <SliderSection
            title={isToursLike(filterType) ? "Start time" : "Check-in time"}
            value={parseInt(startTime)}
            min={0}
            max={24}
            onChange={(value) => setStartTime(`${value}:00`)}
            formatValue={(value) => `${value.toString().padStart(2, '0')}:00`}
          />

          <SliderSection
            title="Group size"
            value={groupSize}
            min={1}
            max={40}
            onChange={setGroupSize}
          />

          <FilterSection
            title="Vehicle"
            items={vehicles}
            selectedItems={selectedVehicles}
            onToggle={(item) => toggleItem(item, selectedVehicles, setSelectedVehicles)}
          />

          <FilterSection
            title="Features"
            items={features}
            selectedItems={selectedFeatures}
            onToggle={(item) => toggleItem(item, selectedFeatures, setSelectedFeatures)}
          />
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 rounded-b-lg">
          <div className="flex gap-3">
            <button 
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 font-medium"
              onClick={handleReset}
            >
              RESET
            </button>
            <button 
              className="flex-1 px-4 py-3 rounded-lg bg-orange-400 text-white font-medium"
              onClick={handleApply}
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;