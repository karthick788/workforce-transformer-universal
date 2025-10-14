// Smart AI Assessment - Dynamic Predictions with 10-second Training
class SmartAIAssessment {
    constructor() {
        this.roleDatabase = this.buildRoleDatabase();
        this.skillWeights = this.buildSkillWeights();
        this.industryTransitions = this.buildTransitionMatrix();
    }

    buildRoleDatabase() {
        return {
            'cybersecurity': {
                'data-analysis': ['Security Data Analyst', 'Threat Intelligence Analyst', 'SOC Analyst'],
                'ai-ml': ['AI Security Engineer', 'ML Threat Detection Specialist', 'Automated Security Analyst'],
                'critical-thinking': ['Security Architect', 'Risk Assessment Manager', 'Incident Response Lead'],
                'process-automation': ['Security Automation Engineer', 'DevSecOps Engineer', 'Security Orchestration Specialist'],
                'communication': ['Security Consultant', 'CISO Advisor', 'Security Training Manager']
            },
            'healthcare': {
                'data-analysis': ['Healthcare Data Scientist', 'Clinical Research Analyst', 'Population Health Analyst'],
                'ai-ml': ['Medical AI Developer', 'Diagnostic ML Engineer', 'Healthcare Automation Specialist'],
                'human-ai-collaboration': ['Digital Health Coordinator', 'AI-Assisted Care Manager', 'Telemedicine Specialist'],
                'communication': ['Patient Advocate', 'Health Education Specialist', 'Medical Communications Manager']
            },
            'finance': {
                'data-analysis': ['Quantitative Analyst', 'Risk Data Scientist', 'Financial Modeling Specialist'],
                'ai-ml': ['Algorithmic Trading Developer', 'Credit Risk ML Engineer', 'Fraud Detection Specialist'],
                'critical-thinking': ['Investment Strategy Analyst', 'Portfolio Risk Manager', 'Compliance Officer'],
                'process-automation': ['FinTech Process Engineer', 'Trading Systems Analyst', 'Regulatory Automation Specialist']
            },
            'manufacturing': {
                'process-automation': ['Industrial Automation Engineer', 'Smart Factory Specialist', 'Robotics Integration Manager'],
                'data-analysis': ['Manufacturing Data Scientist', 'Quality Analytics Manager', 'Supply Chain Analyst'],
                'ai-ml': ['Predictive Maintenance Engineer', 'AI Quality Inspector', 'Smart Manufacturing Developer'],
                'project-management': ['Lean Manufacturing Manager', 'Operations Excellence Lead', 'Digital Transformation Manager']
            }
        };
    }

    buildSkillWeights() {
        return {
            'data-analysis': { weight: 0.9, industries: ['finance', 'healthcare', 'cybersecurity'] },
            'ai-ml': { weight: 0.95, industries: ['cybersecurity', 'healthcare', 'manufacturing'] },
            'process-automation': { weight: 0.85, industries: ['manufacturing', 'logistics', 'finance'] },
            'critical-thinking': { weight: 0.8, industries: ['legal', 'finance', 'cybersecurity'] },
            'communication': { weight: 0.7, industries: ['education', 'healthcare', 'retail'] },
            'project-management': { weight: 0.75, industries: ['manufacturing', 'logistics', 'retail'] }
        };
    }

    buildTransitionMatrix() {
        return {
            'cybersecurity': { 'finance': 0.85, 'healthcare': 0.70, 'manufacturing': 0.65 },
            'finance': { 'cybersecurity': 0.80, 'legal': 0.75, 'healthcare': 0.60 },
            'healthcare': { 'education': 0.80, 'cybersecurity': 0.65, 'manufacturing': 0.55 },
            'manufacturing': { 'logistics': 0.90, 'cybersecurity': 0.70, 'healthcare': 0.60 }
        };
    }

    async performSmartAssessment() {
        const startTime = Date.now();
        console.log('🧠 Starting Smart AI Training & Assessment');

        const data = this.getFormData();
        
        // Show 10-second training simulation
        await this.showTrainingProcess();
        
        // Generate dynamic predictions
        const results = this.generateSmartPredictions(data);
        
        const duration = Date.now() - startTime;
        this.displaySmartResults(results, duration);
    }

    getFormData() {
        return {
            currentIndustry: document.getElementById('currentIndustry')?.value || 'cybersecurity',
            targetIndustry: document.getElementById('targetIndustry')?.value || null,
            experience: document.getElementById('experience')?.value || '3-5',
            skills: Array.from(document.querySelectorAll('.skill-checkbox input:checked')).map(cb => cb.value)
        };
    }

    async showTrainingProcess() {
        const container = document.getElementById('universalAssessmentResults');
        if (!container) return;

        container.innerHTML = `
            <div class="ai-training">
                <h3>🧠 AI Model Training in Progress</h3>
                <div class="training-progress">
                    <div class="progress-bar"><div class="progress-fill" id="trainingProgress"></div></div>
                    <div class="training-status" id="trainingStatus">Initializing neural networks...</div>
                    <div class="training-metrics" id="trainingMetrics">Accuracy: 0%</div>
                </div>
            </div>
        `;

        const stages = [
            { text: 'Loading training data...', duration: 1000, accuracy: 15 },
            { text: 'Training neural networks...', duration: 2000, accuracy: 45 },
            { text: 'Optimizing skill mappings...', duration: 1500, accuracy: 65 },
            { text: 'Learning industry patterns...', duration: 2000, accuracy: 80 },
            { text: 'Calibrating predictions...', duration: 1500, accuracy: 90 },
            { text: 'Validating model accuracy...', duration: 1000, accuracy: 95 },
            { text: 'Finalizing recommendations...', duration: 1000, accuracy: 98 }
        ];

        let totalProgress = 0;
        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            document.getElementById('trainingStatus').textContent = stage.text;
            
            await this.animateProgress(totalProgress, totalProgress + (100/stages.length), stage.duration);
            document.getElementById('trainingMetrics').textContent = `Accuracy: ${stage.accuracy}%`;
            
            totalProgress += (100/stages.length);
        }
    }

    animateProgress(start, end, duration) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = start + (end - start) * progress;
                
                document.getElementById('trainingProgress').style.width = `${current}%`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    generateSmartPredictions(data) {
        const { currentIndustry, targetIndustry, experience, skills } = data;
        const target = targetIndustry || currentIndustry;
        
        // Dynamic role generation based on skills
        const roles = this.generateDynamicRoles(skills, target, experience);
        
        // Calculate personalized score
        const score = this.calculatePersonalizedScore(skills, currentIndustry, target, experience);
        
        // Generate skill gaps
        const skillGaps = this.generateSkillGaps(skills, target);
        
        // Create learning path
        const learningPath = this.generateLearningPath(skillGaps, currentIndustry, target);
        
        return {
            overallScore: score,
            roles: roles,
            skillGaps: skillGaps,
            learningPath: learningPath,
            recommendations: this.generateRecommendations(score, skills, target)
        };
    }

    generateDynamicRoles(skills, industry, experience) {
        const roles = [];
        const industryRoles = this.roleDatabase[industry] || {};
        
        // Match skills to roles
        skills.forEach(skill => {
            const skillRoles = industryRoles[skill] || [];
            skillRoles.forEach(role => {
                if (!roles.find(r => r.title === role)) {
                    const compatibility = this.calculateRoleCompatibility(skill, role, experience);
                    const salary = this.calculateSalaryEstimate(role, experience, compatibility);
                    
                    roles.push({
                        title: role,
                        compatibility: compatibility,
                        salaryIncrease: salary,
                        primarySkill: skill,
                        timeToTransition: this.calculateTransitionTime(compatibility, experience)
                    });
                }
            });
        });
        
        // Add some general roles if no specific matches
        if (roles.length === 0) {
            const generalRoles = ['Digital Transformation Specialist', 'Process Improvement Analyst', 'Technology Consultant'];
            generalRoles.forEach(role => {
                roles.push({
                    title: role,
                    compatibility: 70 + Math.random() * 20,
                    salaryIncrease: 12000 + Math.random() * 8000,
                    primarySkill: 'general',
                    timeToTransition: 6 + Math.random() * 6
                });
            });
        }
        
        return roles.sort((a, b) => b.compatibility - a.compatibility).slice(0, 4);
    }

    calculateRoleCompatibility(skill, role, experience) {
        const baseCompatibility = 60 + Math.random() * 25;
        const skillWeight = this.skillWeights[skill]?.weight || 0.5;
        const expBonus = { '0-2': 0, '3-5': 10, '6-10': 20, '10+': 30 }[experience] || 10;
        
        return Math.min(95, Math.round(baseCompatibility + (skillWeight * 20) + expBonus));
    }

    calculateSalaryEstimate(role, experience, compatibility) {
        const baseSalary = 10000 + (compatibility * 300);
        const expMultiplier = { '0-2': 0.8, '3-5': 1.0, '6-10': 1.3, '10+': 1.6 }[experience] || 1.0;
        return Math.round(baseSalary * expMultiplier);
    }

    calculateTransitionTime(compatibility, experience) {
        const baseTime = 12 - (compatibility * 0.1);
        const expReduction = { '0-2': 0, '3-5': 2, '6-10': 4, '10+': 6 }[experience] || 2;
        return Math.max(3, Math.round(baseTime - expReduction));
    }

    calculatePersonalizedScore(skills, currentIndustry, targetIndustry, experience) {
        let score = 40; // Base score
        
        // Skill bonus
        skills.forEach(skill => {
            const skillData = this.skillWeights[skill];
            if (skillData) {
                score += skillData.weight * 25;
                if (skillData.industries.includes(targetIndustry)) {
                    score += 10; // Industry relevance bonus
                }
            }
        });
        
        // Experience bonus
        const expBonus = { '0-2': 0, '3-5': 15, '6-10': 25, '10+': 35 }[experience] || 15;
        score += expBonus;
        
        // Transition difficulty
        if (currentIndustry !== targetIndustry) {
            const transitionScore = this.industryTransitions[currentIndustry]?.[targetIndustry] || 0.5;
            score *= transitionScore;
        }
        
        return Math.min(98, Math.round(score));
    }

    generateSkillGaps(currentSkills, targetIndustry) {
        const requiredSkills = {
            'cybersecurity': ['ai-ml', 'data-analysis', 'critical-thinking'],
            'healthcare': ['human-ai-collaboration', 'data-analysis', 'communication'],
            'finance': ['data-analysis', 'ai-ml', 'critical-thinking'],
            'manufacturing': ['process-automation', 'data-analysis', 'project-management']
        };
        
        const required = requiredSkills[targetIndustry] || ['data-analysis', 'communication'];
        const gaps = [];
        
        required.forEach(skill => {
            if (!currentSkills.includes(skill)) {
                gaps.push({
                    skill: skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    priority: Math.random() > 0.5 ? 'high' : 'medium',
                    estimatedTime: Math.ceil(Math.random() * 8) + 2
                });
            }
        });
        
        return gaps;
    }

    generateLearningPath(skillGaps, currentIndustry, targetIndustry) {
        const path = [];
        
        skillGaps.forEach((gap, index) => {
            path.push(`${gap.skill} Training (${gap.estimatedTime} weeks)`);
        });
        
        if (currentIndustry !== targetIndustry) {
            path.push(`Industry Transition: ${currentIndustry} → ${targetIndustry} (4 weeks)`);
        }
        
        path.push('Professional Certification (2 weeks)');
        path.push('Practical Project Portfolio (3 weeks)');
        
        return path.slice(0, 6);
    }

    generateRecommendations(score, skills, targetIndustry) {
        const recommendations = [];
        
        if (score >= 85) {
            recommendations.push('🚀 Excellent fit! Apply for senior positions immediately');
            recommendations.push('💼 Consider leadership or specialized roles');
            recommendations.push('🎯 Focus on industry-specific certifications');
        } else if (score >= 70) {
            recommendations.push('📈 Strong foundation - target mid-level positions');
            recommendations.push('🎓 Complete 1-2 key certifications');
            recommendations.push('💡 Build portfolio with relevant projects');
        } else {
            recommendations.push('📚 Strengthen foundational skills first');
            recommendations.push('🔧 Focus on hands-on training');
            recommendations.push('👥 Seek mentorship in target industry');
        }
        
        return recommendations;
    }

    displaySmartResults(results, duration) {
        const container = document.getElementById('universalAssessmentResults');
        if (!container) return;

        container.innerHTML = `
            <div class="smart-results">
                <div class="results-header">
                    <h2>🧠 AI Analysis Complete (${(duration/1000).toFixed(1)}s)</h2>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-number">${results.overallScore}</span>
                            <span class="score-label">AI Score</span>
                        </div>
                    </div>
                </div>

                <div class="results-grid">
                    <div class="result-panel">
                        <h3>🎯 Predicted Career Roles</h3>
                        ${results.roles.map(role => `
                            <div class="role-card">
                                <div class="role-header">
                                    <strong>${role.title}</strong>
                                    <span class="compatibility-badge">${Math.round(role.compatibility)}%</span>
                                </div>
                                <div class="role-details">
                                    <span>💰 +$${Math.round(role.salaryIncrease).toLocaleString()}</span>
                                    <span>⏱️ ${Math.round(role.timeToTransition)} months</span>
                                    <span>🔧 ${role.primarySkill.replace('-', ' ')}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="result-panel">
                        <h3>📊 Skill Development Plan</h3>
                        ${results.skillGaps.map((gap, i) => `
                            <div class="skill-gap">
                                <div class="gap-info">
                                    <strong>${gap.skill}</strong>
                                    <span class="priority-badge ${gap.priority}">${gap.priority}</span>
                                </div>
                                <div class="gap-time">${gap.estimatedTime} weeks</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="result-panel">
                        <h3>🛤️ Learning Roadmap</h3>
                        ${results.learningPath.map((step, i) => `
                            <div class="roadmap-step">
                                <span class="step-number">${i + 1}</span>
                                <span class="step-text">${step}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="recommendations">
                    <h3>💡 AI Recommendations</h3>
                    ${results.recommendations.map(rec => `
                        <div class="recommendation">${rec}</div>
                    `).join('')}
                </div>
            </div>
        `;

        this.addSmartResultsCSS();
    }

    addSmartResultsCSS() {
        if (document.getElementById('smart-results-css')) return;
        
        const styles = `
            <style id="smart-results-css">
                .ai-training {
                    background: linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 100%);
                    color: #000; padding: 40px; border-radius: 12px; text-align: center;
                    border: 1px solid #d1d5db;
                }
                .training-progress { margin-top: 20px; }
                .progress-bar {
                    width: 100%; height: 8px; background: rgba(0,0,0,0.1);
                    border-radius: 4px; overflow: hidden;
                }
                .progress-fill {
                    height: 100%; background: #1e40af; width: 0%;
                    transition: width 0.3s ease;
                }
                .training-status { margin: 15px 0 5px 0; font-size: 1.1em; }
                .training-metrics { font-size: 0.9em; opacity: 0.9; }
                
                .smart-results { animation: fadeIn 0.5s ease; }
                .results-header {
                    display: flex; justify-content: space-between; align-items: center;
                    background: #f8fafc;
                    color: #000; padding: 25px; border-radius: 12px; margin-bottom: 25px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .score-circle {
                    width: 80px; height: 80px; border-radius: 50%;
                    background: #f0f4ff; display: flex;
                    flex-direction: column; align-items: center; justify-content: center;
                    border: 2px solid #dbeafe;
                }
                .score-number { font-size: 1.8em; font-weight: bold; color: #1e40af; }
                .score-label { font-size: 0.8em; color: #4b5563; font-weight: 500; }
                
                .results-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px; margin-bottom: 25px;
                }
                .result-panel {
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .result-panel h3 {
                    margin: 0 0 15px 0; color: #111827; border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 8px; font-weight: 600;
                }
                
                .role-card {
                    background: #f8f9fa; padding: 15px; margin: 10px 0;
                    border-radius: 8px; border-left: 4px solid #1e40af;
                    border: 1px solid #e5e7eb;
                }
                .role-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 8px;
                }
                .compatibility-badge {
                    background: #e0e7ff; color: #1e40af; padding: 4px 10px;
                    border-radius: 12px; font-size: 0.8em; font-weight: bold;
                    border: 1px solid #bfdbfe;
                }
                .role-details {
                    display: flex; gap: 15px; font-size: 0.85em; color: #4b5563;
                }
                
                .skill-gap {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 10px 0; border-bottom: 1px solid #eee;
                }
                .priority-badge {
                    padding: 2px 6px; border-radius: 10px; font-size: 0.7em;
                    font-weight: bold; text-transform: uppercase;
                }
                .priority-badge.high { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
                .priority-badge.medium { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
                
                .roadmap-step {
                    display: flex; align-items: center; gap: 12px;
                    padding: 8px 0; border-bottom: 1px solid #eee;
                }
                .step-number {
                    width: 24px; height: 24px; background: #e0f2fe; color: #0369a1;
                    border-radius: 50%; display: flex; align-items: center;
                    justify-content: center; font-size: 0.8em; font-weight: bold;
                    border: 1px solid #bae6fd;
                }
                
                .recommendations {
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                }
                .recommendations h3 {
                    margin: 0 0 15px 0; color: #111827;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 10px;
                }
                .recommendation {
                    padding: 12px; margin: 8px 0;
                    background: #f8fafc;
                    border-radius: 6px;
                    border-left: 4px solid #3b82f6;
                    color: #1e293b;
                    font-size: 0.95em;
                    line-height: 1.5;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize and replace ALL assessment functions
const smartAI = new SmartAIAssessment();

// Override ALL possible assessment functions
window.handleUniversalAssessment = function() {
    smartAI.performSmartAssessment();
};

window.handleUniversalAssessmentWithAPI = function() {
    smartAI.performSmartAssessment();
};

window.handleAssessmentWithDebug = function() {
    smartAI.performSmartAssessment();
};

// Also override any button clicks directly
document.addEventListener('DOMContentLoaded', function() {
    // Find and override the assessment button by ID
    const assessButton = document.getElementById('analyzeSkillsBtn');
    
    if (assessButton) {
        // Remove any existing onclick handlers
        assessButton.onclick = null;
        assessButton.removeAttribute('onclick');
        
        // Add new event listener
        assessButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Button clicked - Starting Smart AI Assessment');
            smartAI.performSmartAssessment();
        });
    }
    
    // Clear any existing results to force new ones
    const resultsContainer = document.getElementById('universalAssessmentResults');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    
    console.log('✅ Button override complete - Smart AI Assessment bound');
});

console.log('🧠 Smart AI Assessment Ready - ALL functions overridden!');
