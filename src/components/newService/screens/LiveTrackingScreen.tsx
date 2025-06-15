import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, User, Clock } from 'lucide-react';

const LiveTrackingScreen = ({ request, onClose }) => (
  <div className="space-y-4">
    <Card>
      <CardContent className="p-4">
        <h4 className="font-medium mb-3">Technician Information</h4>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Technician Name: {request.assignedEmployeeName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm">ETA: 5-10 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">2.3 km away</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { window.location.href = 'tel:+359888123456' }}>
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" onClick={() => alert('Simulate Tracking')}>
            <MapPin className="w-4 h-4 mr-2" />
            Track
          </Button>
        </div>
      </CardContent>
    </Card>
    <Button onClick={onClose} variant="outline" className="w-full">
      Close
    </Button>
  </div>
);

export default LiveTrackingScreen;
