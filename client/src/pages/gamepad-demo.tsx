import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GamepadData {
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  connected: boolean;
  axes: number[];
}

export default function GamepadDemo() {
  const [gamepad, setGamepad] = useState<GamepadData | null>(null);
  const animationFrameRef = useRef<number>();

  const pollGamepads = () => {
    const gamepadList = navigator.getGamepads();
    const firstGamepad = gamepadList[0];

    if (firstGamepad) {
      setGamepad({
        id: firstGamepad.id,
        index: firstGamepad.index,
        mapping: firstGamepad.mapping,
        timestamp: firstGamepad.timestamp,
        connected: firstGamepad.connected,
        axes: Array.from(firstGamepad.axes),
      });
    } else {
      setGamepad(null);
    }

    animationFrameRef.current = requestAnimationFrame(pollGamepads);
  };

  useEffect(() => {
    // Start polling
    animationFrameRef.current = requestAnimationFrame(pollGamepads);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const connectionStatus = gamepad
    ? "Flight Controller Connected"
    : "No Controller";

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-plane text-primary text-2xl"></i>
              <h1 className="text-2xl font-bold text-white">
                Flight Control Demo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                <i
                  className={`fas fa-circle mr-2 ${gamepad ? "text-green-400" : "text-red-400"}`}
                ></i>
                <span>{connectionStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Connection Status Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-wifi mr-2 text-secondary"></i>
            Connection Status
          </h2>
          <Card className="bg-gray-800 border-gray-700 max-w-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">
                  Flight Controller
                </span>
                <div
                  className={`w-3 h-3 rounded-full ${gamepad ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {gamepad ? gamepad.id : "Not Connected"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Flight Control Display */}
        {gamepad && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-plane mr-2 text-accent"></i>
              Flight Controller - <span className="ml-2">{gamepad.id}</span>
            </h2>

            {/* Flight Control Axes Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Stick - Throttle & Yaw */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <i className="fas fa-gamepad mr-2 text-primary"></i>
                    Left Stick - Throttle & Yaw
                  </h3>
                  <div className="space-y-6">
                    {/* Throttle - Axis 3 */}
                    {gamepad.axes[3] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-secondary">
                            Throttle
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {gamepad.axes[3].toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div
                              className="bg-secondary h-4 rounded-full transition-all duration-100 absolute"
                              style={{
                                left:
                                  gamepad.axes[3] >= 0
                                    ? "50%"
                                    : `${50 + gamepad.axes[3] * 50}%`,
                                width: `${Math.abs(gamepad.axes[3]) * 50}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs w-8">+1</span>
                        </div>
                      </div>
                    )}

                    {/* Yaw - Axis 4 */}
                    {gamepad.axes[4] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-accent">
                            Yaw (Axis 4)
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {gamepad.axes[4].toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div
                              className="bg-accent h-4 rounded-full transition-all duration-100 absolute"
                              style={{
                                left:
                                  gamepad.axes[4] >= 0
                                    ? "50%"
                                    : `${50 + gamepad.axes[4] * 50}%`,
                                width: `${Math.abs(gamepad.axes[4]) * 50}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs w-8">+1</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Right Stick - Roll & Pitch */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <i className="fas fa-gamepad mr-2 text-primary"></i>
                    Right Stick - Roll & Pitch
                  </h3>
                  <div className="space-y-6">
                    {/* Pitch - Axis 1 */}
                    {gamepad.axes[1] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-secondary">
                            Pitch{" "}
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {gamepad.axes[1].toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div
                              className="bg-secondary h-4 rounded-full transition-all duration-100 absolute"
                              style={{
                                left:
                                  gamepad.axes[1] >= 0
                                    ? "50%"
                                    : `${50 + gamepad.axes[1] * 50}%`,
                                width: `${Math.abs(gamepad.axes[1]) * 50}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs w-8">+1</span>
                        </div>
                      </div>
                    )}

                    {/* Roll - Axis 0 */}
                    {gamepad.axes[0] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">
                            Roll
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {gamepad.axes[0].toFixed(3)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div
                              className="bg-primary h-4 rounded-full transition-all duration-100 absolute"
                              style={{
                                left:
                                  gamepad.axes[0] >= 0
                                    ? "50%"
                                    : `${50 + gamepad.axes[0] * 50}%`,
                                width: `${Math.abs(gamepad.axes[0]) * 50}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs w-8">+1</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gamepad Metadata */}
            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <i className="fas fa-info-circle mr-2 text-accent"></i>
                  Controller Metadata
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">ID:</div>
                    <div className="font-mono text-xs truncate">
                      {gamepad.id}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Mapping:</div>
                    <div className="font-mono text-xs">{gamepad.mapping}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Timestamp:</div>
                    <div className="font-mono text-xs">
                      {gamepad.timestamp.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Index:</div>
                    <div className="font-mono text-xs">{gamepad.index}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Flight Control Gamepad Demo - Connect a gamepad to see real-time
            axis data
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Throttle, Yaw, Roll, and Pitch axes only
          </p>
        </div>
      </footer>
    </div>
  );
}
