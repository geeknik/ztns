# ZTNS (Zero Trust Network Simulator)

A privacy-focused, browser-based simulation tool for zero trust network architectures. ZTNS helps developers and security professionals understand, test, and validate zero trust security concepts in a controlled environment. This client-side application runs entirely in your web browser with no data collection or third-party dependencies.

## Privacy & Security First

ZTNS is built with privacy and security as core principles:
- 100% Client-side: All simulation logic runs in your browser
- No Authentication: Anonymous access, no sign-ups required
- No Data Collection: We don't track, store, or analyze your usage
- No Third-Party Requests: Zero external dependencies or trackers
- Local Storage Only: All data stays in your browser

## About Zero Trust

Zero Trust is a security model that operates on the principle "never trust, always verify." Unlike traditional perimeter-based security, zero trust:
- Assumes no implicit trust, regardless of location or network
- Requires continuous authentication and authorization
- Implements least-privilege access controls
- Validates every request, every time

## Features

- **Private Simulation**: Runs entirely in your web browser
- **Interactive Network Design**: Drag-and-drop interface for creating network topologies
- **Real-Time Simulation**: Watch packets flow through your zero trust architecture
- **Dynamic Visualization**: 
  - Animated connection types (data, auth, policy)
  - Component state indicators (active, processing, error)
  - Visual feedback for security events
- **Local State Management**: All simulation state stays in your browser
- **Export/Import**: Save and load your network configurations locally
- **Scenario Testing**: Pre-built scenarios to test common zero trust patterns
- **Real-time Metrics**: Track access attempts, response times, and security events

## Web Interface

The simulator provides an intuitive web interface with:
- Network Design Canvas: Create and modify your network topology
- Component Palette: Drag-and-drop network components
- Simulation Controls: Start, pause, and reset simulations
- Analysis Panel: View real-time metrics and security insights
- Configuration Panel: Adjust component settings and policies

## Component States

Components in the simulation provide visual feedback through different states:
- **Active**: Pulsing glow indicating normal operation
- **Processing**: Size animation showing active data handling
- **Error**: Shake animation and red highlight for security events
- **Inactive**: Default state when simulation is paused

## Connection Types

The simulator visualizes different types of network connections:
- **Data Connections**: Blue animated lines for general data flow
- **Auth Connections**: Red animated lines for authentication traffic
- **Policy Connections**: Green animated lines for policy checks

## Usage

1. Open the simulator in your web browser
2. Create a network topology by dragging components onto the canvas
3. Configure zero trust policies for each component
4. Start the simulation to observe traffic flow and policy enforcement
5. Monitor the analysis panel for security metrics and events

Your network configuration and simulation state are automatically saved in your browser's local storage.

## Development Status

This project is under active development. Features and APIs may change as we continue to enhance the simulator's capabilities. Contributions and feedback are welcome!

## License

Licensed under MIT license ([LICENSE](LICENSE) or http://opensource.org/licenses/MIT)
