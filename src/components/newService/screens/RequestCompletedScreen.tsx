
import React from 'react';
import { Button } from '@/components/ui/button';

const RequestCompletedScreen = ({ request, onClose }) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <div className="text-green-600 text-2xl font-bold">Request Completed!</div>
    <p>Your technician has finished the task for: {request.type || request.description}</p>
    <Button className="w-full" onClick={onClose}>Close</Button>
  </div>
);

export default RequestCompletedScreen;
