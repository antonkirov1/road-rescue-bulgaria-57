
import React from "react";
import { Button } from "@/components/ui/button";

const CancelledScreen = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col gap-5 items-center p-8">
    <h2 className="text-2xl font-bold text-red-600">Request Cancelled</h2>
    <Button onClick={onClose} className="w-full">Close</Button>
  </div>
);

export default CancelledScreen;
