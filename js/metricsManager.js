export class MetricsManager {
    constructor() {
        this.metrics = {
            totalPackets: 0,
            activeConnections: 0,
            authRequests: 0,
            deniedAccess: 0,
            avgResponseTime: 0,
            totalResponseTimes: [],
        };
    }

    trackPacket(packet) {
        this.metrics.totalPackets++;
        if (packet.type === 'auth') {
            this.metrics.authRequests++;
        }
    }

    updateConnections(connectionCount) {
        this.metrics.activeConnections = connectionCount;
    }

    trackDeniedAccess() {
        this.metrics.deniedAccess++;
    }

    trackResponseTime(time) {
        this.metrics.totalResponseTimes.push(time);
        const sum = this.metrics.totalResponseTimes.reduce((a, b) => a + b, 0);
        this.metrics.avgResponseTime = sum / this.metrics.totalResponseTimes.length;
    }

    getMetricsHTML() {
        return `
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${this.metrics.totalPackets}</div>
                    <div class="metric-label">Total Packets</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${this.metrics.activeConnections}</div>
                    <div class="metric-label">Active Connections</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${this.metrics.authRequests}</div>
                    <div class="metric-label">Auth Requests</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${this.metrics.deniedAccess}</div>
                    <div class="metric-label">Access Denied</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${this.metrics.avgResponseTime.toFixed(2)}ms</div>
                    <div class="metric-label">Avg Response Time</div>
                </div>
            </div>
        `;
    }

    reset() {
        this.metrics = {
            totalPackets: 0,
            activeConnections: 0,
            authRequests: 0,
            deniedAccess: 0,
            avgResponseTime: 0,
            totalResponseTimes: [],
        };
    }
}
