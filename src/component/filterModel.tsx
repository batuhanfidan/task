import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ToursFilterState {
  theme: string[];
  activity: string[];
  price: number;
  startTime: string;
  groupSize: number;
  vehicle: string[];
  features: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ToursFilterState) => void;
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
}) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [startTime, setStartTime] = useState<string>("17:00");
  const [groupSize, setGroupSize] = useState<number>(40);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const themes: FilterItem[] = [
    { id: 'island tour', label: 'Island Tour', count: 3 },
    { id: 'land', label: 'Land tour', count: 2 },
    { id: 'safari', label: 'Safari', count: 1 },
  ];

  const activities: FilterItem[] = [
    { id: 'swimming', label: 'Swimming', count: 4 },
    { id: 'running', label: 'Running', count: 1 },
    { id: 'elephant', label: 'Elephant care', count: 1 },
    { id: 'snorkelling', label: 'Snorkelling', count: 2 },
  ];

  const vehicles: FilterItem[] = [
    { id: 'yacht', label: 'Yacht', count: 0 },
    { id: 'speedboat', label: 'Speedboat', count: 2 },
    { id: 'safari', label: 'Safari', count: 2 },
    { id: 'catamaran', label: 'Catamaran', count: 2 },
    { id: 'speedcatamaran', label: 'Speedcatamaran', count: 1 },
  ];

  const features: FilterItem[] = [
    { id: 'transfer', label: 'Transfer', count: 6 },
    { id: 'halal', label: 'Halal Food', count: 4 },
    { id: 'vegetarian', label: 'Vegetarian food', count: 4 },
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
  };

  const handleApply = () => {
    onApplyFilters({
      theme: selectedThemes,
      activity: selectedActivities,
      price: priceRange,
      startTime,
      groupSize,
      vehicle: selectedVehicles,
      features: selectedFeatures
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-11/12 h-[85vh] rounded-lg shadow-lg flex flex-col">
        <div className="sticky top-0 bg-white border-b z-10 rounded-t-lg">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-orange-500">TOURS</span>
              <button className="text-gray-600">Filter</button>
            </div>
            <button onClick={onClose} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Where you wanna visit? (Pick the island, Cruising remove...)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
            />
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
            title="Start time"
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