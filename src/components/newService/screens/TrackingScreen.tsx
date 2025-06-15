
import React from "react";
import { Button } from "@/components/ui/button";

const TrackingScreen = ({
  request,
  onComplete,
}: {
  request: any;
  onComplete: () => void;
}) => (
  <div className="flex flex-col gap-6 items-center justify-center p-8">
    <h2 className="text-lg font-semibold">Technician en route</h2>
    <div>Technician: <b>{request.assignedEmployeeName}</b></div>
    <Button onClick={onComplete} className="w-full">Mark as Complete</Button>
  </div>
);

export default TrackingScreen;
