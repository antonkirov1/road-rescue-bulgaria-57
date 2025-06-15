
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ServiceRequest } from "@/types/newServiceRequest";

const stars = [1,2,3,4,5];

const RateEmployeeScreen = ({
  request,
  onRate,
}: {
  request: ServiceRequest;
  onRate: (r: number) => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-8 justify-center">
      <h2 className="text-xl font-bold text-blue-600">Please rate your technician!</h2>
      <div className="flex gap-2">
        {stars.map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className={`text-2xl ${n <= (selected ?? 0) ? "text-yellow-400" : "text-gray-400"}`}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >★</button>
        ))}
      </div>
      <Button
        onClick={() => selected && onRate(selected)}
        disabled={!selected}
        className="w-full"
      >
        Submit Rating
      </Button>
    </div>
  );
};
export default RateEmployeeScreen;
