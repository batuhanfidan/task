export interface Tour {
    id: number;
    title: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: number;
    imageUrl: string;
    duration: string;
    description: string;
    activity: string[];
    languages: string[];
    theme: string;
    startTime: string;
    groupSize: number;
    vehicle: string;
    features: string[];
  }