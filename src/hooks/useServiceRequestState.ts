
import React from 'react';
// Extraction of the request system logic from the GitHub repo would go here.
// For brevity: this will simulate async state, transitions, and employee assignment logic
// and track request state, updating the screens accordingly.

export function useServiceRequestState({
  type,
  open,
  userLocation,
  userId,
  onClose,
  onMinimize,
  persistentState,
  mode = 'sim' // or 'real'
}) {
  const [currentScreen, setCurrentScreen] = React.useState(open ? 'searching_technician' : null);
  const [currentRequest, setCurrentRequest] = React.useState(null);
  const [assignedEmployee, setAssignedEmployee] = React.useState(null);

  // Create a request when opening
  React.useEffect(() => {
    if (open && !currentRequest) {
      setCurrentScreen('searching_technician');

      // Simulate request object, in real mode fetch from server
      setTimeout(() => {
        setCurrentRequest({
          id: `${Date.now()}-${Math.random()}`,
          type,
          userLocation,
          userId,
          priceQuote: 50 + Math.floor(Math.random() * 100),
          description: `Service request for ${type}`,
        });
        setCurrentScreen('quote_received');
      }, 1500);
    }
    if (!open) {
      setCurrentScreen(null);
      setCurrentRequest(null);
      setAssignedEmployee(null);
    }
  }, [open, type]);

  // Accept or decline quote
  function handleAcceptQuote() {
    setCurrentScreen('live_tracking');
    // Simulate employee
    setAssignedEmployee({
      name: "Ivan Petrov",
      phone: "+359888123456",
    });
    setTimeout(() => setCurrentScreen('completed'), 5000);
  }

  function handleDeclineQuote() {
    setCurrentScreen('searching_technician');
    setTimeout(() => {
      setCurrentRequest(cr => ({
        ...cr,
        priceQuote: 50 + Math.floor(Math.random() * 100)
      }));
      setCurrentScreen('quote_received');
    }, 1200);
  }

  function handleCancelRequest() {
    setCurrentScreen('cancelled');
    setTimeout(onClose, 1500);
  }

  function handleClose() {
    setCurrentScreen(null);
    setCurrentRequest(null);
    setAssignedEmployee(null);
    onClose();
  }

  function handleLiveTracking() {
    setCurrentScreen('live_tracking');
  }

  function handleMinimize() {
    if (onMinimize) onMinimize();
  }

  return {
    currentScreen,
    currentRequest,
    assignedEmployee,
    handleAcceptQuote,
    handleDeclineQuote,
    handleCancelRequest,
    handleClose,
    handleMinimize,
    handleLiveTracking,
  };
}
