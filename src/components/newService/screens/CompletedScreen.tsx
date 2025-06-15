
import React from "react";
import { Button } from "@/components/ui/button";

const CompletedScreen = ({
  request,
  onClose
}: {
  request: any;
  onClose: () => void;
}) => (
  <div className="flex flex-col items-center gap-4 p-8 justify-center">
    <h2 className="text-2xl font-bold text-green-600">Service Completed!</h2>
    <div>Thank you for using our service.</div>
    <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">Finish</Button>
  </div>
);

export default CompletedScreen;
