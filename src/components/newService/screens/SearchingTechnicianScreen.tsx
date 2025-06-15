
import React from 'react';
import { Button } from '@/components/ui/button';

const SearchingTechnicianScreen = ({ request, onCancel }) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700" />
    <h2 className="text-lg font-semibold">Searching for a technician...</h2>
    <p>Your request: <span className="font-medium">{request.description || request.type}</span></p>
    <Button variant="destructive" onClick={onCancel}>Cancel Request</Button>
  </div>
);

export default SearchingTechnicianScreen;
