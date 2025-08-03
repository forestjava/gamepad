import { Card, CardContent } from "@/components/ui/card";
import { useController } from "@/hooks/useController";

export default function GamepadDemo() {
  const { controller, axes, metadata } = useController();

  const connectionStatus = controller
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
                  className={`fas fa-circle mr-2 ${controller ? "text-green-400" : "text-red-400"}`}
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
                  className={`w-3 h-3 rounded-full ${controller ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {controller ? controller.id : "Not Connected"}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Flight Control Display */}
        {controller && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-plane mr-2 text-accent"></i>
              Flight Controller - <span className="ml-2">{controller.id}</span>
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-secondary">
                          Throttle
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          {axes.throttle.toFixed(3)}
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
                                axes.throttle >= 0
                                  ? "50%"
                                  : `${50 + axes.throttle * 50}%`,
                              width: `${Math.abs(axes.throttle) * 50}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">+1</span>
                      </div>
                    </div>

                    {/* Yaw - Axis 4 */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-accent">
                          Yaw (Axis 4)
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          {axes.yaw.toFixed(3)}
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
                                axes.yaw >= 0
                                  ? "50%"
                                  : `${50 + axes.yaw * 50}%`,
                              width: `${Math.abs(axes.yaw) * 50}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">+1</span>
                      </div>
                    </div>
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-secondary">
                          Pitch{" "}
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          {axes.pitch.toFixed(3)}
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
                                axes.pitch >= 0
                                  ? "50%"
                                  : `${50 + axes.pitch * 50}%`,
                              width: `${Math.abs(axes.pitch) * 50}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">+1</span>
                      </div>
                    </div>

                    {/* Roll - Axis 0 */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">
                          Roll
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          {axes.roll.toFixed(3)}
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
                                axes.roll >= 0
                                  ? "50%"
                                  : `${50 + axes.roll * 50}%`,
                              width: `${Math.abs(axes.roll) * 50}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">+1</span>
                      </div>
                    </div>
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
                      {controller.id}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Mapping:</div>
                    <div className="font-mono text-xs">{controller.mapping}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Timestamp:</div>
                    <div className="font-mono text-xs">
                      {controller.timestamp.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Index:</div>
                    <div className="font-mono text-xs">{controller.index}</div>
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
