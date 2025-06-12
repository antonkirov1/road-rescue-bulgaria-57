
import React from 'react';
import { ServiceRequest } from '@/types/newServiceRequest';
import SearchingTechnicianScreen from './screens/SearchingTechnicianScreen';
import PriceQuoteReceivedScreen from './screens/PriceQuoteReceivedScreen';
import RevisedPriceQuoteScreen from './screens/RevisedPriceQuoteScreen';
import RequestAcceptedScreen from './screens/RequestAcceptedScreen';
import LiveTrackingScreen from './screens/LiveTrackingScreen';
import ServiceCompletedScreen from './screens/ServiceCompletedScreen';
import NoTechniciansScreen from './screens/NoTechniciansScreen';

interface NewUIEventHandlerProps {
  currentScreen: string | null;
  request: ServiceRequest | null;
  onAcceptQuote: () => void;
  onDeclineQuote: () => void;
  onCancelRequest: () => void;
  onClose: () => void;
}

const NewUIEventHandler: React.FC<NewUIEventHandlerProps> = ({
  currentScreen,
  request,
  onAcceptQuote,
  onDeclineQuote,
  onCancelRequest,
  onClose
}) => {
  if (!currentScreen || !request) return null;

  switch (currentScreen) {
    case 'show_searching_technician':
      return (
        <SearchingTechnicianScreen 
          request={request}
          onCancel={onCancelRequest}
        />
      );

    case 'show_price_quote_received':
      return (
        <PriceQuoteReceivedScreen
          request={request}
          onAccept={onAcceptQuote}
          onDecline={onDeclineQuote}
          onCancel={onCancelRequest}
        />
      );

    case 'show_revised_price_quote':
      return (
        <RevisedPriceQuoteScreen
          request={request}
          onAccept={onAcceptQuote}
          onDecline={onDeclineQuote}
          onCancel={onCancelRequest}
        />
      );

    case 'show_request_accepted':
    case 'show_request_started':
    case 'show_employee_en_route':
      return (
        <RequestAcceptedScreen
          request={request}
          onClose={onClose}
        />
      );

    case 'show_live_tracking':
      return (
        <LiveTrackingScreen
          request={request}
          onClose={onClose}
        />
      );

    case 'show_service_completed':
      return (
        <ServiceCompletedScreen
          request={request}
          onClose={onClose}
        />
      );

    case 'show_no_technicians_available':
      return (
        <NoTechniciansScreen
          onClose={onClose}
        />
      );

    default:
      return null;
  }
};

export default NewUIEventHandler;
