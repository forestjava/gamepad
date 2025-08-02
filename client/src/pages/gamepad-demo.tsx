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
  buttons: GamepadButton[];
  axes: number[];
}

interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'CONNECT' | 'DISCONNECT' | 'INPUT';
  message: string;
}

export default function GamepadDemo() {
  const [gamepads, setGamepads] = useState<(GamepadData | null)[]>([null, null, null, null]);
  const [activeGamepad, setActiveGamepad] = useState<GamepadData | null>(null);
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

  const getButtonName = (index: number): string => {
    const buttonNames: { [key: number]: string } = {
      0: 'A', 1: 'B', 2: 'X', 3: 'Y',
      4: 'LB', 5: 'RB', 6: 'LT', 7: 'RT',
      8: 'SELECT', 9: 'START', 10: 'L3', 11: 'R3',
      12: 'UP', 13: 'DOWN', 14: 'LEFT', 15: 'RIGHT'
    };
    return buttonNames[index] || `Button ${index}`;
  };

  const getAxisName = (index: number): string => {
    const axisNames: { [key: number]: string } = {
      0: 'Left Stick X', 1: 'Left Stick Y',
      2: 'Right Stick X', 3: 'Right Stick Y'
    };
    return axisNames[index] || `Axis ${index}`;
  };

  const pollGamepads = () => {
    const gamepadList = navigator.getGamepads();
    const newGamepads: (GamepadData | null)[] = [null, null, null, null];
    let hasActiveGamepad = false;

    for (let i = 0; i < 4; i++) {
      const gamepad = gamepadList[i];
      if (gamepad) {
        newGamepads[i] = {
          id: gamepad.id,
          index: gamepad.index,
          mapping: gamepad.mapping,
          timestamp: gamepad.timestamp,
          connected: gamepad.connected,
          buttons: Array.from(gamepad.buttons),
          axes: Array.from(gamepad.axes)
        };
        
        if (!hasActiveGamepad) {
          setActiveGamepad(newGamepads[i]);
          hasActiveGamepad = true;
        }
      }
    }

    if (!hasActiveGamepad) {
      setActiveGamepad(null);
    }

    setGamepads(newGamepads);
    animationFrameRef.current = requestAnimationFrame(pollGamepads);
  };

  useEffect(() => {
    // Initialize gamepad API
    addLogEntry('INFO', 'Gamepad API initialized. Waiting for controller connection...');

    const handleGamepadConnected = (event: GamepadEvent) => {
      addLogEntry('CONNECT', `Gamepad connected: ${event.gamepad.id} (index: ${event.gamepad.index})`);
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      addLogEntry('DISCONNECT', `Gamepad disconnected: ${event.gamepad.id} (index: ${event.gamepad.index})`);
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

  const connectedCount = gamepads.filter(gamepad => gamepad !== null).length;
  const connectionStatus = connectedCount === 0 ? 'No Controllers' : 
                          connectedCount === 1 ? '1 Controller' : `${connectedCount} Controllers`;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-gamepad text-primary text-2xl"></i>
              <h1 className="text-2xl font-bold text-white">Gamepad API Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                <i className={`fas fa-circle mr-2 ${connectedCount > 0 ? 'text-green-400' : 'text-red-400'}`}></i>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamepads.map((gamepad, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Controller {index + 1}</span>
                    <div className={`w-3 h-3 rounded-full ${gamepad ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {gamepad ? gamepad.id : 'Not Connected'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Active Gamepad Display */}
        {activeGamepad && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-gamepad mr-2 text-accent"></i>
              Active Controller - <span className="ml-2">{activeGamepad.id}</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gamepad Visual Representation */}
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Controller Layout</h3>
                  <div className="relative">
                    {/* Controller Body */}
                    <div className="mx-auto w-80 h-48 bg-gray-700 rounded-3xl relative border-2 border-gray-600">
                      {/* D-Pad */}
                      <div className="absolute left-8 top-16 w-12 h-12">
                        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5">
                          <div></div>
                          <button className={`rounded-sm text-xs flex items-center justify-center ${activeGamepad.buttons[12]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>↑</button>
                          <div></div>
                          <button className={`rounded-sm text-xs flex items-center justify-center ${activeGamepad.buttons[14]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>←</button>
                          <div className="bg-gray-800 rounded-sm"></div>
                          <button className={`rounded-sm text-xs flex items-center justify-center ${activeGamepad.buttons[15]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>→</button>
                          <div></div>
                          <button className={`rounded-sm text-xs flex items-center justify-center ${activeGamepad.buttons[13]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>↓</button>
                          <div></div>
                        </div>
                      </div>

                      {/* Left Analog Stick */}
                      <div className="absolute left-16 bottom-8">
                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500 relative">
                          <div 
                            className="w-4 h-4 bg-secondary rounded-full absolute transition-all duration-100"
                            style={{
                              left: `${50 + (activeGamepad.axes[0] || 0) * 25}%`,
                              top: `${50 + (activeGamepad.axes[1] || 0) * 25}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-400">L</p>
                      </div>

                      {/* Right Analog Stick */}
                      <div className="absolute right-16 bottom-8">
                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500 relative">
                          <div 
                            className="w-4 h-4 bg-secondary rounded-full absolute transition-all duration-100"
                            style={{
                              left: `${50 + (activeGamepad.axes[2] || 0) * 25}%`,
                              top: `${50 + (activeGamepad.axes[3] || 0) * 25}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-400">R</p>
                      </div>

                      {/* Face Buttons */}
                      <div className="absolute right-8 top-16 w-12 h-12">
                        <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5">
                          <div></div>
                          <button className={`rounded-full text-xs font-bold flex items-center justify-center ${activeGamepad.buttons[3]?.pressed ? 'bg-accent' : 'bg-gray-600'}`}>Y</button>
                          <div></div>
                          <button className={`rounded-full text-xs font-bold flex items-center justify-center ${activeGamepad.buttons[2]?.pressed ? 'bg-accent' : 'bg-gray-600'}`}>X</button>
                          <div></div>
                          <button className={`rounded-full text-xs font-bold flex items-center justify-center ${activeGamepad.buttons[1]?.pressed ? 'bg-accent' : 'bg-gray-600'}`}>B</button>
                          <div></div>
                          <button className={`rounded-full text-xs font-bold flex items-center justify-center ${activeGamepad.buttons[0]?.pressed ? 'bg-accent' : 'bg-gray-600'}`}>A</button>
                          <div></div>
                        </div>
                      </div>

                      {/* Shoulder Buttons */}
                      <div className="absolute left-4 top-2 flex space-x-1">
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[4]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>LB</button>
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[6]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>LT</button>
                      </div>
                      <div className="absolute right-4 top-2 flex space-x-1">
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[7]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>RT</button>
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[5]?.pressed ? 'bg-primary' : 'bg-gray-600'}`}>RB</button>
                      </div>

                      {/* Center Buttons */}
                      <div className="absolute left-1/2 top-8 transform -translate-x-1/2 flex space-x-4">
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[8]?.pressed ? 'bg-secondary' : 'bg-gray-600'}`}>SELECT</button>
                        <button className={`px-2 py-1 rounded text-xs ${activeGamepad.buttons[9]?.pressed ? 'bg-secondary' : 'bg-gray-600'}`}>START</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Data */}
              <div className="space-y-4">
                {/* Buttons Data */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <i className="fas fa-mouse-pointer mr-2 text-primary"></i>
                      Buttons
                    </h3>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {activeGamepad.buttons.map((button, index) => (
                        <div key={index} className={`flex justify-between items-center py-1 px-2 rounded text-sm ${button.pressed ? 'bg-primary' : 'bg-gray-700'}`}>
                          <span>{getButtonName(index)}</span>
                          <span className="font-mono text-xs text-gray-300">{button.value.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Axes Data */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <i className="fas fa-arrows-alt mr-2 text-secondary"></i>
                      Analog Axes
                    </h3>
                    <div className="space-y-2">
                      {activeGamepad.axes.map((axis, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-sm w-20">{getAxisName(index)}:</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2 relative">
                            <div 
                              className="bg-secondary h-2 rounded-full transition-all duration-100" 
                              style={{ width: `${Math.abs(axis) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs text-gray-400 w-16">{axis.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gamepad Metadata */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <i className="fas fa-info-circle mr-2 text-accent"></i>
                      Metadata
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">ID:</span>
                        <span className="font-mono text-xs truncate max-w-48">{activeGamepad.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mapping:</span>
                        <span className="font-mono text-xs">{activeGamepad.mapping}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="font-mono text-xs">{activeGamepad.timestamp.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Index:</span>
                        <span className="font-mono text-xs">{activeGamepad.index}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                <p className="text-sm text-gray-400">Real-time gamepad events will appear here</p>
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

        {/* API Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <i className="fas fa-code mr-2 text-primary"></i>
            API Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Supported Events</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-secondary"></i>
                    <span><code className="bg-gray-700 px-2 py-1 rounded">gamepadconnected</code></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="fas fa-check text-secondary"></i>
                    <span><code className="bg-gray-700 px-2 py-1 rounded">gamepaddisconnected</code></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-3">Browser Support</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Chrome:</span>
                    <span className="text-secondary">✓ Supported</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Firefox:</span>
                    <span className="text-secondary">✓ Supported</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Safari:</span>
                    <span className="text-yellow-500">⚠ Limited</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Edge:</span>
                    <span className="text-secondary">✓ Supported</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Gamepad API Demo - Connect a gamepad to see real-time data
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Built with React and the native Gamepad API
          </p>
        </div>
      </footer>
    </div>
  );
}
