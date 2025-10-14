// API Integration for WorkforceTransformer Universal
// Connects frontend with FastAPI backend

const API_BASE_URL = 'http://localhost:8000';

class WorkforceAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        return await this.makeRequest('/health');
    }

    // Skills assessment
    async assessSkills(assessmentData) {
        return await this.makeRequest('/api/assess', {
            method: 'POST',
            body: JSON.stringify(assessmentData)
        });
    }

    // Career transition prediction
    async predictTransition(employeeId, targetIndustry) {
        return await this.makeRequest(`/api/transition/${employeeId}/${targetIndustry}`);
    }
}

// Initialize API instance
const workforceAPI = new WorkforceAPI();

// Enhanced assessment function that uses real API
async function handleUniversalAssessmentWithAPI() {
    console.log('Processing universal skills assessment with API...');
    
    const currentIndustry = document.getElementById('currentIndustry').value;
    const targetIndustry = document.getElementById('targetIndustry').value;
    const experience = document.getElementById('experience').value;
    
    // Get selected skills
    const selectedSkills = Array.from(document.querySelectorAll('.skill-checkbox input:checked'))
        .map(checkbox => checkbox.value);
    
    // Prepare API request data
    const assessmentData = {
        current_industry: currentIndustry,
        target_industry: targetIndustry || null,
        experience_years: experience,
        skills: selectedSkills,
        education_level: "bachelor",
        certifications: []
    };
    
    try {
        // Show loading state
        showLoadingState();
        
        // Call API
        const apiResults = await workforceAPI.assessSkills(assessmentData);
        
        // Use API results directly (they now match our expected format)
        const results = {
            overallScore: apiResults.overall_score,
            transitionOpportunities: apiResults.transition_opportunities.map(opp => ({
                title: `${currentIndustry} → ${opp.role}`,
                compatibility: Math.round(opp.match_score * 100),
                salaryChange: 15000,
                trainingTime: 8,
                description: `High potential for ${opp.role} role in ${opp.industry}`
            })),
            recommendations: apiResults.recommendations,
            learningPath: generateLearningPathFromAPI(apiResults.skill_gaps, currentIndustry, targetIndustry),
            currentIndustry,
            targetIndustry,
            skillDetails: apiResults.skill_details || []
        };
        
        // Display results
        displayUniversalResults(results);
        
        // Hide loading state
        hideLoadingState();
        
        // Show success message
        showSuccessMessage('AI assessment completed successfully!');
        
    } catch (error) {
        console.error('Assessment API call failed:', error);
        
        // Fallback to local calculation
        const fallbackResults = calculateUniversalAssessment(currentIndustry, targetIndustry, experience, selectedSkills);
        displayUniversalResults(fallbackResults);
        
        // Hide loading state
        hideLoadingState();
        
        // Show error message
        showErrorMessage('API temporarily unavailable. Using offline assessment.');
    }
}

// Generate learning path from API results
function generateLearningPathFromAPI(skillGaps, currentIndustry, targetIndustry) {
    const path = [];
    
    // Add modules based on skill gaps
    skillGaps.forEach((gap, index) => {
        if (index < 3) { // Limit to top 3 gaps
            path.push(`${gap.skill} Training (${gap.priority === 'high' ? '4' : '6'} weeks)`);
        }
    });
    
    // Add industry transition if needed
    if (targetIndustry && currentIndustry !== targetIndustry) {
        path.push(`Industry Transition: ${currentIndustry} → ${targetIndustry} (6 weeks)`);
    }
    
    // Add general modules
    path.push("Professional Development Workshop (2 weeks)");
    
    return path.slice(0, 5); // Limit to 5 steps
}

// Loading state functions
function showLoadingState() {
    const resultsContainer = document.getElementById('universalAssessmentResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <h3>🤖 AI Analysis in Progress</h3>
                <p>Analyzing your skills across industries...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Loading state will be replaced by results
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-text">${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-text">${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Test API connection on page load (single status message)
document.addEventListener('DOMContentLoaded', async function() {
    // Remove duplicate status messages - only show one
    const existingStatus = document.querySelector('.api-status');
    if (existingStatus) return;
    
    try {
        const health = await workforceAPI.checkHealth();
        console.log('API connection successful:', health);
        showAPIStatus(true);
    } catch (error) {
        console.warn('API connection failed:', error);
        showAPIStatus(false);
    }
});

function showAPIStatus(isConnected) {
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `api-status ${isConnected ? 'connected' : 'disconnected'}`;
    statusIndicator.innerHTML = `
        <span class="status-dot"></span>
        <span class="status-text">${isConnected ? 'AI Backend Connected' : 'Offline Mode'}</span>
    `;
    
    // Add to navigation
    const navbar = document.querySelector('.navbar .container');
    if (navbar) {
        navbar.appendChild(statusIndicator);
    }
}

// Override the original assessment function
if (typeof handleUniversalAssessment === 'function') {
    // Replace the original function with API-enabled version
    const originalAssessment = handleUniversalAssessment;
    handleUniversalAssessment = handleUniversalAssessmentWithAPI;
}

// Add CSS for new elements
const apiStyles = `
<style id="api-integration-styles">
    .loading-state {
        text-align: center;
        padding: 2rem;
        background: var(--color-bg-1);
        border-radius: var(--radius-base);
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--color-bg-3);
        border-top: 4px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 1rem;
        border-radius: var(--radius-base);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 1rem;
        border-radius: var(--radius-base);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .error-content, .success-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .api-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-base);
        font-size: 0.875rem;
        margin-left: auto;
    }
    
    .api-status.connected {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }
    
    .api-status.disconnected {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
    
    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', apiStyles);
