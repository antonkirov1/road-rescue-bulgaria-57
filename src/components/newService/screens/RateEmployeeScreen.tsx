
import React, { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';

interface RateEmployeeScreenProps {
  request: ServiceRequest;
  onRate: (rating: number) => void;
}

const RateEmployeeScreen: React.FC<RateEmployeeScreenProps> = ({
  request,
  onRate
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Rate Your Service
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h4 className="font-medium mb-2">How was your service?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Please rate your experience with {request.assignedEmployeeName}
            </p>
            
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full"
        >
          Submit Rating
        </Button>
      </div>
    </>
  );
};

export default RateEmployeeScreen;
