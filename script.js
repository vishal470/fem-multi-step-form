// Form State Management
class FormState {
    constructor() {
        this.currentStep = 1;
        this.personalInfo = {
            name: '',
            email: '',
            phone: ''
        };
        this.planSelection = {
            plan: null,
            billing: 'monthly'
        };
        this.addOns = {
            'online-service': false,
            'larger-storage': false,
            'customizable-profile': false
        };
    }

    updatePersonalInfo(field, value) {
        this.personalInfo[field] = value;
    }

    setPlan(plan) {
        this.planSelection.plan = plan;
    }

    setBilling(billing) {
        this.planSelection.billing = billing;
        this.updatePricingDisplay();
    }

    toggleAddOn(addon) {
        this.addOns[addon] = !this.addOns[addon];
    }

    calculateTotal() {
        const plans = {
            arcade: { monthly: 9, yearly: 90 },
            advanced: { monthly: 12, yearly: 120 },
            pro: { monthly: 15, yearly: 150 }
        };

        const addOnPrices = {
            'online-service': { monthly: 1, yearly: 10 },
            'larger-storage': { monthly: 2, yearly: 20 },
            'customizable-profile': { monthly: 2, yearly: 20 }
        };

        let total = 0;
        
        if (this.planSelection.plan) {
            total += plans[this.planSelection.plan][this.planSelection.billing];
        }

        Object.keys(this.addOns).forEach(addon => {
            if (this.addOns[addon]) {
                total += addOnPrices[addon][this.planSelection.billing];
            }
        });

        return total;
    }

    updatePricingDisplay() {
        const billing = this.planSelection.billing;
        
        // Update plan prices
        document.querySelectorAll('.plan-card').forEach(card => {
            const priceElement = card.querySelector('.plan-price');
            const bonusElement = card.querySelector('.plan-bonus');
            
            if (billing === 'yearly') {
                priceElement.textContent = priceElement.dataset.yearly;
                bonusElement.style.display = 'block';
            } else {
                priceElement.textContent = priceElement.dataset.monthly;
                bonusElement.style.display = 'none';
            }
        });

        // Update addon prices
        document.querySelectorAll('.addon-price').forEach(price => {
            price.textContent = billing === 'yearly' ? price.dataset.yearly : price.dataset.monthly;
        });
    }
}

// Form Validator
class FormValidator {
    static validateName(value) {
        return value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
    }

    static validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    static validatePhone(value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    }
}

// Step Navigator
class StepNavigator {
    constructor(formState) {
        this.formState = formState;
        this.totalSteps = 4;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Next button - determines current step from active element
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const currentStep = this.getCurrentStep();
                this.nextStep(currentStep);
            });
        }

        // Back button - determines current step from active element
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                const currentStep = this.getCurrentStep();
                this.goToStep(currentStep - 1);
            });
        }

        // Confirm button
        const confirmButton = document.getElementById('confirm-button');
        if (confirmButton) {
            confirmButton.addEventListener('click', () => this.showThankYou());
        }

        // Change plan button
        const changePlanButton = document.getElementById('change-plan');
        if (changePlanButton) {
            changePlanButton.addEventListener('click', () => this.goToStep(2));
        }
    }

    getCurrentStep() {
        // Determine current step from active step element
        const activeStep = document.querySelector('.step-content.active');
        if (activeStep && activeStep.id) {
            const stepMatch = activeStep.id.match(/step-(\d+)/);
            if (stepMatch) {
                return parseInt(stepMatch[1]);
            }
        }
        return this.formState.currentStep;
    }

    nextStep(currentStep) {
        if (this.validateCurrentStep(currentStep)) {
            if (currentStep < this.totalSteps) {
                this.goToStep(currentStep + 1);
            }
        }
    }

    goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        document.getElementById(`step-${stepNumber}`).classList.add('active');

        // Update progress indicators
        this.updateProgressIndicators(stepNumber);

        this.formState.currentStep = stepNumber;

        // Update summary if going to step 4
        if (stepNumber === 4) {
            this.updateSummary();
        }
    }

    updateProgressIndicators(currentStep) {
        for (let i = 1; i <= this.totalSteps; i++) {
            const indicator = document.getElementById(`step-indicator-${i}`);
            indicator.classList.remove('active', 'completed');
            
            if (i === currentStep) {
                indicator.classList.add('active');
            } else if (i < currentStep) {
                indicator.classList.add('completed');
            }
        }
    }

    validateCurrentStep(step) {
        switch (step) {
            case 1:
                return this.validatePersonalInfo();
            case 2:
                return this.validatePlanSelection();
            case 3:
                return true; // Add-ons are optional
            default:
                return true;
        }
    }

    validatePersonalInfo() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        let isValid = true;

        // Validate name
        if (!FormValidator.validateName(name)) {
            this.showError('name', 'Please enter a valid name');
            isValid = false;
        } else {
            this.clearError('name');
            this.formState.updatePersonalInfo('name', name);
        }

        // Validate email
        if (!FormValidator.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearError('email');
            this.formState.updatePersonalInfo('email', email);
        }

        // Validate phone
        if (!FormValidator.validatePhone(phone)) {
            this.showError('phone', 'Please enter a valid phone number');
            isValid = false;
        } else {
            this.clearError('phone');
            this.formState.updatePersonalInfo('phone', phone);
        }

        return isValid;
    }

    validatePlanSelection() {
        if (this.formState.planSelection.plan === null) {
            this.showPlanError('Please select a plan to continue');
            return false;
        }
        this.clearPlanError();
        return true;
    }

    showPlanError(message) {
        const errorDiv = document.getElementById('plan-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearPlanError() {
        const errorDiv = document.getElementById('plan-error');
        errorDiv.style.display = 'none';
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}-error`);
        
        field.classList.add('is-invalid');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(`${fieldId}-error`);
        
        field.classList.remove('is-invalid');
        errorDiv.style.display = 'none';
    }

    updateSummary() {
        const planNames = {
            arcade: 'Arcade',
            advanced: 'Advanced',
            pro: 'Pro'
        };

        const billingText = this.formState.planSelection.billing === 'monthly' ? 'Monthly' : 'Yearly';
        const planName = planNames[this.formState.planSelection.plan];
        
        // Update plan summary
        document.getElementById('selected-plan-summary').textContent = `${planName} (${billingText})`;
        
        // Update plan price
        const planPrices = {
            arcade: { monthly: '$9/mo', yearly: '$90/yr' },
            advanced: { monthly: '$12/mo', yearly: '$120/yr' },
            pro: { monthly: '$15/mo', yearly: '$150/yr' }
        };
        
        document.getElementById('plan-price-summary').textContent = 
            planPrices[this.formState.planSelection.plan][this.formState.planSelection.billing];

        // Update add-ons summary
        this.updateAddonsSummary();

        // Update total
        const total = this.formState.calculateTotal();
        const suffix = this.formState.planSelection.billing === 'monthly' ? '/mo' : '/yr';
        document.getElementById('total-price').textContent = `$${total}${suffix}`;
        
        const totalLabel = this.formState.planSelection.billing === 'monthly' ? 'Total (per month)' : 'Total (per year)';
        document.getElementById('total-label').textContent = totalLabel;
    }

    updateAddonsSummary() {
        const addonsContainer = document.getElementById('addons-summary');
        addonsContainer.innerHTML = '';

        const addonNames = {
            'online-service': 'Online service',
            'larger-storage': 'Larger storage',
            'customizable-profile': 'Customizable profile'
        };

        const addonPrices = {
            'online-service': { monthly: '+$1/mo', yearly: '+$10/yr' },
            'larger-storage': { monthly: '+$2/mo', yearly: '+$20/yr' },
            'customizable-profile': { monthly: '+$2/mo', yearly: '+$20/yr' }
        };

        Object.keys(this.formState.addOns).forEach(addon => {
            if (this.formState.addOns[addon]) {
                const addonDiv = document.createElement('div');
                addonDiv.className = 'addon-summary-item';
                addonDiv.innerHTML = `
                    <span class="addon-summary-name">${addonNames[addon]}</span>
                    <span class="addon-summary-price">${addonPrices[addon][this.formState.planSelection.billing]}</span>
                `;
                addonsContainer.appendChild(addonDiv);
            }
        });
    }

    showThankYou() {
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('thank-you').classList.add('active');
        
        // Hide progress indicators on thank you page
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });
    }
}

// Plan Selection Handler
class PlanSelectionHandler {
    constructor(formState) {
        this.formState = formState;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Plan card selection
        document.querySelectorAll('.plan-card').forEach(card => {
            card.addEventListener('click', () => {
                const plan = card.dataset.plan;
                this.selectPlan(plan);
            });
        });

        // Billing toggle
        document.getElementById('billing-toggle').addEventListener('click', () => {
            this.toggleBilling();
        });
    }

    selectPlan(plan) {
        // Remove selection from all cards
        document.querySelectorAll('.plan-card').forEach(card => {
            card.classList.remove('selected');
            card.setAttribute('aria-checked', 'false');
        });

        // Add selection to clicked card
        const selectedCard = document.querySelector(`[data-plan="${plan}"]`);
        selectedCard.classList.add('selected');
        selectedCard.setAttribute('aria-checked', 'true');

        // Update form state
        this.formState.setPlan(plan);
    }

    toggleBilling() {
        const toggle = document.getElementById('billing-toggle');
        const monthlyLabel = document.getElementById('monthly-label');
        const yearlyLabel = document.getElementById('yearly-label');

        if (this.formState.planSelection.billing === 'monthly') {
            // Switch to yearly
            this.formState.setBilling('yearly');
            toggle.classList.add('yearly');
            monthlyLabel.classList.remove('active');
            yearlyLabel.classList.add('active');
        } else {
            // Switch to monthly
            this.formState.setBilling('monthly');
            toggle.classList.remove('yearly');
            monthlyLabel.classList.add('active');
            yearlyLabel.classList.remove('active');
        }
    }
}

// Add-ons Handler
class AddOnsHandler {
    constructor(formState) {
        this.formState = formState;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.addon-item').forEach(item => {
            item.addEventListener('click', () => {
                const addon = item.dataset.addon;
                this.toggleAddon(addon);
            });
        });
    }

    toggleAddon(addon) {
        const item = document.querySelector(`[data-addon="${addon}"]`);
        
        // Toggle selection state
        if (this.formState.addOns[addon]) {
            item.classList.remove('selected');
            item.setAttribute('aria-checked', 'false');
        } else {
            item.classList.add('selected');
            item.setAttribute('aria-checked', 'true');
        }

        // Update form state
        this.formState.toggleAddOn(addon);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    const formState = new FormState();
    const stepNavigator = new StepNavigator(formState);
    const planSelectionHandler = new PlanSelectionHandler(formState);
    const addOnsHandler = new AddOnsHandler(formState);

    // Real-time validation for personal info
    ['name', 'email', 'phone'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', () => {
            stepNavigator.clearError(fieldId);
        });
    });

    // Initialize default plan selection (optional)
    // planSelectionHandler.selectPlan('arcade');
});