export class Packet {
    constructor(source, target, type = 'request') {
        this.source = source;
        this.target = target;
        this.type = type; // request, response, auth, etc
        this.x = 0;
        this.y = 0;
        this.progress = 0;
    }

    update() {
        if (this.progress < 1) {
            this.progress += 0.02;
        }
        return this.progress >= 1;
    }

    getPosition(components) {
        const sourceComp = components.get(this.source);
        const targetComp = components.get(this.target);
        
        if (!sourceComp || !targetComp) return null;

        this.x = sourceComp.x + (targetComp.x - sourceComp.x) * this.progress;
        this.y = sourceComp.y + (targetComp.y - sourceComp.y) * this.progress;
        
        return { x: this.x, y: this.y };
    }
}
