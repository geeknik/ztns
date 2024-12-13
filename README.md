# ZTNS (Zero Trust Network Simulator)

A browser-based simulation tool for zero trust network architectures, designed to help developers and security professionals understand, test, and validate zero trust security concepts in a controlled environment. This client-side application runs entirely in your web browser with no server dependencies.

## About Zero Trust

Zero Trust is a security model that operates on the principle "never trust, always verify." Unlike traditional perimeter-based security, zero trust:
- Assumes no implicit trust, regardless of location or network
- Requires continuous authentication and authorization
- Implements least-privilege access controls
- Validates every request, every time

## Getting Started

Simply visit [ztns.io](https://ztns.io) to start using the simulator immediately. No installation or setup required!

For offline use, you can download the latest release from the releases page and open index.html in your web browser.

## Features

- **Client-Side Simulation**: Runs entirely in your web browser with no server dependencies
- **Interactive Network Design**: Drag-and-drop interface for creating network topologies
- **Real-Time Simulation**: Watch packets flow through your zero trust architecture
- **State Management**: All simulation state is maintained in your browser
- **Export/Import**: Save and load your network configurations locally
- **Scenario Testing**: Pre-built scenarios to test common zero trust patterns

## Web Interface

The simulator provides an intuitive web interface with the following components:
- Network Design Canvas: Create and modify your network topology
- Component Palette: Drag-and-drop network components
- Simulation Controls: Start, pause, and reset simulations
- Analysis Panel: View metrics and security insights
- Configuration Panel: Adjust component settings and policies

## Usage

1. Open the simulator in your web browser
2. Create a network topology by dragging components onto the canvas
3. Configure zero trust policies for each component
4. Start the simulation to observe traffic flow and policy enforcement
5. Use the analysis panel to evaluate security effectiveness

Your network configuration and simulation state are automatically saved in your browser's local storage.

## Development Status

This project is under active development. Features and APIs may change as we continue to enhance the simulator's capabilities. Contributions and feedback are welcome!

## License

Licensed under MIT license ([LICENSE](LICENSE) or http://opensource.org/licenses/MIT)
