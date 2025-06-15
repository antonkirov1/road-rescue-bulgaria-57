
import React from "react";
import { Button } from "@/components/ui/button";
import { ServiceRequest } from "@/types/newServiceRequest";

const RevisedQuoteScreen = ({
  request,
  onAccept,
  onCancel,
}: {
  request: ServiceRequest;
  onAccept: () => void;
  onCancel: () => void;
}) => (
  <div className="space-y-6 p-8 text-center">
    <h2 className="text-xl font-bold text-yellow-600">New price proposed!</h2>
    <div className="mb-2">
      Previous employee: <b>{request.previousEmployeeName}</b><br/>
      New employee: <b>{request.assignedEmployeeName}</b><br/>
      Price: <b>{request.revisedPriceQuote} BGN</b>
    </div>
    <Button onClick={onAccept} className="w-full bg-yellow-500 hover:bg-yellow-600">Accept</Button>
    <Button variant="ghost" className="w-full text-red-600" onClick={onCancel}>Cancel Request</Button>
  </div>
);

export default RevisedQuoteScreen;
