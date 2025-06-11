
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Eye } from "lucide-react";
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { useServiceRequestManager } from '@/hooks/useServiceRequestManager';

interface OngoingRequestCardProps {
  onViewDetails: () => void;
  onCallEmployee: () => void;
  onTrackLocation: () => void;
  onReviewQuote: () => void;
}

const OngoingRequestCard: React.FC<OngoingRequestCardProps> = ({
  onViewDetails,
  onCallEmployee,
  onTrackLocation,
  onReviewQuote
}) => {
  const { language } = useApp();
  const t = useTranslation(language);
  const { currentRequest } = useServiceRequestManager();

  if (!currentRequest) {
    return null;
  }

  // Get the appropriate status display text
  const getStatusDisplay = () => {
    switch (currentRequest.status) {
      case 'request_accepted':
        if (currentRequest.assignedEmployee) {
          return 'Technician assigned';
        }
        return 'Finding technician...';
      case 'quote_received':
        return 'Quote received - Action required';
      case 'quote_declined':
        return 'Finding alternative...';
      case 'quote_accepted':
        return 'Technician on the way';
      case 'in_progress':
        return 'Service in progress';
      case 'completed':
        return 'Service completed';
      case 'cancelled':
        return 'Request cancelled';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (currentRequest.status) {
      case 'request_accepted':
      case 'quote_declined':
        return 'text-yellow-600';
      case 'quote_received':
        return 'text-blue-600 font-semibold';
      case 'quote_accepted':
      case 'in_progress':
        return 'text-green-600';
      case 'completed':
        return 'text-green-700';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const shouldShowTrackAction = currentRequest.status === 'quote_accepted' || currentRequest.status === 'in_progress';

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 capitalize">
                {t(currentRequest.type)}
              </h3>
              <p className={`text-sm ${getStatusColor()}`}>
                {getStatusDisplay()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(currentRequest.createdAt).toLocaleTimeString()}
            </p>
            {currentRequest.currentQuote && (
              <p className="text-sm font-medium text-green-600">
                {currentRequest.currentQuote.amount} BGN
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600">Sofia Center, Bulgaria</p>
        </div>

        {currentRequest.assignedEmployee && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              Assigned: {currentRequest.assignedEmployee.name}
            </p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View Details
          </Button>

          {shouldShowTrackAction && currentRequest.assignedEmployee && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onTrackLocation}
                className="flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                Track
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCallEmployee}
                className="flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                Call
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OngoingRequestCard;
