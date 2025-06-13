
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { ServiceRequest } from '@/types/newServiceRequest';

interface IncomingRequestsListProps {
  incomingRequests: ServiceRequest[];
  isAvailable: boolean;
  onAcceptRequest: (request: ServiceRequest) => void;
  onDeclineRequest: (request: ServiceRequest) => void;
  getServiceTypeDisplay: (type: ServiceRequest['type']) => string;
  t: (key: string) => string;
}

const IncomingRequestsList: React.FC<IncomingRequestsListProps> = ({
  incomingRequests,
  isAvailable,
  onAcceptRequest,
  onDeclineRequest,
  getServiceTypeDisplay,
  t
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {t('incoming-requests')} ({incomingRequests.length})
      </h2>
      
      {incomingRequests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {isAvailable ? t('no-pending-requests') : t('you-are-currently-offline')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {incomingRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{getServiceTypeDisplay(request.type)}</span>
                  <Badge variant="outline">
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {t('customer-id')}: {request.userId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Sofia, Bulgaria</span>
                </div>
                {request.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.description}
                  </p>
                )}
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => onAcceptRequest(request)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {t('accept')}
                  </Button>
                  <Button 
                    onClick={() => onDeclineRequest(request)}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('decline')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingRequestsList;
