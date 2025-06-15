
import React from "react";
import { Button } from "@/components/ui/button";

const NoTechnicianScreen = ({ onOk }: { onOk: () => void }) => (
  <div className="flex flex-col items-center gap-4 p-8 justify-center">
    <h2 className="text-xl font-bold text-red-600">No technician found!</h2>
    <p>Sorry, we couldn&#39;t find anyone to help you right now.</p>
    <Button onClick={onOk}>OK</Button>
  </div>
);

export default NoTechnicianScreen;
