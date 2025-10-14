// Enhanced ROI Calculator with API Integration
class ROICalculator {
    constructor() {
        this.apiBase = 'http://localhost:8000';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Look for the ROI calculate button by ID or specific text content
        const calculateBtn = document.querySelector('#analyzeSkillsBtn') || 
                           document.querySelector('#calculateROIBtn') ||
                           document.querySelector('button[onclick*="calculateUniversalROI"]');
        
        if (calculateBtn) {
            console.log('✅ Found calculate button:', calculateBtn);
            calculateBtn.onclick = (e) => {
                e.preventDefault();
                this.calculateROI();
            };
        } else {
            console.warn('⚠️ Could not find calculate button');
        }

        // Auto-calculate on input changes
        const inputs = ['roiIndustry', 'employeeCount', 'trainingBudget'];
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.calculateROI());
                element.addEventListener('input', this.debounce(() => this.calculateROI(), 500));
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async calculateROI() {
        const industry = document.getElementById('roiIndustry')?.value || 'cybersecurity';
        const employeeCount = parseInt(document.getElementById('employeeCount')?.value) || 100;
        const trainingBudget = parseFloat(document.getElementById('trainingBudget')?.value) || 250000;
        const currentAvgSalary = 75000; // Default value

        console.log('🧮 Calculating ROI:', { 
            industry, 
            employeeCount, 
            trainingBudget, 
            currentAvgSalary 
        });

        try {
            // Show loading state
            this.showROILoading();

            // Call API
            const response = await fetch(`${this.apiBase}/api/roi/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    industry: industry,
                    employee_count: Number(employeeCount),
                    training_budget: Number(trainingBudget),
                    current_avg_salary: Number(currentAvgSalary)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ ROI Data:', data);

            // Display results
            this.displayROIResults(data);

        } catch (error) {
            console.error('❌ ROI Calculation Failed:', error);
            
            // Fallback calculation with all required parameters
            const fallbackData = this.calculateFallbackROI(
                industry, 
                employeeCount, 
                trainingBudget,
                75000 // Default salary for fallback
            );
            this.displayROIResults(fallbackData);
            
            this.showROIError('Using offline calculation. ' + (error.message || ''));
        }
    }

    calculateFallbackROI(industry, employeeCount, trainingBudget, currentAvgSalary = 75000) {
        const industryMultipliers = {
            'cybersecurity': 2.8,
            'healthcare': 3.5,
            'manufacturing': 3.0,
            'finance': 3.7,
            'retail': 2.7,
            'education': 2.6,
            'logistics': 2.6,
            'legal': 3.7
        };

        // Ensure all values are numbers
        employeeCount = Number(employeeCount) || 100;
        trainingBudget = Number(trainingBudget) || 250000;
        currentAvgSalary = Number(currentAvgSalary) || 75000;

        const multiplier = industryMultipliers[industry] || 2.5;
        const traditionalCost = employeeCount * 2500;
        const aiEnhancedCost = traditionalCost * 0.7; // 30% reduction
        const costSavings = traditionalCost - aiEnhancedCost;
        const roiPercentage = multiplier * 100;

        return {
            traditional_cost: traditionalCost,
            ai_enhanced_cost: aiEnhancedCost,
            cost_savings: costSavings,
            roi_percentage: roiPercentage,
            payback_months: Math.max(1, Math.round(aiEnhancedCost / (costSavings / 12))),
            productivity_increase: roiPercentage
        };
    }

    showROILoading() {
        const resultsContainer = this.getROIResultsContainer();
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="roi-loading">
                    <div class="loading-spinner"></div>
                    <p>Calculating ROI...</p>
                </div>
            `;
        }
    }

    displayROIResults(data) {
        // Update individual result elements
        const elements = {
            traditionalCost: document.getElementById('traditionalCost'),
            transformerCost: document.getElementById('transformerCost') || document.getElementById('aiEnhancedCost'),
            roiPercentage: document.getElementById('roiPercentage'),
            totalSavings: document.getElementById('totalSavings') || document.getElementById('costSavings'),
            paybackMonths: document.getElementById('paybackMonths')
        };

        // Update elements if they exist
        if (elements.traditionalCost) {
            elements.traditionalCost.textContent = `$${data.traditional_cost.toLocaleString()}`;
        }
        if (elements.transformerCost) {
            elements.transformerCost.textContent = `$${data.ai_enhanced_cost.toLocaleString()}`;
        }
        if (elements.roiPercentage) {
            elements.roiPercentage.textContent = `${data.roi_percentage.toFixed(1)}%`;
        }
        if (elements.totalSavings) {
            elements.totalSavings.textContent = `$${data.cost_savings.toLocaleString()}`;
        }
        if (elements.paybackMonths) {
            elements.paybackMonths.textContent = `${data.payback_months} months`;
        }

        // Also update the ROI results container if it exists
        const resultsContainer = this.getROIResultsContainer();
        if (resultsContainer && !elements.traditionalCost) {
            const _roi_html = `
                <div class="roi-results">
                    <div class="roi-metric">
                        <span class="metric-label">Traditional Cost:</span>
                        <span class="metric-value">$${data.traditional_cost.toLocaleString()}</span>
                    </div>
                    <div class="roi-metric">
                        <span class="metric-label">AI-Enhanced Cost:</span>
                        <span class="metric-value">$${data.ai_enhanced_cost.toLocaleString()}</span>
                    </div>
                    <div class="roi-metric highlight">
                        <span class="metric-label">ROI Percentage:</span>
                        <span class="metric-value">${data.roi_percentage.toFixed(1)}%</span>
                    </div>
                    <div class="roi-metric">
                        <span class="metric-label">Total Savings:</span>
                        <span class="metric-value">$${data.cost_savings.toLocaleString()}</span>
                    </div>
                    <div class="roi-metric">
                        <span class="metric-label">Payback Period:</span>
                        <span class="metric-value">${data.payback_months} months</span>
                    </div>
                </div>
            `;
            resultsContainer.innerHTML = _roi_html;
            // If showFinalROI helper exists, use it to stop loading animation and ensure visibility
            if (typeof showFinalROI === 'function') {
                try { showFinalROI(_roi_html); } catch(e) { /* ignore */ }
            }
        }
        console.log('📊 ROI Results Updated');
    }

    getROIResultsContainer() {
        return document.getElementById('roiResults') || 
               document.querySelector('.roi-results') ||
               document.querySelector('.roi-simulator');
    }

    showROIError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'roi-error';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span>${message}</span>
        `;
        errorDiv.style.cssText = `
            position: fixed; top: 80px; right: 20px; background: #ff9800; 
            color: white; padding: 10px; border-radius: 5px; z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Enhanced assessment timing
function enhanceAssessmentTiming() {
    const originalAssessment = window.handleAssessmentWithDebug || window.handleUniversalAssessment;
    
    if (originalAssessment) {
        window.handleUniversalAssessment = async function() {
            const startTime = Date.now();
            console.log('⏱️ Assessment started at:', new Date().toLocaleTimeString());
            
            // Show timing in loading state
            const loadingContainer = document.getElementById('universalAssessmentResults');
            if (loadingContainer) {
                const updateTiming = () => {
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                    const statusElement = document.getElementById('loadingStatus');
                    if (statusElement && statusElement.textContent.includes('...')) {
                        statusElement.textContent += ` (${elapsed}s)`;
                    }
                };
                
                const timingInterval = setInterval(updateTiming, 1000);
                setTimeout(() => clearInterval(timingInterval), 10000);
            }
            
            try {
                await originalAssessment();
                const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`✅ Assessment completed in ${duration} seconds`);
                
                // Show completion time
                setTimeout(() => {
                    const successMsg = document.createElement('div');
                    successMsg.style.cssText = `
                        position: fixed; bottom: 20px; right: 20px; 
                        background: #4caf50; color: white; padding: 10px; 
                        border-radius: 5px; z-index: 1000;
                    `;
                    successMsg.textContent = `Analysis completed in ${duration}s`;
                    document.body.appendChild(successMsg);
                    setTimeout(() => successMsg.remove(), 3000);
                }, 500);
                
            } catch (error) {
                const duration = ((Date.now() - startTime) / 1000).toFixed(1);
                console.error(`❌ Assessment failed after ${duration} seconds:`, error);
            }
        };
    }
}

// Initialize ROI Calculator and timing enhancements
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧮 Initializing ROI Calculator');
    
    // Initialize the ROI Calculator
    const roiCalculator = new ROICalculator();
    
    // Make it globally available for direct calls from HTML
    window.calculateUniversalROI = function() {
        roiCalculator.calculateROI();
        return false; // Prevent form submission
    };
    
    // Enhance assessment timing
    setTimeout(enhanceAssessmentTiming, 1000);
    
    // Initial ROI calculation
    setTimeout(() => roiCalculator.calculateROI(), 2000);
    
    console.log('✅ ROI Calculator Ready');
});

// Add CSS for ROI calculator
const roiStyles = `
<style id="roi-calculator-styles">
    .roi-loading {
        text-align: center;
        padding: 20px;
        color: #666;
    }
    
    .roi-results {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 20px;
    }
    
    .roi-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
        border-left: 4px solid #007bff;
    }
    
    .roi-metric.highlight {
        background: #e8f5e8;
        border-left-color: #28a745;
        font-weight: bold;
    }
    
    .metric-label {
        font-weight: 500;
        color: #495057;
    }
    
    .metric-value {
        font-weight: bold;
        color: #007bff;
        font-size: 1.1em;
    }
    
    .roi-metric.highlight .metric-value {
        color: #28a745;
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', roiStyles);




/* --- UI helper: ensure results show immediately --- */
function showLoadingAndPrepareResults() {
  const resultContainer = document.getElementById('roi-results') || document.querySelector('.roi-results') || null;
  if (resultContainer) {
    // Clear previous results and show a loading placeholder
    resultContainer.innerHTML = '<div class="roi-loading" style="padding:16px; text-align:center; color:var(--color-text-secondary);">Calculating... <span style=\"display:inline-block; margin-left:8px;\" class=\"dotdot\">●</span></div>';
    // simple dot animation
    let dots = 0;
    if (!resultContainer._dotInterval) {
      resultContainer._dotInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        const d = '●'.repeat(dots);
        const el = resultContainer.querySelector('.dotdot');
        if (el) el.textContent = d;
      }, 400);
    }
  }
}

function showFinalROI(htmlContent) {
  const resultContainer = document.getElementById('roi-results') || document.querySelector('.roi-results') || null;
  if (resultContainer) {
    // stop animation
    if (resultContainer._dotInterval) { clearInterval(resultContainer._dotInterval); resultContainer._dotInterval = null; }
    resultContainer.innerHTML = htmlContent;
  }
}

/* Attach to calculate buttons if present */
document.addEventListener('click', function(e) {
  const target = e.target || e.srcElement;
  if (target && (target.id === 'calculate-roi' || target.classList.contains('calculate-roi') || target.matches('[data-action="calculate-roi"]'))) {
    // show immediate feedback
    showLoadingAndPrepareResults();
  }
}, true);

