// WorkforceTransformer Universal Application JavaScript

// Global variables and industry data
let selectedIndustry = null;
let progressChart = null;

const industryData = {
    cybersecurity: {
        name: "Cybersecurity",
        icon: "🛡️",
        workforce: 3500000,
        jobsAtRisk: 1050000,
        newJobs: 1575000,
        netChange: 525000,
        avgSalaryIncrease: 17200,
        trainingWeeks: 6,
        roi: 2775,
        maturity: 75
    },
    healthcare: {
        name: "Healthcare",
        icon: "🏥",
        workforce: 18000000,
        jobsAtRisk: 4500000,
        newJobs: 6300000,
        netChange: 1800000,
        avgSalaryIncrease: 12000,
        trainingWeeks: 8,
        roi: 3525,
        maturity: 60
    },
    manufacturing: {
        name: "Manufacturing",
        icon: "🏭",
        workforce: 12800000,
        jobsAtRisk: 5760000,
        newJobs: 4480000,
        netChange: -1280000,
        avgSalaryIncrease: 8500,
        trainingWeeks: 5,
        roi: 3033,
        maturity: 80
    },
    finance: {
        name: "Finance",
        icon: "💰",
        workforce: 9200000,
        jobsAtRisk: 3680000,
        newJobs: 2760000,
        netChange: -920000,
        avgSalaryIncrease: 15000,
        trainingWeeks: 6,
        roi: 3720,
        maturity: 85
    },
    retail: {
        name: "Retail",
        icon: "🛒",
        workforce: 15600000,
        jobsAtRisk: 7800000,
        newJobs: 3900000,
        netChange: -3900000,
        avgSalaryIncrease: 4500,
        trainingWeeks: 3,
        roi: 2750,
        maturity: 70
    },
    education: {
        name: "Education",
        icon: "🎓",
        workforce: 8400000,
        jobsAtRisk: 1680000,
        newJobs: 3360000,
        netChange: 1680000,
        avgSalaryIncrease: 9800,
        trainingWeeks: 10,
        roi: 2586,
        maturity: 45
    },
    logistics: {
        name: "Logistics",
        icon: "📦",
        workforce: 5800000,
        jobsAtRisk: 3190000,
        newJobs: 1740000,
        netChange: -1450000,
        avgSalaryIncrease: 6200,
        trainingWeeks: 4,
        roi: 2620,
        maturity: 75
    },
    legal: {
        name: "Legal",
        icon: "⚖️",
        workforce: 1400000,
        jobsAtRisk: 490000,
        newJobs: 350000,
        netChange: -140000,
        avgSalaryIncrease: 22000,
        trainingWeeks: 12,
        roi: 3733,
        maturity: 55
    }
};

const crossSectorSkills = [
    'data-analysis', 'ai-ml', 'digital-literacy', 'process-automation',
    'human-ai-collaboration', 'critical-thinking', 'adaptability', 
    'communication', 'project-management', 'ethical-decision'
];

const emergingRoles = [
    'AI Ethics Specialist',
    'Human-Machine Interface Designer', 
    'Automation Implementation Manager',
    'Cross-Industry Data Analyst',
    'Digital Transformation Consultant',
    'Workforce Transition Coordinator',
    'AI Training Specialist',
    'Process Intelligence Analyst',
    'Predictive Analytics Manager',
    'Change Management Facilitator'
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing WorkforceTransformer Universal...');
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupIndustryCards();
    setupUniversalAssessment();
    setupTrainingModules();
    setupROISimulator();
    setupAnimations();
    setupIntersectionObserver();
    initializeDynamicCounters();
    initializeProgressChart();
    console.log('Universal platform initialized successfully');
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollToSection(targetId);
                updateActiveNavLink(this);
            }
        });
    });
    
    // Setup hero buttons
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Start Universal Assessment')) {
                scrollToSection('assessment');
            } else if (this.textContent.includes('Explore Industries')) {
                scrollToSection('industries');
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 80;
        const targetPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Industry Cards Setup
function setupIndustryCards() {
    const industryCards = document.querySelectorAll('.industry-card');
    
    // Setup maturity bar animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const maturityFill = entry.target.querySelector('.maturity-fill');
                if (maturityFill) {
                    const targetWidth = maturityFill.getAttribute('data-width');
                    setTimeout(() => {
                        maturityFill.style.width = targetWidth + '%';
                    }, 500);
                    entry.target.dataset.animated = 'true';
                }
            }
        });
    }, { threshold: 0.5 });

    industryCards.forEach(card => observer.observe(card));
}

function selectIndustry(industry) {
    console.log('Selecting industry:', industry);
    
    // Update selected industry
    selectedIndustry = industry;
    
    // Update UI
    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.industry === industry) {
            card.classList.add('selected');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // Show industry-specific insights
    showIndustryInsights(industry);
}

function showIndustryInsights(industry) {
    const data = industryData[industry];
    if (!data) return;
    
    const modal = createModal(
        `${data.icon} ${data.name} Industry Insights`,
        `
        <div class="industry-insights">
            <div class="insight-grid">
                <div class="insight-item">
                    <h4>Workforce Impact</h4>
                    <p><strong>${(data.workforce / 1000000).toFixed(1)}M</strong> total workforce</p>
                    <p><strong>${data.netChange > 0 ? '+' : ''}${(data.netChange / 1000).toFixed(0)}K</strong> net job change</p>
                </div>
                <div class="insight-item">
                    <h4>Economic Benefits</h4>
                    <p><strong>+$${data.avgSalaryIncrease.toLocaleString()}</strong> avg salary increase</p>
                    <p><strong>${data.roi}%</strong> ROI potential</p>
                </div>
                <div class="insight-item">
                    <h4>Training Efficiency</h4>
                    <p><strong>${data.trainingWeeks} weeks</strong> with AI acceleration</p>
                    <p><strong>${data.maturity}%</strong> automation maturity</p>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn btn--primary" onclick="closeModal(); scrollToSection('assessment')">
                    Start ${data.name} Assessment
                </button>
                <button class="btn btn--outline" onclick="closeModal(); scrollToSection('training')">
                    View Training Programs
                </button>
            </div>
        </div>
        `
    );
    
    document.body.appendChild(modal);
}

// Universal Skills Assessment
function setupUniversalAssessment() {
    const assessmentForm = document.getElementById('universalSkillsForm');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUniversalAssessment();
        });
    }
    
    // Setup checkbox interactions
    const checkboxes = document.querySelectorAll('.skill-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.skill-checkbox');
            if (this.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });
    });
}

function handleUniversalAssessment() {
    console.log('Processing universal skills assessment...');
    
    const currentIndustry = document.getElementById('currentIndustry').value;
    const targetIndustry = document.getElementById('targetIndustry').value;
    const experience = document.getElementById('experience').value;
    
    // Get selected skills
    const selectedSkills = Array.from(document.querySelectorAll('.skill-checkbox input:checked'))
        .map(checkbox => checkbox.value);
    
    // Calculate assessment results
    const results = calculateUniversalAssessment(currentIndustry, targetIndustry, experience, selectedSkills);
    displayUniversalResults(results);
}

function calculateUniversalAssessment(currentIndustry, targetIndustry, experience, skills) {
    // Scoring algorithm
    let baseScore = 0;
    
    // Experience scoring
    const experienceScores = { '0-2': 20, '3-5': 40, '6-10': 70, '10+': 90 };
    baseScore += experienceScores[experience] || 20;
    
    // Skills scoring
    baseScore += skills.length * 8;
    
    // Bonus for key cross-sector skills
    if (skills.includes('ai-ml')) baseScore += 15;
    if (skills.includes('data-analysis')) baseScore += 12;
    if (skills.includes('process-automation')) baseScore += 10;
    if (skills.includes('human-ai-collaboration')) baseScore += 8;
    
    const overallScore = Math.min(baseScore, 100);
    
    // Generate transition opportunities
    const transitionOpportunities = generateTransitionOpportunities(currentIndustry, targetIndustry, skills, overallScore);
    const recommendations = generateUniversalRecommendations(overallScore, skills, currentIndustry, targetIndustry);
    const learningPath = generateUniversalLearningPath(skills, currentIndustry, targetIndustry);
    
    return {
        overallScore,
        transitionOpportunities,
        recommendations,
        learningPath,
        currentIndustry,
        targetIndustry
    };
}

function generateTransitionOpportunities(currentIndustry, targetIndustry, skills, score) {
    const opportunities = [];
    const currentData = industryData[currentIndustry];
    
    if (targetIndustry && targetIndustry !== currentIndustry) {
        const targetData = industryData[targetIndustry];
        opportunities.push({
            title: `${currentData?.name || 'Current'} → ${targetData.name}`,
            compatibility: calculateCompatibility(currentIndustry, targetIndustry, skills),
            salaryChange: targetData.avgSalaryIncrease - (currentData?.avgSalaryIncrease || 0),
            trainingTime: Math.max(targetData.trainingWeeks, 4),
            description: `Leverage your ${currentData?.name || 'current'} experience in ${targetData.name.toLowerCase()}`
        });
    } else {
        // Show top 3 compatible industries
        const compatibleIndustries = Object.keys(industryData)
            .filter(key => key !== currentIndustry)
            .map(key => ({
                key,
                ...industryData[key],
                compatibility: calculateCompatibility(currentIndustry, key, skills)
            }))
            .sort((a, b) => b.compatibility - a.compatibility)
            .slice(0, 3);
        
        compatibleIndustries.forEach(industry => {
            opportunities.push({
                title: `${currentData?.name || 'Current'} → ${industry.name}`,
                compatibility: industry.compatibility,
                salaryChange: industry.avgSalaryIncrease - (currentData?.avgSalaryIncrease || 0),
                trainingTime: Math.max(industry.trainingWeeks, 4),
                description: `High compatibility based on your skill profile`
            });
        });
    }
    
    return opportunities;
}

function calculateCompatibility(fromIndustry, toIndustry, skills) {
    // Industry compatibility matrix (simplified)
    const compatibilityMatrix = {
        cybersecurity: { healthcare: 80, finance: 85, manufacturing: 60, education: 70, legal: 75 },
        healthcare: { cybersecurity: 75, education: 85, manufacturing: 50, finance: 60 },
        manufacturing: { logistics: 90, cybersecurity: 65, retail: 70 },
        finance: { cybersecurity: 85, legal: 80, retail: 60, logistics: 55 },
        retail: { logistics: 80, manufacturing: 65, education: 60 },
        education: { healthcare: 80, cybersecurity: 70, retail: 55 },
        logistics: { manufacturing: 85, retail: 80, cybersecurity: 60 },
        legal: { finance: 80, cybersecurity: 75, education: 65 }
    };
    
    let baseCompatibility = compatibilityMatrix[fromIndustry]?.[toIndustry] || 50;
    
    // Skill bonuses
    if (skills.includes('ai-ml')) baseCompatibility += 10;
    if (skills.includes('data-analysis')) baseCompatibility += 8;
    if (skills.includes('process-automation')) baseCompatibility += 6;
    
    return Math.min(baseCompatibility, 95);
}

function generateUniversalRecommendations(score, skills, currentIndustry, targetIndustry) {
    const recommendations = [];
    
    if (score < 40) {
        recommendations.push("🎯 Focus on foundational digital literacy skills");
        recommendations.push("📚 Complete AI Fundamentals Bootcamp");
        recommendations.push("🔧 Develop basic process automation understanding");
    } else if (score < 70) {
        recommendations.push("🚀 Advance to intermediate cross-sector skills");
        recommendations.push("📊 Pursue Cross-Sector Data Science certification");
        recommendations.push("🤖 Explore industry-specific AI applications");
    } else {
        recommendations.push("🏆 Ready for leadership roles in automation");
        recommendations.push("🌟 Consider emerging roles like AI Ethics Specialist");
        recommendations.push("🎓 Pursue advanced cross-industry certifications");
    }
    
    // Industry-specific recommendations
    if (targetIndustry && currentIndustry !== targetIndustry) {
        const targetData = industryData[targetIndustry];
        recommendations.push(`⚡ ${targetData.name} offers ${targetData.avgSalaryIncrease > 10000 ? 'high' : 'moderate'} salary growth potential`);
        recommendations.push(`📈 Training time: ${targetData.trainingWeeks} weeks with AI acceleration`);
    }
    
    // Skill gap recommendations
    const criticalSkills = ['ai-ml', 'data-analysis', 'process-automation'];
    const missingCritical = criticalSkills.filter(skill => !skills.includes(skill));
    
    missingCritical.forEach(skill => {
        const skillNames = {
            'ai-ml': 'AI/ML Fundamentals',
            'data-analysis': 'Data Analysis',
            'process-automation': 'Process Automation'
        };
        recommendations.push(`⭐ High priority: Develop ${skillNames[skill]} skills`);
    });
    
    return recommendations;
}

function generateUniversalLearningPath(skills, currentIndustry, targetIndustry) {
    const path = [];
    
    // Always start with fundamentals if missing
    if (!skills.includes('ai-ml')) {
        path.push("AI Fundamentals Bootcamp (4 weeks)");
    }
    
    if (!skills.includes('data-analysis')) {
        path.push("Cross-Sector Data Science (8 weeks)");
    }
    
    // Add industry transition if needed
    if (targetIndustry && currentIndustry !== targetIndustry) {
        path.push(`Industry Transition Bridge: ${industryData[currentIndustry]?.name || 'Current'} → ${industryData[targetIndustry].name} (6 weeks)`);
    }
    
    // Add specialized skills
    if (!skills.includes('process-automation')) {
        path.push("Process Automation Mastery (5 weeks)");
    }
    
    if (skills.length >= 7) {
        path.push("Leadership in Digital Transformation (8 weeks)");
    }
    
    // Add emerging role preparation
    path.push("Emerging Roles Preparation Workshop (2 weeks)");
    
    return path.slice(0, 5); // Limit to 5 steps
}

function displayUniversalResults(results) {
    console.log('Displaying universal assessment results:', results);
    
    const scoreElement = document.getElementById('universalOverallScore');
    const transitionElement = document.getElementById('transitionOpportunities');
    const recommendationsElement = document.getElementById('universalRecommendations');
    const learningPathElement = document.getElementById('universalLearningPath');
    
    // Animate score
    animateScore(scoreElement, results.overallScore);
    
    // Display transition opportunities
    transitionElement.innerHTML = `
        <h4>🌟 Career Transition Opportunities</h4>
        <div class="transition-list">
            ${results.transitionOpportunities.map(opportunity => `
                <div class="opportunity-card">
                    <h5>${opportunity.title}</h5>
                    <div class="opportunity-stats">
                        <span class="compatibility">Compatibility: ${opportunity.compatibility}%</span>
                        <span class="salary-change">Salary Impact: ${opportunity.salaryChange > 0 ? '+' : ''}$${Math.abs(opportunity.salaryChange).toLocaleString()}</span>
                        <span class="training-time">Training: ${opportunity.trainingTime} weeks</span>
                    </div>
                    <p>${opportunity.description}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Display recommendations
    recommendationsElement.innerHTML = `
        <h4>🤖 AI-Powered Recommendations</h4>
        <ul class="recommendations-list">
            ${results.recommendations.map(rec => `
                <li class="recommendation-item">${rec}</li>
            `).join('')}
        </ul>
    `;
    
    // Display learning path
    learningPathElement.innerHTML = `
        <h4>📚 Personalized Learning Path</h4>
        <div class="learning-steps">
            ${results.learningPath.map((step, index) => `
                <div class="learning-step">
                    <span class="step-number">${index + 1}</span>
                    <span class="step-content">${step}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add CSS for new elements
    if (!document.getElementById('assessment-results-styles')) {
        const styles = `
            <style id="assessment-results-styles">
                .transition-list { display: flex; flex-direction: column; gap: var(--space-12); }
                .opportunity-card { 
                    background: var(--color-bg-1); 
                    padding: var(--space-16); 
                    border-radius: var(--radius-base);
                    border-left: 4px solid var(--color-primary);
                }
                .opportunity-card h5 { margin-bottom: var(--space-8); color: var(--color-text); }
                .opportunity-stats { display: flex; flex-wrap: wrap; gap: var(--space-12); margin-bottom: var(--space-8); }
                .opportunity-stats span { 
                    background: var(--color-secondary); 
                    padding: var(--space-4) var(--space-8); 
                    border-radius: var(--radius-sm); 
                    font-size: var(--font-size-xs);
                }
                .compatibility { color: var(--color-primary); font-weight: var(--font-weight-bold); }
                .salary-change { color: var(--color-success); font-weight: var(--font-weight-bold); }
                .recommendations-list { list-style: none; padding: 0; }
                .recommendation-item { 
                    padding: var(--space-8); 
                    margin-bottom: var(--space-8); 
                    background: var(--color-bg-3); 
                    border-radius: var(--radius-base);
                    border-left: 4px solid var(--color-success);
                }
                .learning-steps { display: flex; flex-direction: column; gap: var(--space-12); }
                .learning-step { 
                    display: flex; 
                    align-items: center; 
                    gap: var(--space-12);
                    padding: var(--space-12);
                    background: var(--color-bg-2);
                    border-radius: var(--radius-base);
                }
                .step-number { 
                    background: var(--color-primary); 
                    color: var(--color-btn-primary-text);
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    font-weight: var(--font-weight-bold);
                    font-size: var(--font-size-sm);
                    flex-shrink: 0;
                }
                .step-content { color: var(--color-text); }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('universalAssessmentResults').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 500);
}

// Training Modules Setup
function setupTrainingModules() {
    // Training module interactions are handled by onclick attributes in HTML
    console.log('Training modules setup complete');
}

function launchTraining(moduleId) {
    const moduleNames = {
        'ai-fundamentals': 'AI Fundamentals Bootcamp',
        'cross-sector-data': 'Cross-Sector Data Science',
        'industry-transition': 'Industry Transition Bridge',
        'automation-leadership': 'Automation Leadership'
    };
    
    const moduleName = moduleNames[moduleId] || 'Training Module';
    
    const modal = createModal(
        `🚀 Launching ${moduleName}`,
        `
        <div class="training-launch">
            <div class="launch-info">
                <p>Your personalized training environment is being prepared for <strong>${moduleName}</strong>.</p>
                
                <div class="module-features">
                    <h4>What's Included:</h4>
                    <ul>
                        <li>🎯 Adaptive learning pathways</li>
                        <li>🤖 AI-powered skill assessment</li>
                        <li>💼 Real-world project simulations</li>
                        <li>📊 Progress tracking and analytics</li>
                        <li>🏆 Industry-recognized certification</li>
                        <li>🤝 Cross-industry mentorship network</li>
                    </ul>
                </div>
                
                <div class="simulation-progress">
                    <div class="progress-bar">
                        <div class="progress-fill launch-progress" data-width="100"></div>
                    </div>
                    <p class="progress-text">Initializing training environment...</p>
                </div>
            </div>
            
            <div class="launch-actions">
                <button class="btn btn--primary" onclick="closeModal()">Continue Learning</button>
            </div>
        </div>
        `
    );
    
    document.body.appendChild(modal);
    
    // Simulate loading progress
    setTimeout(() => {
        const progressFill = modal.querySelector('.launch-progress');
        const progressText = modal.querySelector('.progress-text');
        if (progressFill) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Training environment ready!';
        }
    }, 1000);
}

// Progress Chart Setup
function initializeProgressChart() {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    progressChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Data Analysis',
                'AI/ML Fundamentals', 
                'Digital Literacy',
                'Process Automation',
                'Human-AI Collaboration',
                'Critical Thinking',
                'Adaptability',
                'Communication'
            ],
            datasets: [{
                label: 'Current Skills',
                data: [65, 45, 80, 40, 60, 75, 85, 90],
                backgroundColor: 'rgba(31, 184, 205, 0.2)',
                borderColor: '#1FB8CD',
                borderWidth: 2
            }, {
                label: 'Target Skills',
                data: [90, 85, 95, 80, 85, 90, 95, 95],
                backgroundColor: 'rgba(255, 193, 133, 0.2)',
                borderColor: '#FFC185',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// ROI Simulator Setup
function setupROISimulator() {
    const industrySelect = document.getElementById('roiIndustry');
    const employeeInput = document.getElementById('employeeCount');
    const budgetInput = document.getElementById('trainingBudget');
    
    if (industrySelect && employeeInput && budgetInput) {
        industrySelect.addEventListener('change', calculateUniversalROI);
        employeeInput.addEventListener('input', debounce(calculateUniversalROI, 500));
        budgetInput.addEventListener('input', debounce(calculateUniversalROI, 500));
        
        // Initial calculation
        calculateUniversalROI();
    }
}

function calculateUniversalROI() {
    const industryKey = document.getElementById('roiIndustry')?.value || 'cybersecurity';
    const employeeCount = parseInt(document.getElementById('employeeCount')?.value) || 100;
    const trainingBudget = parseInt(document.getElementById('trainingBudget')?.value) || 250000;
    
    const industry = industryData[industryKey];
    if (!industry) return;
    
    // Calculate costs based on industry data
    const traditionalCostPerPerson = 2500;
    const transformerCostPerPerson = Math.floor(2500 * (100 - industry.roi/100) / 100);
    
    const traditionalTotalCost = employeeCount * traditionalCostPerPerson;
    const transformerTotalCost = employeeCount * transformerCostPerPerson;
    const savings = traditionalTotalCost - transformerTotalCost;
    
    // Update display
    const elements = {
        traditionalCost: document.getElementById('traditionalCost'),
        transformerCost: document.getElementById('transformerCost'), 
        roiPercentage: document.getElementById('roiPercentage'),
        totalSavings: document.getElementById('totalSavings')
    };
    
    if (elements.traditionalCost) elements.traditionalCost.textContent = `$${traditionalTotalCost.toLocaleString()}`;
    if (elements.transformerCost) elements.transformerCost.textContent = `$${transformerTotalCost.toLocaleString()}`;
    if (elements.roiPercentage) elements.roiPercentage.textContent = `${industry.roi}%`;
    if (elements.totalSavings) elements.totalSavings.textContent = `$${savings.toLocaleString()}`;
    
    console.log('ROI calculated for', industry.name, ':', { traditionalTotalCost, transformerTotalCost, savings });
}

// Animation and UI Setup
function setupAnimations() {
    const cards = document.querySelectorAll('.industry-card, .training-card, .analytics-card, .impact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.classList.add('fade-in-up');
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
}

function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Dynamic counters for hero stats
function initializeDynamicCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.dataset.target);
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                counter.textContent = (current / 1000).toFixed(1) + 'K';
            } else {
                counter.textContent = Math.round(current);
            }
        }, 30);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Utility Functions
function animateScore(element, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 50;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentScore);
    }, 30);
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const modalStyles = `
            <style id="modal-styles">
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center;
                    z-index: 2000; animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-card-border);
                    max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;
                    animation: scaleIn 0.3s ease; box-shadow: var(--shadow-lg);
                }
                .modal-header {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: var(--space-20); border-bottom: 1px solid var(--color-border);
                }
                .modal-header h3 { margin: 0; color: var(--color-text); }
                .modal-close {
                    background: none; border: none; font-size: var(--font-size-xl); color: var(--color-text-secondary);
                    cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
                    border-radius: var(--radius-base); transition: background-color var(--duration-fast) var(--ease-standard);
                }
                .modal-close:hover { background: var(--color-secondary); color: var(--color-text); }
                .modal-body { padding: var(--space-20); }
                .modal-body p { margin: 0 0 var(--space-16) 0; color: var(--color-text); line-height: var(--line-height-normal); }
                .industry-insights .insight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-16); margin-bottom: var(--space-20); }
                .insight-item h4 { color: var(--color-primary); margin-bottom: var(--space-8); }
                .action-buttons { display: flex; gap: var(--space-12); justify-content: center; }
                .training-launch .module-features ul { padding-left: var(--space-20); }
                .training-launch .module-features li { margin-bottom: var(--space-4); color: var(--color-text); }
                .simulation-progress { margin: var(--space-20) 0; }
                .progress-bar { width: 100%; height: 8px; background: var(--color-secondary); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-8); }
                .progress-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 2s var(--ease-standard); width: 0; }
                .progress-text { text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm); }
                .launch-actions { display: flex; justify-content: center; margin-top: var(--space-20); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function debounce(func, wait) {
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

// Keyboard and click outside modal handling
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.selectIndustry = selectIndustry;
window.launchTraining = launchTraining;
window.calculateUniversalROI = calculateUniversalROI;
window.closeModal = closeModal;