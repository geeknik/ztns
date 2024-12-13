// Main application class
class ZTNSimulator {
    constructor() {
        this.canvas = document.getElementById('network-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.components = new Map();
        this.connections = new Set();
        this.isSimulationRunning = false;

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
        // Reset simulation state
        this.render();
    }

    simulationLoop() {
        if (!this.isSimulationRunning) return;

        // Update simulation state
        this.updateSimulation();
        this.render();

        requestAnimationFrame(() => this.simulationLoop());
    }

    updateSimulation() {
        // Update component states and interactions
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => this.drawConnection(connection));

        // Draw components
        this.components.forEach(component => this.drawComponent(component));
    }

    drawComponent(component) {
        // Component styles based on type
        const styles = {
            'identity-provider': { color: '#e74c3c', icon: '🔐' },
            'policy-engine': { color: '#2ecc71', icon: '⚖️' },
            'resource': { color: '#f1c40f', icon: '📦' },
            'client': { color: '#3498db', icon: '💻' },
            'proxy': { color: '#9b59b6', icon: '🔄' }
        };
        
        const style = styles[component.type];
        const radius = 25;

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
        const { source, target } = connection;
        const sourceComp = this.components.get(source);
        const targetComp = this.components.get(target);

        if (!sourceComp || !targetComp) return;

        this.ctx.beginPath();
        this.ctx.moveTo(sourceComp.x, sourceComp.y);
        this.ctx.lineTo(targetComp.x, targetComp.y);
        
        this.ctx.strokeStyle = '#95a5a6';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
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
        configPanel.innerHTML = `
            <h3>${component.type}</h3>
            <pre>${JSON.stringify(component.config, null, 2)}</pre>
        `;
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
