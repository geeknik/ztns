// Component configuration form generator and handler
export class ComponentConfigManager {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
    }

    generateConfigForm(component) {
        const form = document.createElement('form');
        form.className = 'config-form';
        
        // Add component type header
        const header = document.createElement('h3');
        header.textContent = component.type.replace('-', ' ').toUpperCase();
        form.appendChild(header);

        // Generate form fields based on component type
        const fields = this.getConfigFields(component.type);
        
        Object.entries(fields).forEach(([key, field]) => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'form-field';

            const label = document.createElement('label');
            label.textContent = this.formatLabel(key);
            
            let input;
            
            switch (field.type) {
                case 'select':
                    input = document.createElement('select');
                    field.options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        opt.selected = component.config[key] === option;
                        input.appendChild(opt);
                    });
                    break;
                    
                case 'array':
                    input = document.createElement('select');
                    input.multiple = true;
                    field.options.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        opt.selected = component.config[key]?.includes(option);
                        input.appendChild(opt);
                    });
                    break;

                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.value = component.config[key];
                    input.min = field.min;
                    input.max = field.max;
                    break;

                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = component.config[key];
            }

            input.id = `config-${key}`;
            input.addEventListener('change', (e) => {
                let value = e.target.value;
                if (field.type === 'array') {
                    value = Array.from(e.target.selectedOptions).map(opt => opt.value);
                } else if (field.type === 'number') {
                    value = Number(value);
                }
                
                component.config[key] = value;
                this.updateCallback(component);
            });

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            form.appendChild(fieldContainer);
        });

        return form;
    }

    formatLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    getConfigFields(type) {
        const fields = {
            'identity-provider': {
                authMethods: {
                    type: 'array',
                    options: ['certificate', 'token', 'password', 'biometric']
                },
                sessionTimeout: {
                    type: 'number',
                    min: 300,
                    max: 86400
                }
            },
            'policy-engine': {
                defaultAction: {
                    type: 'select',
                    options: ['allow', 'deny']
                }
            },
            'resource': {
                accessLevel: {
                    type: 'select',
                    options: ['public', 'restricted', 'confidential']
                },
                protocols: {
                    type: 'array',
                    options: ['https', 'ssh', 'sftp']
                }
            },
            'client': {
                trustLevel: {
                    type: 'number',
                    min: 0,
                    max: 100
                }
            },
            'proxy': {
                mode: {
                    type: 'select',
                    options: ['reverse', 'forward']
                },
                tlsVersion: {
                    type: 'select',
                    options: ['1.2', '1.3']
                }
            }
        };

        return fields[type] || {};
    }
}
