// Component configuration form generator and handler
export class ComponentConfigManager {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
    }

    generateConfigForm(component) {
        const form = document.createElement('form');
        form.className = 'config-form';
        form.addEventListener('submit', (e) => e.preventDefault());
        
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
            const errorSpan = document.createElement('span');
            errorSpan.className = 'field-error';
            
            input.addEventListener('change', (e) => {
                let value = e.target.value;
                if (field.type === 'array') {
                    value = Array.from(e.target.selectedOptions).map(opt => opt.value);
                } else if (field.type === 'number') {
                    value = Number(value);
                }
                
                // Validate the input
                const error = field.validation?.(value);
                if (error) {
                    errorSpan.textContent = error;
                    input.classList.add('invalid');
                    return;
                }
                
                errorSpan.textContent = '';
                input.classList.remove('invalid');
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
                    options: ['certificate', 'token', 'password', 'biometric'],
                    required: true,
                    validation: (value) => value.length > 0 ? null : 'At least one auth method is required'
                },
                sessionTimeout: {
                    type: 'number',
                    min: 300,
                    max: 86400,
                    required: true,
                    validation: (value) => {
                        if (value < 300) return 'Session timeout must be at least 300 seconds';
                        if (value > 86400) return 'Session timeout cannot exceed 86400 seconds';
                        return null;
                    }
                }
            },
            'policy-engine': {
                defaultAction: {
                    type: 'select',
                    options: ['allow', 'deny'],
                    required: true,
                    validation: (value) => ['allow', 'deny'].includes(value) ? null : 'Invalid default action'
                },
                rules: {
                    type: 'array',
                    options: ['ip-based', 'time-based', 'role-based', 'device-based'],
                    required: true,
                    validation: (value) => value.length > 0 ? null : 'At least one policy rule must be selected'
                }
            },
            'resource': {
                accessLevel: {
                    type: 'select',
                    options: ['public', 'restricted', 'confidential'],
                    required: true,
                    validation: (value) => ['public', 'restricted', 'confidential'].includes(value) ? null : 'Invalid access level'
                },
                protocols: {
                    type: 'array',
                    options: ['https', 'ssh', 'sftp'],
                    required: true,
                    validation: (value) => value.length > 0 ? null : 'At least one protocol must be selected'
                }
            },
            'client': {
                trustLevel: {
                    type: 'number',
                    min: 0,
                    max: 100,
                    required: true,
                    validation: (value) => {
                        if (value < 0) return 'Trust level cannot be negative';
                        if (value > 100) return 'Trust level cannot exceed 100';
                        return null;
                    }
                }
            },
            'proxy': {
                mode: {
                    type: 'select',
                    options: ['reverse', 'forward'],
                    required: true,
                    validation: (value) => ['reverse', 'forward'].includes(value) ? null : 'Invalid proxy mode'
                },
                tlsVersion: {
                    type: 'select',
                    options: ['1.2', '1.3'],
                    required: true,
                    validation: (value) => ['1.2', '1.3'].includes(value) ? null : 'Invalid TLS version'
                }
            }
        };

        return fields[type] || {};
    }
}
