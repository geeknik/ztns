import { ComponentConfigManager } from './componentConfig.js';
import { Packet } from './packet.js';
import { MetricsManager } from './metricsManager.js';

// Main application class
class ZTNSimulator {
    configManager;
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.components = new Map();
        this.connections = new Set();
        this.packets = new Set();
        this.isSimulationRunning = false;
        this.selectedComponent = null;
        this.connectionStartComponent = null;
        this.lastPacketTime = 0;
        this.metricsManager = new MetricsManager();
        
        this.configManager = new ComponentConfigManager(
            (component) => this.handleConfigUpdate(component)
        );

        this.initializeEventListeners();
        this.resizeCanvas();
    }

    initializeEventListeners() {
        // Canvas resize handling
        window.addEventListener('resize', () => this.resizeCanvas());

        // Simulation controls
        document.getElementById('start-simulation').addEventListener('click', () => this.startSimulation());
        document.getElementById('pause-simulation').addEventListener('click', () => this.pauseSimulation());
        document.getElementById('reset-simulation').addEventListener('click', () => this.resetSimulation());

        // Component drag and drop
        const components = document.querySelectorAll('.component');
        components.forEach(component => {
            component.addEventListener('dragstart', (e) => this.handleDragStart(e));
        });

        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Save/Load functionality
        document.getElementById('save-simulation').addEventListener('click', () => this.saveSimulation());
        document.getElementById('load-simulation').addEventListener('click', () => this.loadSimulation());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text/plain');
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.addComponent(componentType, x, y);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Clear config panel if clicking empty space
        if (!this.components.size) {
            this.updateConfigPanel(null);
        }
        
        // Find clicked component
        let clickedComponent = null;
        for (const [id, component] of this.components) {
            const distance = Math.sqrt(
                Math.pow(clickX - component.x, 2) + 
                Math.pow(clickY - component.y, 2)
            );
            if (distance <= 25) { // Component radius
                clickedComponent = component;
                break;
            }
        }

        if (clickedComponent) {
            if (this.connectionStartComponent) {
                // Complete connection
                if (this.connectionStartComponent !== clickedComponent) {
                    this.createConnection(
                        this.connectionStartComponent.id,
                        clickedComponent.id
                    );
                }
                this.connectionStartComponent = null;
                this.selectedComponent = null;
            } else {
                // Start new connection
                this.connectionStartComponent = clickedComponent;
                this.selectedComponent = clickedComponent;
            }
        } else {
            // Clicked empty space - clear selection
            this.connectionStartComponent = null;
            this.selectedComponent = null;
        }
        
        this.render();
    }

    handleConfigUpdate(component) {
        // Trigger a re-render when configuration changes
        this.render();
    }
    
    createConnection(sourceId, targetId) {
        // Determine connection type based on component types
        const sourceComp = this.components.get(sourceId);
        const targetComp = this.components.get(targetId);
        
        const connectionType = this.determineConnectionType(sourceComp.type, targetComp.type);
        
        // Prevent duplicate connections
        const connectionExists = Array.from(this.connections).some(
            conn => (conn.source === sourceId && conn.target === targetId) ||
                   (conn.source === targetId && conn.target === sourceId)
        );

        if (!connectionExists) {
            this.connections.add({ 
                source: sourceId, 
                target: targetId,
                type: connectionType,
                state: 'inactive'
            });
        }
    }

    determineConnectionType(sourceType, targetType) {
        if (sourceType === 'client' && targetType === 'identity-provider' ||
            targetType === 'client' && sourceType === 'identity-provider') {
            return 'auth';
        }
        if (sourceType === 'proxy' && targetType === 'policy-engine' ||
            targetType === 'proxy' && sourceType === 'policy-engine') {
            return 'policy';
        }
        return 'data';
    }

    addComponent(type, x, y) {
        const component = {
            id: `${type}-${Date.now()}`,
            type,
            x,
            y,
            config: this.getDefaultConfig(type)
        };

        this.components.set(component.id, component);
        this.render();
        this.updateConfigPanel(component);
    }

    getDefaultConfig(type) {
        // Default configurations for different component types
        const configs = {
            'identity-provider': {
                authMethods: ['certificate', 'token'],
                sessionTimeout: 3600
            },
            'policy-engine': {
                rules: [],
                defaultAction: 'deny'
            },
            'resource': {
                accessLevel: 'restricted',
                protocols: ['https']
            },
            'client': {
                trustLevel: 0,
                permissions: []
            },
            'proxy': {
                mode: 'reverse',
                tlsVersion: '1.3'
            }
        };

        return configs[type] || {};
    }

    startSimulation() {
        this.isSimulationRunning = true;
        this.simulationLoop();
    }

    pauseSimulation() {
        this.isSimulationRunning = false;
    }

    resetSimulation() {
        this.isSimulationRunning = false;
        this.packets.clear();
        this.metricsManager.reset();
        this.render();
        this.updateMetricsDisplay();
    }

    updateMetricsDisplay() {
        const metricsDiv = document.getElementById('metrics');
        metricsDiv.innerHTML = this.metricsManager.getMetricsHTML();
    }

    simulationLoop() {
        if (!this.isSimulationRunning) return;

        // Update simulation state
        this.updateSimulation();
        this.render();

        requestAnimationFrame(() => this.simulationLoop());
    }

    updateSimulation() {
        // Update component states
        this.components.forEach(component => {
            const packets = Array.from(this.packets);
            const isInvolved = packets.some(packet => 
                packet.source === component.id || packet.target === component.id
            );
            
            if (isInvolved) {
                // Check for error conditions
                const hasError = packets.some(packet => 
                    packet.target === component.id && Math.random() < 0.05
                );
                
                if (hasError) {
                    component.state = 'error';
                    this.metricsManager.trackDeniedAccess();
                } else {
                    component.state = 'processing';
                }
            } else if (this.isSimulationRunning) {
                component.state = 'active';
            } else {
                component.state = 'inactive';
            }
        });

        // Update connection states
        this.connections.forEach(connection => {
            const hasPackets = Array.from(this.packets).some(packet =>
                packet.source === connection.source && packet.target === connection.target
            );
            connection.state = hasPackets ? 'active' : 'inactive';
        });

        // Update existing packets
        for (const packet of this.packets) {
            const completed = packet.update();
            if (completed) {
                this.packets.delete(packet);
                this.metricsManager.trackResponseTime(Math.random() * 100);
            }
        }

        // Generate new packets
        const currentTime = Date.now();
        if (currentTime - this.lastPacketTime > 2000) { // Every 2 seconds
            this.generateNewPacket();
            this.lastPacketTime = currentTime;
        }

        // Update metrics
        this.metricsManager.updateConnections(this.connections.size);
        this.updateMetricsDisplay();
    }

    generateNewPacket() {
        const connections = Array.from(this.connections);
        if (connections.length === 0) return;

        const connection = connections[Math.floor(Math.random() * connections.length)];
        const types = ['request', 'auth', 'response'];
        const packetType = types[Math.floor(Math.random() * types.length)];
        const packet = new Packet(connection.source, connection.target, packetType);
        this.packets.add(packet);
        this.metricsManager.trackPacket(packet);
        
        // Simulate some denied access attempts
        if (Math.random() < 0.1) { // 10% chance
            this.metricsManager.trackDeniedAccess();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => this.drawConnection(connection));

        // Draw packets
        this.packets.forEach(packet => this.drawPacket(packet));

        // Draw components
        this.components.forEach(component => this.drawComponent(component));
    }

    drawPacket(packet) {
        const pos = packet.getPosition(this.components);
        if (!pos) return;

        // Draw packet circle
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();

        // Draw glowing effect
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawComponent(component) {
        // Component styles based on type and state
        const styles = {
            'identity-provider': { color: '#e74c3c', icon: '🔐', activeColor: '#ff6b6b' },
            'policy-engine': { color: '#2ecc71', icon: '⚖️', activeColor: '#27ae60' },
            'resource': { color: '#f1c40f', icon: '📦', activeColor: '#f39c12' },
            'client': { color: '#3498db', icon: '💻', activeColor: '#2980b9' },
            'proxy': { color: '#9b59b6', icon: '🔄', activeColor: '#8e44ad' }
        };

        const style = styles[component.type];
        const radius = 25;

        // State-based visual effects
        if (component.state === 'active') {
            this.ctx.shadowColor = style.activeColor;
            this.ctx.shadowBlur = 15;
        } else if (component.state === 'processing') {
            this.ctx.shadowColor = '#3498db';
            this.ctx.shadowBlur = 20;
            radius = 27; // Slightly larger when processing
        } else if (component.state === 'error') {
            this.ctx.shadowColor = '#e74c3c';
            this.ctx.shadowBlur = 25;
        }
        
        const style = styles[component.type];
        const radius = 25;

        // Draw selection highlight
        if (component === this.selectedComponent || component === this.connectionStartComponent) {
            this.ctx.beginPath();
            this.ctx.arc(component.x, component.y, radius + 5, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            this.ctx.fill();
        }

        // Draw component circle
        this.ctx.fillStyle = style.color;
        this.ctx.beginPath();
        this.ctx.arc(component.x, component.y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Add border
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw icon
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(style.icon, component.x, component.y);

        // Draw label
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillText(component.type.replace('-', ' '), component.x, component.y + radius + 20);
    }

    drawConnection(connection) {
        const { source, target, type, state } = connection;
        const sourceComp = this.components.get(source);
        const targetComp = this.components.get(target);

        if (!sourceComp || !targetComp) return;

        // Set connection style based on type
        const styles = {
            'auth': { color: '#e74c3c', width: 3 },
            'policy': { color: '#2ecc71', width: 3 },
            'data': { color: '#3498db', width: 2 }
        };
        const style = styles[type] || styles.data;

        this.ctx.beginPath();
        this.ctx.moveTo(sourceComp.x, sourceComp.y);
        this.ctx.lineTo(targetComp.x, targetComp.y);
        
        this.ctx.strokeStyle = style.color;
        this.ctx.lineWidth = style.width;
        
        // Animate active connections
        if (state === 'active') {
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineDashOffset = -((Date.now() / 100) % 20);
        } else {
            this.ctx.setLineDash([5, 5]);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw arrow
        const angle = Math.atan2(targetComp.y - sourceComp.y, targetComp.x - sourceComp.x);
        const arrowLength = 15;
        const arrowWidth = 8;

        this.ctx.beginPath();
        this.ctx.moveTo(
            targetComp.x - arrowLength * Math.cos(angle),
            targetComp.y - arrowLength * Math.sin(angle)
        );
        this.ctx.lineTo(
            targetComp.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
            targetComp.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
        );
        this.ctx.lineTo(targetComp.x, targetComp.y);
        this.ctx.lineTo(
            targetComp.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
            targetComp.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
        );
        this.ctx.closePath();
        
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.fill();
    }

    updateConfigPanel(component) {
        const configPanel = document.getElementById('component-config');
        configPanel.innerHTML = '';
        if (component) {
            const form = this.configManager.generateConfigForm(component);
            configPanel.appendChild(form);
        }
    }

    saveSimulation() {
        const state = {
            components: Array.from(this.components.entries()),
            connections: Array.from(this.connections)
        };
        localStorage.setItem('ztns-simulation', JSON.stringify(state));
    }

    loadSimulation() {
        const saved = localStorage.getItem('ztns-simulation');
        if (saved) {
            const state = JSON.parse(saved);
            this.components = new Map(state.components);
            this.connections = new Set(state.connections);
            this.render();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new ZTNSimulator();
});
