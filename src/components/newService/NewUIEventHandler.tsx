
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, CheckCheck, XCircle } from 'lucide-react';
import SearchingTechnicianScreen from './screens/SearchingTechnicianScreen';
import LiveTrackingScreen from './screens/LiveTrackingScreen';
import RequestCompletedScreen from './screens/RequestCompletedScreen';
import RequestCancelledScreen from './screens/RequestCancelledScreen';

const NewUIEventHandler = ({
  currentScreen,
  request,
  assignedEmployee,
  onAcceptQuote,
  onDeclineQuote,
  onCancelRequest,
  onClose,
  onLiveTracking
}) => {
  if (!request) {
    return <div>No request available.</div>;
  }

  if (currentScreen === 'searching_technician') {
    return (
      <SearchingTechnicianScreen
        request={request}
        onCancel={onCancelRequest}
      />
    );
  }

  if (currentScreen === 'quote_received') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quote received</h2>
        <p>Estimated price: ${request.priceQuote}</p>
        <div className="flex gap-2">
          <Button onClick={onAcceptQuote} className="w-full">
            <CheckCheck className="w-4 h-4 mr-2" />
            Accept Quote
          </Button>
          <Button onClick={onDeclineQuote} variant="outline" className="w-full">
            Decline Quote
          </Button>
        </div>
        <Button variant="destructive" className="w-full" onClick={onCancelRequest}>
          <XCircle className="w-4 h-4 mr-2" /> Cancel Request
        </Button>
      </div>
    );
  }

  if (currentScreen === 'live_tracking') {
    return (
      <LiveTrackingScreen
        request={request}
        onClose={onClose}
      />
    );
  }

  if (currentScreen === 'completed') {
    return <RequestCompletedScreen request={request} onClose={onClose} />;
  }

  if (currentScreen === 'cancelled') {
    return <RequestCancelledScreen request={request} onClose={onClose} />;
  }

  // Fallback
  return <div>Unknown state: {currentScreen}</div>;
};

export default NewUIEventHandler;
