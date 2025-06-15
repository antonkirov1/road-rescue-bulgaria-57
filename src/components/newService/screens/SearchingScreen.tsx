
import React from "react";
import { Button } from "@/components/ui/button";

const SearchingScreen = ({ onCancel }: { onCancel: () => void }) => (
  <div className="flex flex-col items-center gap-4 p-8 justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700" />
    <h2 className="text-lg font-semibold">Searching for a technician...</h2>
    <Button variant="destructive" onClick={onCancel}>Cancel Request</Button>
  </div>
);
export default SearchingScreen;
