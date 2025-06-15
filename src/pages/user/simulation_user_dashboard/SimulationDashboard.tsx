import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { ServiceRequestProvider } from "@/components/newService/ServiceRequestProvider";
import RequestSystemDialog from "@/components/newService/RequestSystemDialog";

export default function SimulationDashboard() {
  const { language } = useApp();
  const t = useTranslation(language);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <ServiceRequestProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">{t("simulation-dashboard")}</h1>

        <Card className="mb-4">
          <CardContent>
            <p>{t("welcome-simulation")}</p>
            <Button onClick={openDialog}>{t("request-service")}</Button>
          </CardContent>
        </Card>

        <RequestSystemDialog
          open={isDialogOpen}
          type={"Out of Fuel"} // set to a real value or state depending on your flow (must be allowed type)
          onClose={closeDialog}
          userId={"sampleUserid"} // replace or derive userId as needed
        />
      </div>
    </ServiceRequestProvider>
  );
}
