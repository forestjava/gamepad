# Gamepad Controller

A React library for easy gamepad/controller integration in React applications. Provides real-time access to controller axes data with a simple hook-based API.

## Features

- 🎮 **Real-time controller data** - Get live updates of controller axes
- 🚁 **Flight controller support** - Optimized for throttle, yaw, pitch, and roll axes
- ⚡ **High performance** - Uses `requestAnimationFrame` for smooth polling
- 📦 **Zero dependencies** - Only requires React
- 🔒 **TypeScript support** - Full type safety included
- 🎯 **Simple API** - One provider, one hook

## Installation

```bash
npm install gamepad-controller
```

## Quick Start

```tsx
import { ControllerProvider, useController } from 'gamepad-controller';

function App() {
  return (
    <ControllerProvider>
      <FlightSimulator />
    </ControllerProvider>
  );
}

function FlightSimulator() {
  const { controller, axes, metadata } = useController();
  
  return (
    <div>
      <div>Status: {controller ? 'Connected' : 'Disconnected'}</div>
      {controller && (
        <div>
          <div>Controller: {metadata?.id}</div>
          <div>Throttle: {axes.throttle}</div>
          <div>Yaw: {axes.yaw}</div>
          <div>Pitch: {axes.pitch}</div>
          <div>Roll: {axes.roll}</div>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `ControllerProvider`

React Context Provider that manages controller state and polling.

```tsx
import { ControllerProvider } from 'gamepad-controller';

<ControllerProvider>
  {/* Your app components */}
</ControllerProvider>
```

### `useController()`

Hook that returns controller data and axes values.

**Returns:**
```typescript
{
  controller: ControllerData | null;
  axes: AxesData;
  metadata: ControllerMetadata | null;
}
```

**Types:**
```typescript
interface ControllerData {
  id: string;
  index: number;
  mapping: string;
  timestamp: number;
  connected: boolean;
  axes: number[];
}

interface AxesData {
  throttle: number; // Axis 3
  yaw: number;      // Axis 4
  pitch: number;    // Axis 1
  roll: number;     // Axis 0
}

interface ControllerMetadata {
  id: string;
  mapping: string;
  index: number;
}
```

## Usage Examples

### Basic Controller Status

```tsx
function ControllerStatus() {
  const { controller } = useController();
  
  return (
    <div>
      {controller ? (
        <span>✅ {controller.id} connected</span>
      ) : (
        <span>❌ No controller connected</span>
      )}
    </div>
  );
}
```

### Flight Controls Display

```tsx
function FlightControls() {
  const { axes } = useController();
  
  return (
    <div>
      <div>Throttle: {(axes.throttle * 100).toFixed(1)}%</div>
      <div>Yaw: {(axes.yaw * 100).toFixed(1)}%</div>
      <div>Pitch: {(axes.pitch * 100).toFixed(1)}%</div>
      <div>Roll: {(axes.roll * 100).toFixed(1)}%</div>
    </div>
  );
}
```

### Controller Metadata

```tsx
function ControllerInfo() {
  const { metadata } = useController();
  
  if (!metadata) return <div>No controller connected</div>;
  
  return (
    <div>
      <div>ID: {metadata.id}</div>
      <div>Mapping: {metadata.mapping}</div>
      <div>Index: {metadata.index}</div>
    </div>
  );
}
```

## Browser Support

This library uses the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API), which is supported in:

- Chrome 21+
- Firefox 29+
- Safari 10.1+
- Edge 12+

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Type check
npm run check
```

## License

MIT 