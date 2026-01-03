import React, { useState } from 'react';
import { Home, Calendar, Users, DollarSign, Star } from 'lucide-react';
import { agent } from '../agent/agent';
import type { ChecklistItem, UserContext } from '../types';

interface AgentInlineHotelProps {
  item: ChecklistItem;
  userContext: UserContext;
}

const AgentInlineHotel: React.FC<AgentInlineHotelProps> = ({ item, userContext }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleBookHotel = async () => {
    setLoading(true);
    try {
      const query = JSON.stringify({
        destination: userContext.destination,
        checkIn: '2024-02-01', // mock dates
        checkOut: '2024-02-07',
        guests: 2,
        budget: '$150/night',
        preferences: ['WiFi', 'Pool']
      });
      const res = await agent.runNow('book_accommodation', query, false);
      setResult(res);
    } catch (e) {
      setResult(`Error: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result: string) => {
    if (result.startsWith('ACCOMMODATION_BOOKED:')) {
      try {
        const data = JSON.parse(result.replace('ACCOMMODATION_BOOKED:', ''));
        return (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Home className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-800">Hotel Booked Successfully!</h4>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Booking ID:</strong> {data.bookingId}</p>
              <p><strong>Hotel:</strong> {data.selected.name}</p>
              <p><strong>Price:</strong> {data.selected.price}</p>
              <p><strong>Rating:</strong> {data.selected.rating}/5 ⭐</p>
              <p><strong>Amenities:</strong> {data.selected.amenities.join(', ')}</p>
              <p><strong>Check-in:</strong> Feb 1, 2024</p>
              <p><strong>Check-out:</strong> Feb 7, 2024</p>
            </div>
          </div>
        );
      } catch (e) {
        return <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{result}</p>
        </div>;
      }
    }
    return <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-blue-800">{result}</p>
    </div>;
  };

  // Only show for accommodation-related checklist items
  if (!item.title.toLowerCase().includes('accommodation') &&
      !item.title.toLowerCase().includes('hotel') &&
      !item.title.toLowerCase().includes('housing')) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Home className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-800">AI Hotel Assistant</span>
        </div>
        <button
          onClick={handleBookHotel}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : 'Book Hotel'}
        </button>
      </div>
      <p className="text-xs text-blue-700 mb-2">
        Let AI find and book accommodation for your relocation to {userContext.destination}
      </p>
      {result && renderResult(result)}
    </div>
  );
};

export default AgentInlineHotel;