// Frontend API Integration for WorkforceTransformer Universal
// This file handles all communication between the frontend and backend API

const API_BASE_URL = 'http://localhost:8000/api';

class WorkforceTransformerAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                headers: this.headers
            };

            if (data && method !== 'GET') {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Skills Assessment API
    async assessSkills(assessmentData) {
        return await this.makeRequest('/assess-skills', 'POST', assessmentData);
    }

    // Career Transition API
    async predictTransition(transitionData) {
        return await this.makeRequest('/predict-transition', 'POST', transitionData);
    }

    // ROI Calculator API
    async calculateROI(roiData) {
        return await this.makeRequest('/calculate-roi', 'POST', roiData);
    }

    // Training Recommendations API
    async getTrainingRecommendations(trainingData) {
        return await this.makeRequest('/training-recommendations', 'POST', trainingData);
    }

    // Job Market Analytics API
    async getJobMarketAnalytics(industry) {
        return await this.makeRequest(`/job-market/${industry}`);
    }

    // Skills Gap Analysis API
    async getSkillsGapAnalysis() {
        return await this.makeRequest('/skills-gap-analysis');
    }

    // Health Check API
    async getHealthStatus() {
        return await this.makeRequest('/health');
    }

    // Export Industry Data API
    async exportIndustryData(industry) {
        return await this.makeRequest(`/export/industry-data/${industry}`);
    }

    // Automation Status API
    async getAutomationStatus() {
        return await this.makeRequest('/automation/status');
    }

    // Trigger Automation Tasks
    async triggerAutomatedAssessment() {
        return await this.makeRequest('/automation/trigger-assessment', 'POST');
    }

    async updateMarketData() {
        return await this.makeRequest('/automation/update-market-data', 'POST');
    }
}

// Initialize API instance
const api = new WorkforceTransformerAPI();

// Enhanced Skills Assessment Function
async function handleUniversalAssessmentEnhanced() {
    console.log('Processing enhanced universal skills assessment...');
    
    const currentIndustry = document.getElementById('currentIndustry').value;
    const targetIndustry = document.getElementById('targetIndustry').value;
    const experience = document.getElementById('experience').value;
    
    // Get selected skills
    const selectedSkills = Array.from(document.querySelectorAll('.skill-checkbox input:checked'))
        .map(checkbox => checkbox.value);
    
    // Show loading state
    showLoadingState('universalAssessmentResults');
    
    try {
        const assessmentData = {
            current_industry: currentIndustry,
            target_industry: targetIndustry || null,
            experience_years: experience,
            skills: selectedSkills,
            education_level: "bachelor",
            certifications: []
        };

        const results = await api.assessSkills(assessmentData);
        displayEnhancedResults(results);
        
        // Store results for future reference
        localStorage.setItem('lastAssessment', JSON.stringify(results));
        
    } catch (error) {
        console.error('Assessment failed:', error);
        showErrorState('universalAssessmentResults', 'Assessment failed. Please try again.');
    }
}

// Enhanced Results Display
function displayEnhancedResults(results) {
    const scoreElement = document.getElementById('universalOverallScore');
    const transitionElement = document.getElementById('transitionOpportunities');
    const recommendationsElement = document.getElementById('universalRecommendations');
    const learningPathElement = document.getElementById('universalLearningPath');
    
    // Animate score
    animateScore(scoreElement, results.overall_score);
    
    // Display transition opportunities with enhanced data
    transitionElement.innerHTML = `
        <h4>🌟 AI-Powered Career Transition Opportunities</h4>
        <div class="transition-list">
            ${results.transition_opportunities.map(opportunity => `
                <div class="opportunity-card enhanced">
                    <h5>${opportunity.title}</h5>
                    <div class="opportunity-stats">
                        <span class="compatibility">Success Rate: ${opportunity.compatibility}%</span>
                        <span class="salary-change">Salary Impact: ${opportunity.salaryChange > 0 ? '+' : ''}$${Math.abs(opportunity.salaryChange).toLocaleString()}</span>
                        <span class="training-time">Training: ${opportunity.trainingTime} weeks</span>
                    </div>
                    <p>${opportunity.description}</p>
                    <div class="opportunity-actions">
                        <button class="btn btn--sm btn--primary" onclick="exploreTransition('${opportunity.title}')">
                            Explore Path
                        </button>
                        <button class="btn btn--sm btn--outline" onclick="saveOpportunity('${opportunity.title}')">
                            Save for Later
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Display AI-powered recommendations
    recommendationsElement.innerHTML = `
        <h4>🤖 AI-Powered Recommendations</h4>
        <ul class="recommendations-list enhanced">
            ${results.recommendations.map(rec => `
                <li class="recommendation-item">
                    ${rec}
                    <div class="recommendation-actions">
                        <button class="btn btn--xs btn--outline" onclick="getMoreInfo('${rec}')">Learn More</button>
                    </div>
                </li>
            `).join('')}
        </ul>
        <div class="salary-projection">
            <h5>💰 Salary Projection</h5>
            <div class="salary-stats">
                <div class="salary-item">
                    <span class="label">Current Estimate:</span>
                    <span class="value">$${results.salary_projection.current_estimate.toLocaleString()}</span>
                </div>
                <div class="salary-item">
                    <span class="label">With Training:</span>
                    <span class="value success">$${results.salary_projection.with_training.toLocaleString()}</span>
                </div>
                <div class="salary-item">
                    <span class="label">Potential Increase:</span>
                    <span class="value primary">+$${results.salary_projection.increase.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    // Display personalized learning path
    learningPathElement.innerHTML = `
        <h4>📚 AI-Personalized Learning Path</h4>
        <div class="learning-timeline">
            ${results.learning_path.map((step, index) => `
                <div class="timeline-step">
                    <div class="step-marker">${index + 1}</div>
                    <div class="step-content">
                        <h6>${step.course}</h6>
                        <div class="step-meta">
                            <span class="duration">${step.duration_weeks} weeks</span>
                            <span class="difficulty ${step.difficulty.toLowerCase()}">${step.difficulty}</span>
                            <span class="priority ${step.priority.toLowerCase()}">${step.priority} Priority</span>
                        </div>
                        <div class="step-actions">
                            <button class="btn btn--xs btn--primary" onclick="startCourse('${step.course}')">
                                Start Course
                            </button>
                            <button class="btn btn--xs btn--outline" onclick="getCourseDetails('${step.course}')">
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="timeline-summary">
            <p><strong>Estimated Timeline:</strong> ${results.estimated_timeline} weeks</p>
            <button class="btn btn--primary" onclick="createLearningPlan()">Create My Learning Plan</button>
        </div>
    `;
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('universalAssessmentResults').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 500);
}

// Enhanced ROI Calculator
async function calculateUniversalROIEnhanced() {
    const industryKey = document.getElementById('roiIndustry')?.value || 'cybersecurity';
    const employeeCount = parseInt(document.getElementById('employeeCount')?.value) || 100;
    const trainingBudget = parseInt(document.getElementById('trainingBudget')?.value) || 250000;
    
    try {
        const roiData = {
            industry: industryKey,
            employee_count: employeeCount,
            training_budget: trainingBudget,
            current_productivity_score: 70.0
        };

        const roiResults = await api.calculateROI(roiData);
        displayROIResults(roiResults);
        
    } catch (error) {
        console.error('ROI calculation failed:', error);
        showErrorMessage('ROI calculation failed. Please try again.');
    }
}

function displayROIResults(results) {
    // Update existing ROI display elements
    const elements = {
        traditionalCost: document.getElementById('traditionalCost'),
        transformerCost: document.getElementById('transformerCost'), 
        roiPercentage: document.getElementById('roiPercentage'),
        totalSavings: document.getElementById('totalSavings')
    };
    
    if (elements.traditionalCost) elements.traditionalCost.textContent = `$${results.cost_breakdown.total_cost.toLocaleString()}`;
    if (elements.transformerCost) elements.transformerCost.textContent = `$${results.cost_breakdown.training_cost.toLocaleString()}`;
    if (elements.roiPercentage) elements.roiPercentage.textContent = `${results.roi_percentage}%`;
    if (elements.totalSavings) elements.totalSavings.textContent = `$${results.annual_savings.toLocaleString()}`;
    
    // Add enhanced ROI visualization
    createROIVisualization(results);
}

// Real-time Job Market Updates
async function updateJobMarketData() {
    try {
        const industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal'];
        
        for (const industry of industries) {
            const marketData = await api.getJobMarketAnalytics(industry);
            updateIndustryCard(industry, marketData);
        }
        
        showSuccessMessage('Job market data updated successfully!');
        
    } catch (error) {
        console.error('Market data update failed:', error);
        showErrorMessage('Failed to update job market data.');
    }
}

function updateIndustryCard(industry, marketData) {
    const card = document.querySelector(`[data-industry="${industry}"]`);
    if (card) {
        // Update demand score
        const demandElement = card.querySelector('.demand-score');
        if (demandElement) {
            demandElement.textContent = `${marketData.job_demand.toFixed(1)}/10`;
        }
        
        // Update salary trends
        const salaryElement = card.querySelector('.salary-trend');
        if (salaryElement) {
            salaryElement.textContent = `$${marketData.salary_trends.current_avg.toLocaleString()}`;
        }
        
        // Add visual indicator for growth
        const growthIndicator = card.querySelector('.growth-indicator') || document.createElement('div');
        growthIndicator.className = 'growth-indicator';
        growthIndicator.innerHTML = `
            <span class="growth-rate ${marketData.growth_projection > 10 ? 'high' : marketData.growth_projection > 5 ? 'medium' : 'low'}">
                ${marketData.growth_projection > 0 ? '↗' : '↘'} ${Math.abs(marketData.growth_projection).toFixed(1)}%
            </span>
        `;
        
        if (!card.querySelector('.growth-indicator')) {
            card.appendChild(growthIndicator);
        }
    }
}

// Utility Functions
function showLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Processing your assessment with AI...</p>
            </div>
        `;
    }
}

function showErrorState(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
                <button class="btn btn--outline" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">❌</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Enhanced interaction functions
function exploreTransition(transitionTitle) {
    console.log(`Exploring transition: ${transitionTitle}`);
    // Implementation for detailed transition exploration
}

function saveOpportunity(opportunityTitle) {
    const savedOpportunities = JSON.parse(localStorage.getItem('savedOpportunities') || '[]');
    savedOpportunities.push({
        title: opportunityTitle,
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedOpportunities', JSON.stringify(savedOpportunities));
    showSuccessMessage('Opportunity saved to your profile!');
}

function startCourse(courseName) {
    console.log(`Starting course: ${courseName}`);
    // Implementation for course enrollment
    showSuccessMessage(`Enrolled in ${courseName}!`);
}

function createLearningPlan() {
    const assessment = JSON.parse(localStorage.getItem('lastAssessment') || '{}');
    if (assessment.learning_path) {
        localStorage.setItem('myLearningPlan', JSON.stringify(assessment.learning_path));
        showSuccessMessage('Learning plan created! Check your dashboard.');
    }
}

// Initialize enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    // Override existing assessment function
    const assessmentForm = document.getElementById('universalSkillsForm');
    if (assessmentForm) {
        assessmentForm.removeEventListener('submit', handleUniversalAssessment);
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUniversalAssessmentEnhanced();
        });
    }
    
    // Add real-time updates
    setInterval(updateJobMarketData, 300000); // Update every 5 minutes
    
    // Initialize WebSocket connection for real-time updates
    initializeWebSocket();
});

// WebSocket for real-time updates
function initializeWebSocket() {
    const ws = new WebSocket('ws://localhost:8000/ws');
    
    ws.onopen = function(event) {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
    };
    
    ws.onclose = function(event) {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(initializeWebSocket, 5000);
    };
}

function handleRealTimeUpdate(data) {
    if (data.type === 'market_update') {
        updateJobMarketData();
    } else if (data.type === 'assessment_complete') {
        showSuccessMessage('New assessment insights available!');
    }
}

// Export API instance for global use
window.WorkforceAPI = api;
