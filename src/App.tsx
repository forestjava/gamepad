import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ControllerProvider } from "@/components/ControllerProvider";
import GamepadDemo from "@/pages/gamepad-demo";


function App() {
  return (
    <ControllerProvider>
      <TooltipProvider>
        <Toaster />
        <GamepadDemo />
      </TooltipProvider>
    </ControllerProvider>
  );
}

export default App;
