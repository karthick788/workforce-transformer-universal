"""
Working AI Models for WorkforceTransformer Universal
Simplified but functional implementations for skills assessment and career prediction
"""

from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class WorkingSkillsAssessmentModel:
    """Functional skills assessment model"""
    
    def __init__(self):
        self.is_ready = True
        self.skill_weights = {
            'data-analysis': 15,
            'ai-ml': 20,
            'digital-literacy': 10,
            'process-automation': 18,
            'human-ai-collaboration': 12,
            'critical-thinking': 14,
            'adaptability': 13,
            'communication': 11,
            'project-management': 16,
            'ethical-decision': 9
        }
        
        self.industry_multipliers = {
            'cybersecurity': {'ai-ml': 1.5, 'data-analysis': 1.3, 'critical-thinking': 1.4},
            'healthcare': {'human-ai-collaboration': 1.4, 'ethical-decision': 1.5, 'communication': 1.3},
            'manufacturing': {'process-automation': 1.5, 'project-management': 1.3, 'adaptability': 1.2},
            'finance': {'data-analysis': 1.4, 'ai-ml': 1.3, 'critical-thinking': 1.3},
            'retail': {'communication': 1.4, 'adaptability': 1.3, 'digital-literacy': 1.2},
            'education': {'communication': 1.5, 'human-ai-collaboration': 1.3, 'adaptability': 1.4},
            'logistics': {'process-automation': 1.4, 'project-management': 1.3, 'data-analysis': 1.2},
            'legal': {'critical-thinking': 1.5, 'ethical-decision': 1.4, 'communication': 1.3}
        }
    
    async def assess_skills(self, current_industry: str, skills: List[str], 
                          experience_years: str, target_industry: Optional[str] = None) -> Dict[str, Any]:
        """Assess skills and provide recommendations"""
        
        # Calculate base score
        base_score = 0
        skill_details = []
        
        # Experience factor
        exp_factor = {'0-2': 0.7, '3-5': 1.0, '6-10': 1.3, '10+': 1.5}.get(experience_years, 1.0)
        
        # Calculate skill scores
        for skill in skills:
            weight = self.skill_weights.get(skill, 10)
            industry_mult = self.industry_multipliers.get(current_industry, {}).get(skill, 1.0)
            skill_score = weight * industry_mult * exp_factor
            base_score += skill_score
            
            skill_details.append({
                'skill': skill.replace('-', ' ').title(),
                'score': min(skill_score, 100),
                'weight': weight
            })
        
        # Normalize score
        max_possible = len(skills) * 20 * 1.5  # Max weight * max multiplier
        overall_score = min((base_score / max_possible) * 100, 100) if max_possible > 0 else 0
        
        # Generate skill gaps
        skill_gaps = self._generate_skill_gaps(skills, current_industry, target_industry)
        
        # Generate transition opportunities
        transition_opportunities = self._generate_transition_opportunities(
            current_industry, skills, overall_score, target_industry
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(overall_score, skills, current_industry)
        
        return {
            'overall_score': round(overall_score, 1),
            'skill_gaps': skill_gaps,
            'transition_opportunities': transition_opportunities,
            'recommendations': recommendations,
            'skill_details': skill_details
        }
    
    def _generate_skill_gaps(self, current_skills: List[str], current_industry: str, 
                           target_industry: Optional[str]) -> List[Dict[str, Any]]:
        """Generate skill gap analysis"""
        gaps = []
        
        # Industry-specific critical skills
        critical_skills = {
            'cybersecurity': ['ai-ml', 'data-analysis', 'critical-thinking'],
            'healthcare': ['human-ai-collaboration', 'ethical-decision', 'digital-literacy'],
            'manufacturing': ['process-automation', 'project-management', 'data-analysis'],
            'finance': ['data-analysis', 'ai-ml', 'critical-thinking'],
            'retail': ['digital-literacy', 'communication', 'adaptability'],
            'education': ['communication', 'human-ai-collaboration', 'adaptability'],
            'logistics': ['process-automation', 'project-management', 'data-analysis'],
            'legal': ['critical-thinking', 'ethical-decision', 'communication']
        }
        
        target_skills = critical_skills.get(target_industry or current_industry, [])
        
        for skill in target_skills:
            if skill not in current_skills:
                gaps.append({
                    'skill': skill.replace('-', ' ').title(),
                    'current_level': 0,
                    'required_level': 8,
                    'priority': 'high'
                })
        
        return gaps[:3]  # Top 3 gaps
    
    def _generate_transition_opportunities(self, current_industry: str, skills: List[str], 
                                         score: float, target_industry: Optional[str]) -> List[Dict[str, Any]]:
        """Generate career transition opportunities"""
        opportunities = []
        
        # Role mappings based on skills and industries
        role_mappings = {
            ('ai-ml', 'data-analysis'): ['Data Scientist', 'ML Engineer', 'AI Specialist'],
            ('process-automation', 'project-management'): ['Automation Manager', 'Process Analyst', 'Operations Lead'],
            ('communication', 'human-ai-collaboration'): ['Change Manager', 'Training Coordinator', 'UX Designer'],
            ('critical-thinking', 'ethical-decision'): ['Strategy Analyst', 'Compliance Officer', 'Risk Manager']
        }
        
        # Find matching roles
        for skill_combo, roles in role_mappings.items():
            if all(skill in skills for skill in skill_combo):
                for role in roles:
                    match_score = min(0.7 + (score / 100) * 0.3, 0.95)
                    opportunities.append({
                        'role': role,
                        'match_score': round(match_score, 2),
                        'industry': target_industry or current_industry
                    })
        
        # Default opportunities if no specific matches
        if not opportunities:
            default_roles = ['Digital Transformation Specialist', 'Process Improvement Analyst', 'Training Coordinator']
            for role in default_roles:
                opportunities.append({
                    'role': role,
                    'match_score': round(max(0.5, score / 100), 2),
                    'industry': current_industry
                })
        
        return opportunities[:3]  # Top 3 opportunities
    
    def _generate_recommendations(self, score: float, skills: List[str], 
                                current_industry: str) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if score < 40:
            recommendations.extend([
                "Focus on building foundational digital skills",
                "Complete basic AI literacy training",
                "Develop core communication skills"
            ])
        elif score < 70:
            recommendations.extend([
                "Advance to intermediate-level technical skills",
                "Pursue industry-specific certifications",
                "Build cross-functional collaboration experience"
            ])
        else:
            recommendations.extend([
                "Ready for leadership roles in digital transformation",
                "Consider mentoring others in skill development",
                "Explore emerging technology applications"
            ])
        
        # Skill-specific recommendations
        critical_missing = ['ai-ml', 'data-analysis', 'process-automation']
        missing_critical = [skill for skill in critical_missing if skill not in skills]
        
        for skill in missing_critical[:2]:  # Top 2 missing critical skills
            skill_name = skill.replace('-', ' ').title()
            recommendations.append(f"High priority: Develop {skill_name} capabilities")
        
        return recommendations

class WorkingCareerTransitionPredictor:
    """Functional career transition prediction model"""
    
    def __init__(self):
        self.is_ready = True
        self.transition_matrix = {
            'cybersecurity': {'healthcare': 0.75, 'finance': 0.85, 'manufacturing': 0.60, 'education': 0.70},
            'healthcare': {'cybersecurity': 0.70, 'education': 0.80, 'finance': 0.65},
            'manufacturing': {'logistics': 0.85, 'cybersecurity': 0.60, 'retail': 0.70},
            'finance': {'cybersecurity': 0.80, 'legal': 0.75, 'retail': 0.60},
            'retail': {'logistics': 0.75, 'manufacturing': 0.65, 'education': 0.60},
            'education': {'healthcare': 0.75, 'cybersecurity': 0.65, 'retail': 0.55},
            'logistics': {'manufacturing': 0.80, 'retail': 0.75, 'cybersecurity': 0.60},
            'legal': {'finance': 0.75, 'cybersecurity': 0.70, 'education': 0.60}
        }
    
    async def predict_transition(self, employee_id: str, current_industry: str, 
                               target_industry: str, skills: List[str] = None) -> Dict[str, Any]:
        """Predict career transition success"""
        
        # Base probability from transition matrix
        base_prob = self.transition_matrix.get(current_industry, {}).get(target_industry, 0.5)
        
        # Skill bonus
        skill_bonus = 0
        if skills:
            valuable_skills = ['ai-ml', 'data-analysis', 'process-automation', 'communication']
            skill_bonus = len([s for s in skills if s in valuable_skills]) * 0.05
        
        success_probability = min(base_prob + skill_bonus, 0.95)
        
        # Generate required skills
        industry_skills = {
            'cybersecurity': ['AI/ML', 'Cybersecurity Fundamentals', 'Risk Analysis'],
            'healthcare': ['Healthcare Technology', 'Patient Care Systems', 'Compliance'],
            'manufacturing': ['Process Automation', 'Quality Control', 'Supply Chain'],
            'finance': ['Financial Analysis', 'Risk Management', 'Regulatory Compliance'],
            'retail': ['Customer Analytics', 'Inventory Management', 'Digital Marketing'],
            'education': ['Educational Technology', 'Curriculum Design', 'Student Assessment'],
            'logistics': ['Supply Chain Management', 'Route Optimization', 'Inventory Control'],
            'legal': ['Legal Research', 'Contract Analysis', 'Compliance Management']
        }
        
        required_skills = industry_skills.get(target_industry, ['Industry Knowledge', 'Technical Skills', 'Communication'])
        
        # Generate recommended roles
        role_suggestions = {
            'cybersecurity': ['Security Analyst', 'Cybersecurity Specialist', 'Risk Assessor'],
            'healthcare': ['Healthcare Analyst', 'Medical Technology Specialist', 'Patient Care Coordinator'],
            'manufacturing': ['Process Engineer', 'Quality Analyst', 'Production Coordinator'],
            'finance': ['Financial Analyst', 'Risk Manager', 'Compliance Officer'],
            'retail': ['Retail Analyst', 'Customer Experience Manager', 'Digital Marketing Specialist'],
            'education': ['Educational Technology Specialist', 'Curriculum Developer', 'Training Coordinator'],
            'logistics': ['Supply Chain Analyst', 'Logistics Coordinator', 'Operations Manager'],
            'legal': ['Legal Analyst', 'Compliance Specialist', 'Contract Manager']
        }
        
        recommended_roles = role_suggestions.get(target_industry, ['Industry Specialist', 'Analyst', 'Coordinator'])
        
        # Calculate timeline and salary impact
        timeline_months = max(6, 18 - int(success_probability * 12))
        salary_increase_percent = success_probability * 30  # Up to 30% increase
        
        return {
            'success_probability': round(success_probability, 2),
            'required_skills': required_skills,
            'recommended_roles': recommended_roles,
            'timeline_months': timeline_months,
            'salary_increase_percent': round(salary_increase_percent, 1)
        }

# Initialize models
skills_model = WorkingSkillsAssessmentModel()
transition_model = WorkingCareerTransitionPredictor()

async def get_skills_assessment_model():
    """Get the skills assessment model instance"""
    return skills_model

async def get_transition_model():
    """Get the career transition model instance"""
    return transition_model
