
import React from 'react';
import { Button } from '@/components/ui/button';

const RequestCancelledScreen = ({ request, onClose }) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <div className="text-red-600 text-2xl font-bold">Request Cancelled</div>
    <p>You have cancelled the request for: {request.type || request.description}</p>
    <Button className="w-full" onClick={onClose}>Close</Button>
  </div>
);

export default RequestCancelledScreen;
