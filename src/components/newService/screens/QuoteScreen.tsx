
import React from "react";
import { Button } from "@/components/ui/button";
import { ServiceRequest } from "@/types/newServiceRequest";

const QuoteScreen = ({
  request,
  onAccept,
  onDecline,
  onCancel,
}: {
  request: ServiceRequest;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
}) => (
  <div className="space-y-6 p-8 text-center">
    <h2 className="text-xl font-bold mb-2">Quote received!</h2>
    <div className="mb-2">
      Price: <b>{request.priceQuote} BGN</b>
      <br />
      Employee: <b>{request.assignedEmployeeName}</b>
    </div>
    <div className="flex gap-2">
      <Button onClick={onAccept} className="w-full">Accept</Button>
      <Button onClick={onDecline} variant="outline" className="w-full">Decline</Button>
    </div>
    <Button variant="ghost" className="w-full text-red-600" onClick={onCancel}>Cancel Request</Button>
  </div>
);

export default QuoteScreen;
