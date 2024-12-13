export class Tutorial {
    static steps = [
        {
            title: 'Welcome to ZTNS',
            content: 'This tutorial will guide you through creating your first Zero Trust Network simulation.',
            target: null
        },
        {
            title: 'Component Palette',
            content: 'Drag components from here to build your network.',
            target: '.component-palette'
        },
        {
            title: 'Simulation Canvas',
            content: 'Drop components here and connect them by clicking between components.',
            target: '.simulation-canvas'
        },
        {
            title: 'Configuration Panel',
            content: 'Click any component to configure its settings.',
            target: '.configuration-panel'
        },
        {
            title: 'Controls',
            content: 'Use these buttons to start, pause, and reset your simulation.',
            target: '.simulation-controls'
        }
    ];

    constructor() {
        this.currentStep = 0;
        this.overlay = null;
        this.tooltip = null;
    }

    start() {
        this.createOverlay();
        this.showStep(0);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => this.nextStep();
        
        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip Tutorial';
        skipButton.onclick = () => this.end();
        
        this.tooltip.appendChild(skipButton);
        this.tooltip.appendChild(nextButton);
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
    }

    showStep(index) {
        const step = Tutorial.steps[index];
        if (!step) {
            this.end();
            return;
        }

        this.tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-buttons">
                <button onclick="window.tutorial.end()">Skip</button>
                <button onclick="window.tutorial.nextStep()">
                    ${index === Tutorial.steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        `;

        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                this.tooltip.style.top = `${rect.bottom + 10}px`;
                this.tooltip.style.left = `${rect.left}px`;
                element.classList.add('tutorial-highlight');
            }
        } else {
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
    }

    nextStep() {
        const currentTarget = Tutorial.steps[this.currentStep].target;
        if (currentTarget) {
            document.querySelector(currentTarget)?.classList.remove('tutorial-highlight');
        }
        this.currentStep++;
        this.showStep(this.currentStep);
    }

    end() {
        this.overlay?.remove();
        this.tooltip?.remove();
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }
}
