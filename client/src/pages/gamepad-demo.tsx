import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface GamepadData {
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  connected: boolean;
  axes: number[];
}

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'CONNECT' | 'DISCONNECT' | 'INPUT';
  message: string;
}

export default function GamepadDemo() {
  const [gamepad, setGamepad] = useState<GamepadData | null>(null);
  const [eventLog, setEventLog] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const addLogEntry = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      timestamp: formatTimestamp(),
      type,
      message
    };
    setEventLog(prev => [...prev, entry]);
  };

  const clearLogs = () => {
    setEventLog([]);
  };

  const getAxisName = (index: number): string => {
    const axisNames: { [key: number]: string } = {
      0: 'Roll',      // Right Stick Left:-1 Right:+1
      1: 'Pitch',     // Right Stick Down:-1 Up:+1
      3: 'Throttle',  // Left Stick Down:-1 Up:+1
      4: 'Yaw'        // Left Stick Left:-1 Right:+1
    };
    return axisNames[index] || `Axis ${index}`;
  };

  const getAxisDescription = (index: number): string => {
    const descriptions: { [key: number]: string } = {
      0: 'Right Stick Left:-1 Right:+1',
      1: 'Right Stick Down:-1 Up:+1', 
      3: 'Left Stick Down:-1 Up:+1',
      4: 'Left Stick Left:-1 Right:+1'
    };
    return descriptions[index] || '';
  };

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
        axes: Array.from(firstGamepad.axes)
      });
    } else {
      setGamepad(null);
    }

    animationFrameRef.current = requestAnimationFrame(pollGamepads);
  };

  useEffect(() => {
    // Initialize gamepad API
    addLogEntry('INFO', 'Flight Control API initialized. Waiting for controller connection...');

    const handleGamepadConnected = (event: GamepadEvent) => {
      addLogEntry('CONNECT', `Flight controller connected: ${event.gamepad.id} (index: ${event.gamepad.index})`);
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      addLogEntry('DISCONNECT', `Flight controller disconnected: ${event.gamepad.id} (index: ${event.gamepad.index})`);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Start polling
    animationFrameRef.current = requestAnimationFrame(pollGamepads);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Auto-scroll log
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [eventLog, autoScroll]);

  const connectionStatus = gamepad ? 'Flight Controller Connected' : 'No Controller';

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-plane text-primary text-2xl"></i>
              <h1 className="text-2xl font-bold text-white">Flight Control Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                <i className={`fas fa-circle mr-2 ${gamepad ? 'text-green-400' : 'text-red-400'}`}></i>
                <span>{connectionStatus}</span>
              </div>
              <Button onClick={clearLogs} className="bg-primary hover:bg-blue-700">
                <i className="fas fa-trash-alt mr-2"></i>Clear Logs
              </Button>
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
                <span className="text-sm font-medium text-gray-400">Flight Controller</span>
                <div className={`w-3 h-3 rounded-full ${gamepad ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {gamepad ? gamepad.id : 'Not Connected'}
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
                          <span className="text-sm font-medium text-secondary">Throttle (Axis 3)</span>
                          <span className="font-mono text-xs text-gray-400">{gamepad.axes[3].toFixed(3)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Down: -1 → Up: +1</div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div 
                              className="bg-secondary h-4 rounded-full transition-all duration-100 absolute" 
                              style={{ 
                                left: gamepad.axes[3] >= 0 ? '50%' : `${50 + (gamepad.axes[3] * 50)}%`,
                                width: `${Math.abs(gamepad.axes[3]) * 50}%`
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
                          <span className="text-sm font-medium text-accent">Yaw (Axis 4)</span>
                          <span className="font-mono text-xs text-gray-400">{gamepad.axes[4].toFixed(3)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Left: -1 → Right: +1</div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div 
                              className="bg-accent h-4 rounded-full transition-all duration-100 absolute" 
                              style={{ 
                                left: gamepad.axes[4] >= 0 ? '50%' : `${50 + (gamepad.axes[4] * 50)}%`,
                                width: `${Math.abs(gamepad.axes[4]) * 50}%`
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
                    {/* Roll - Axis 0 */}
                    {gamepad.axes[0] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">Roll (Axis 0)</span>
                          <span className="font-mono text-xs text-gray-400">{gamepad.axes[0].toFixed(3)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Left: -1 → Right: +1</div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div 
                              className="bg-primary h-4 rounded-full transition-all duration-100 absolute" 
                              style={{ 
                                left: gamepad.axes[0] >= 0 ? '50%' : `${50 + (gamepad.axes[0] * 50)}%`,
                                width: `${Math.abs(gamepad.axes[0]) * 50}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs w-8">+1</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Pitch - Axis 1 */}
                    {gamepad.axes[1] !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-secondary">Pitch (Axis 1)</span>
                          <span className="font-mono text-xs text-gray-400">{gamepad.axes[1].toFixed(3)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Down: -1 → Up: +1</div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs w-8">-1</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-500"></div>
                            <div 
                              className="bg-secondary h-4 rounded-full transition-all duration-100 absolute" 
                              style={{ 
                                left: gamepad.axes[1] >= 0 ? '50%' : `${50 + (gamepad.axes[1] * 50)}%`,
                                width: `${Math.abs(gamepad.axes[1]) * 50}%`
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
            
            {/* Combined Axes Summary */}
            <Card className="bg-gray-800 border-gray-700 mt-6">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <i className="fas fa-arrows-alt mr-2 text-secondary"></i>
                  Flight Control Axes Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[0, 1, 3, 4].map((axisIndex) => (
                    gamepad.axes[axisIndex] !== undefined && (
                      <div key={axisIndex} className="bg-gray-700 p-3 rounded">
                        <div className="text-sm font-medium text-white mb-1">{getAxisName(axisIndex)}</div>
                        <div className="text-xs text-gray-400 mb-2">{getAxisDescription(axisIndex)}</div>
                        <div className="font-mono text-lg text-center">{gamepad.axes[axisIndex].toFixed(3)}</div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

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
                    <div className="font-mono text-xs truncate">{gamepad.id}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Mapping:</div>
                    <div className="font-mono text-xs">{gamepad.mapping}</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-gray-400 mb-1">Timestamp:</div>
                    <div className="font-mono text-xs">{gamepad.timestamp.toFixed(3)}</div>
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

        {/* Event Log */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-list-alt mr-2 text-accent"></i>
            Event Log
          </h2>
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Real-time flight controller events will appear here</p>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 text-sm">
                    <Checkbox 
                      checked={autoScroll} 
                      onCheckedChange={(checked) => setAutoScroll(checked as boolean)}
                    />
                    <span>Auto-scroll</span>
                  </label>
                </div>
              </div>
            </div>
            <div ref={logContainerRef} className="p-4 h-64 overflow-y-auto font-mono text-sm">
              {eventLog.map((entry, index) => (
                <div key={index} className="flex items-center space-x-3 py-1 text-gray-400">
                  <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  <span className={`px-2 py-1 text-white rounded text-xs ${
                    entry.type === 'INFO' ? 'bg-blue-600' :
                    entry.type === 'CONNECT' ? 'bg-green-600' :
                    entry.type === 'DISCONNECT' ? 'bg-red-600' :
                    'bg-yellow-600'
                  }`}>
                    {entry.type}
                  </span>
                  <span>{entry.message}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Flight Control Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-info-circle mr-2 text-primary"></i>
            Flight Control Mapping
          </h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Axis Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-2">Left Stick</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li><code className="bg-gray-700 px-2 py-1 rounded">Axis 3</code> - Throttle (Down:-1 Up:+1)</li>
                    <li><code className="bg-gray-700 px-2 py-1 rounded">Axis 4</code> - Yaw (Left:-1 Right:+1)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-accent mb-2">Right Stick</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li><code className="bg-gray-700 px-2 py-1 rounded">Axis 0</code> - Roll (Left:-1 Right:+1)</li>
                    <li><code className="bg-gray-700 px-2 py-1 rounded">Axis 1</code> - Pitch (Down:-1 Up:+1)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Flight Control Gamepad Demo - Connect a gamepad to see real-time axis data
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Throttle, Yaw, Roll, and Pitch axes only
          </p>
        </div>
      </footer>
    </div>
  );
}