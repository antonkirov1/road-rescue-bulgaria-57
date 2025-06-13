
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmployeeStatusCardProps {
  isAvailable: boolean;
  onToggleAvailability: () => void;
  t: (key: string) => string;
}

const EmployeeStatusCard: React.FC<EmployeeStatusCardProps> = ({
  isAvailable,
  onToggleAvailability,
  t
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('employee-status')}</span>
          <Badge variant={isAvailable ? "default" : "secondary"}>
            {isAvailable ? t('available') : t('unavailable')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onToggleAvailability}
          variant={isAvailable ? "destructive" : "default"}
          className="w-full"
        >
          {isAvailable ? t('go-offline') : t('go-online')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmployeeStatusCard;
