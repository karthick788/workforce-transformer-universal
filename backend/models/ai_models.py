import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error
import joblib
import asyncio
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class SkillsAssessmentModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.skill_encoder = LabelEncoder()
        self.industry_encoder = LabelEncoder()
        self.is_ready = False
        
    async def initialize(self):
        """Initialize and train the skills assessment model"""
        try:
            # Load training data
            data = self._generate_training_data()
            
            # Prepare features
            X, y = self._prepare_features(data)
            
            # Train model
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.model.fit(X_train, y_train)
            
            # Evaluate
            predictions = self.model.predict(X_test)
            mse = mean_squared_error(y_test, predictions)
            logger.info(f"Skills model MSE: {mse}")
            
            self.is_ready = True
            
        except Exception as e:
            logger.error(f"Skills model initialization failed: {e}")
            
    def _generate_training_data(self):
        """Generate synthetic training data for skills assessment"""
        np.random.seed(42)
        
        industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']
        skills = ['ai-ml', 'data-analysis', 'digital-literacy', 'process-automation', 'human-ai-collaboration', 
                 'critical-thinking', 'adaptability', 'communication', 'project-management', 'ethical-decision']
        
        data = []
        for _ in range(5000):
            industry = np.random.choice(industries)
            num_skills = np.random.randint(3, 8)
            user_skills = np.random.choice(skills, num_skills, replace=False).tolist()
            experience = np.random.choice(['0-2', '3-5', '6-10', '10+'])
            
            # Calculate score based on skills and experience
            base_score = len(user_skills) * 8
            if 'ai-ml' in user_skills: base_score += 15
            if 'data-analysis' in user_skills: base_score += 12
            if experience == '10+': base_score += 20
            elif experience == '6-10': base_score += 15
            elif experience == '3-5': base_score += 10
            
            score = min(base_score + np.random.normal(0, 5), 100)
            
            data.append({
                'industry': industry,
                'skills': user_skills,
                'experience': experience,
                'score': max(score, 20)
            })
            
        return pd.DataFrame(data)
    
    def _prepare_features(self, data):
        """Prepare features for training"""
        # Create feature matrix
        features = []
        scores = []
        
        all_skills = ['ai-ml', 'data-analysis', 'digital-literacy', 'process-automation', 'human-ai-collaboration', 
                     'critical-thinking', 'adaptability', 'communication', 'project-management', 'ethical-decision']
        
        for _, row in data.iterrows():
            feature_vector = []
            
            # Industry encoding (one-hot)
            industry_encoded = [1 if row['industry'] == ind else 0 
                              for ind in ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']]
            feature_vector.extend(industry_encoded)
            
            # Skills encoding (binary)
            skills_encoded = [1 if skill in row['skills'] else 0 for skill in all_skills]
            feature_vector.extend(skills_encoded)
            
            # Experience encoding
            exp_map = {'0-2': 1, '3-5': 2, '6-10': 3, '10+': 4}
            feature_vector.append(exp_map[row['experience']])
            
            features.append(feature_vector)
            scores.append(row['score'])
            
        return np.array(features), np.array(scores)
    
    async def assess_skills(self, current_industry: str, target_industry: Optional[str], 
                          experience_years: str, skills: List[str], 
                          education_level: str = "bachelor", certifications: List[str] = []) -> Dict[str, Any]:
        """Perform comprehensive skills assessment"""
        if not self.is_ready:
            raise Exception("Model not initialized")
            
        # Prepare input features
        all_skills = ['ai-ml', 'data-analysis', 'digital-literacy', 'process-automation', 'human-ai-collaboration', 
                     'critical-thinking', 'adaptability', 'communication', 'project-management', 'ethical-decision']
        
        feature_vector = []
        
        # Industry encoding
        industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']
        industry_encoded = [1 if current_industry == ind else 0 for ind in industries]
        feature_vector.extend(industry_encoded)
        
        # Skills encoding
        skills_encoded = [1 if skill in skills else 0 for skill in all_skills]
        feature_vector.extend(skills_encoded)
        
        # Experience encoding
        exp_map = {'0-2': 1, '3-5': 2, '6-10': 3, '10+': 4}
        feature_vector.append(exp_map.get(experience_years, 1))
        
        # Predict score
        score = self.model.predict([feature_vector])[0]
        
        # Generate skill gaps
        skill_gaps = []
        for skill in all_skills:
            if skill not in skills:
                importance = np.random.uniform(0.6, 0.9)
                skill_gaps.append({
                    'skill': skill,
                    'importance': importance,
                    'current_level': 0,
                    'target_level': 80,
                    'training_time_weeks': int(importance * 10)
                })
        
        # Generate recommendations
        recommendations = self._generate_recommendations(score, skills, current_industry)
        
        return {
            'overall_score': float(score),
            'skill_gaps': skill_gaps,
            'recommendations': recommendations,
            'estimated_timeline': len(skill_gaps) * 2
        }
    
    def _generate_recommendations(self, score: float, skills: List[str], industry: str) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        if score < 40:
            recommendations.extend([
                "🎯 Focus on foundational digital literacy skills",
                "📚 Complete AI Fundamentals Bootcamp",
                "🔧 Develop basic process automation understanding"
            ])
        elif score < 70:
            recommendations.extend([
                "🚀 Advance to intermediate cross-sector skills", 
                "📊 Pursue Cross-Sector Data Science certification",
                "🤖 Explore industry-specific AI applications"
            ])
        else:
            recommendations.extend([
                "🏆 Ready for leadership roles in automation",
                "🌟 Consider emerging roles like AI Ethics Specialist",
                "🎓 Pursue advanced cross-industry certifications"
            ])
            
        return recommendations


class CareerTransitionPredictor:
    def __init__(self):
        self.model = None
        self.is_ready = False
        
    async def initialize(self):
        """Initialize career transition prediction model"""
        try:
            # Generate training data
            data = self._generate_transition_data()
            
            # Train model
            X, y = self._prepare_transition_features(data)
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            self.model = GradientBoostingClassifier(n_estimators=100, random_state=42)
            self.model.fit(X_train, y_train)
            
            # Evaluate
            predictions = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, predictions)
            logger.info(f"Career transition model accuracy: {accuracy}")
            
            self.is_ready = True
            
        except Exception as e:
            logger.error(f"Career transition model initialization failed: {e}")
    
    def _generate_transition_data(self):
        """Generate synthetic career transition data"""
        np.random.seed(42)
        
        industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']
        
        data = []
        for _ in range(3000):
            from_industry = np.random.choice(industries)
            to_industry = np.random.choice([ind for ind in industries if ind != from_industry])
            
            # Compatibility matrix
            compatibility = {
                ('cybersecurity', 'finance'): 0.85,
                ('healthcare', 'education'): 0.80,
                ('manufacturing', 'logistics'): 0.90,
                ('finance', 'legal'): 0.75
            }
            
            base_success = compatibility.get((from_industry, to_industry), 0.60)
            success = 1 if np.random.random() < base_success else 0
            
            data.append({
                'from_industry': from_industry,
                'to_industry': to_industry,
                'success': success,
                'experience_years': np.random.randint(1, 15),
                'num_skills': np.random.randint(3, 10)
            })
            
        return pd.DataFrame(data)
    
    def _prepare_transition_features(self, data):
        """Prepare features for transition prediction"""
        features = []
        labels = []
        
        industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']
        
        for _, row in data.iterrows():
            feature_vector = []
            
            # From industry encoding
            from_encoded = [1 if row['from_industry'] == ind else 0 for ind in industries]
            feature_vector.extend(from_encoded)
            
            # To industry encoding  
            to_encoded = [1 if row['to_industry'] == ind else 0 for ind in industries]
            feature_vector.extend(to_encoded)
            
            # Other features
            feature_vector.extend([row['experience_years'], row['num_skills']])
            
            features.append(feature_vector)
            labels.append(row['success'])
            
        return np.array(features), np.array(labels)
    
    async def predict_transitions(self, current_industry: str, skills: List[str], experience_years: str) -> List[Dict[str, Any]]:
        """Predict career transition opportunities"""
        if not self.is_ready:
            return []
            
        industries = ['cybersecurity', 'healthcare', 'manufacturing', 'finance', 'retail', 'education', 'logistics', 'legal']
        opportunities = []
        
        exp_years = {'0-2': 1, '3-5': 4, '6-10': 8, '10+': 12}.get(experience_years, 4)
        
        for target_industry in industries:
            if target_industry != current_industry:
                # Prepare features
                feature_vector = []
                
                # From industry
                from_encoded = [1 if current_industry == ind else 0 for ind in industries]
                feature_vector.extend(from_encoded)
                
                # To industry
                to_encoded = [1 if target_industry == ind else 0 for ind in industries]
                feature_vector.extend(to_encoded)
                
                # Experience and skills
                feature_vector.extend([exp_years, len(skills)])
                
                # Predict success probability
                success_prob = self.model.predict_proba([feature_vector])[0][1]
                
                if success_prob > 0.6:
                    opportunities.append({
                        'title': f'{current_industry.title()} → {target_industry.title()}',
                        'compatibility': int(success_prob * 100),
                        'salaryChange': np.random.randint(-5000, 25000),
                        'trainingTime': np.random.randint(4, 12),
                        'description': f'High compatibility transition based on your profile'
                    })
        
        return sorted(opportunities, key=lambda x: x['compatibility'], reverse=True)[:3]
    
    async def predict_transition_success(self, current_role: str, current_industry: str, 
                                       target_industry: str, skills: List[str], 
                                       experience_years: int, location: str) -> Dict[str, Any]:
        """Predict detailed transition success metrics"""
        # Simplified prediction logic
        base_probability = 0.65
        
        # Adjust based on experience
        if experience_years > 8:
            base_probability += 0.15
        elif experience_years > 5:
            base_probability += 0.10
            
        # Adjust based on skills
        if len(skills) > 6:
            base_probability += 0.10
            
        return {
            'success_probability': min(base_probability, 0.95),
            'timeline_months': np.random.randint(6, 18),
            'required_skills': ['ai-ml', 'data-analysis', 'process-automation'][:3],
            'certifications': ['Industry Certification', 'AI Fundamentals'],
            'salary_change': np.random.randint(-5000, 30000),
            'job_availability': np.random.choice(['High', 'Medium', 'Low']),
            'transition_steps': [
                'Complete skills assessment',
                'Enroll in transition program',
                'Build portfolio projects',
                'Network in target industry',
                'Apply for roles'
            ]
        }


class ROICalculator:
    def __init__(self):
        self.is_ready = False
        self.industry_data = {}
        
    async def initialize(self):
        """Initialize ROI calculation model"""
        try:
            # Load industry ROI data
            self.industry_data = {
                'cybersecurity': {'roi': 2775, 'cost_per_employee': 1200, 'productivity_gain': 25000},
                'healthcare': {'roi': 3525, 'cost_per_employee': 800, 'productivity_gain': 15000},
                'manufacturing': {'roi': 3033, 'cost_per_employee': 600, 'productivity_gain': 12000},
                'finance': {'roi': 3720, 'cost_per_employee': 1000, 'productivity_gain': 22000},
                'retail': {'roi': 2750, 'cost_per_employee': 400, 'productivity_gain': 8000},
                'education': {'roi': 2586, 'cost_per_employee': 700, 'productivity_gain': 10000},
                'logistics': {'roi': 2620, 'cost_per_employee': 500, 'productivity_gain': 9000},
                'legal': {'roi': 3733, 'cost_per_employee': 1500, 'productivity_gain': 35000}
            }
            
            self.is_ready = True
            logger.info("ROI Calculator initialized")
            
        except Exception as e:
            logger.error(f"ROI Calculator initialization failed: {e}")
    
    async def calculate_comprehensive_roi(self, industry: str, employee_count: int, 
                                        training_budget: float, current_productivity: float) -> Dict[str, Any]:
        """Calculate comprehensive ROI analysis"""
        if not self.is_ready:
            raise Exception("ROI Calculator not initialized")
            
        industry_metrics = self.industry_data.get(industry, self.industry_data['cybersecurity'])
        
        # Calculate costs
        total_training_cost = employee_count * industry_metrics['cost_per_employee']
        implementation_cost = training_budget * 0.2
        total_cost = total_training_cost + implementation_cost
        
        # Calculate benefits
        annual_productivity_gain = employee_count * industry_metrics['productivity_gain']
        cost_savings = total_training_cost * 0.3
        total_annual_benefit = annual_productivity_gain + cost_savings
        
        # ROI calculation
        roi_percentage = ((total_annual_benefit - total_cost) / total_cost) * 100
        payback_months = (total_cost / (total_annual_benefit / 12))
        
        return {
            'roi_percentage': round(roi_percentage, 1),
            'payback_months': round(payback_months, 1),
            'annual_savings': round(total_annual_benefit, 0),
            'productivity_gain': round(annual_productivity_gain, 0),
            'cost_breakdown': {
                'training_cost': total_training_cost,
                'implementation_cost': implementation_cost,
                'total_cost': total_cost
            },
            'benefit_breakdown': {
                'productivity_gain': annual_productivity_gain,
                'cost_savings': cost_savings,
                'total_benefit': total_annual_benefit
            },
            'risk_factors': ['Market volatility', 'Technology changes', 'Employee turnover'],
            'recommendations': [
                'Implement phased rollout',
                'Monitor key metrics',
                'Provide ongoing support'
            ]
        }


class TrainingRecommendationEngine:
    def __init__(self):
        self.is_ready = False
        
    async def initialize(self):
        """Initialize training recommendation engine"""
        self.is_ready = True
        logger.info("Training Recommendation Engine initialized")
    
    async def generate_learning_path(self, current_skills: List[str], target_industry: str, 
                                   skill_gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate personalized learning path"""
        path = []
        
        # Foundation courses
        if 'ai-ml' not in current_skills:
            path.append({
                'course': 'AI Fundamentals Bootcamp',
                'duration_weeks': 4,
                'difficulty': 'Beginner',
                'priority': 'High'
            })
            
        if 'data-analysis' not in current_skills:
            path.append({
                'course': 'Cross-Sector Data Science',
                'duration_weeks': 8,
                'difficulty': 'Intermediate', 
                'priority': 'High'
            })
        
        # Industry-specific courses
        path.append({
            'course': f'{target_industry.title()} Industry Specialization',
            'duration_weeks': 6,
            'difficulty': 'Intermediate',
            'priority': 'Medium'
        })
        
        # Advanced courses
        if len(current_skills) >= 6:
            path.append({
                'course': 'Leadership in Digital Transformation',
                'duration_weeks': 8,
                'difficulty': 'Advanced',
                'priority': 'Medium'
            })
        
        return path[:5]  # Limit to 5 courses
    
    async def generate_recommendations(self, user_id: str, current_skills: List[str], 
                                     target_skills: List[str], industry: str, 
                                     learning_style: str, time_availability: int) -> Dict[str, Any]:
        """Generate comprehensive training recommendations"""
        
        courses = [
            {'title': 'AI Fundamentals', 'duration': 4, 'difficulty': 'Beginner'},
            {'title': 'Data Science Mastery', 'duration': 8, 'difficulty': 'Intermediate'},
            {'title': 'Process Automation', 'duration': 6, 'difficulty': 'Intermediate'},
            {'title': 'Leadership Skills', 'duration': 5, 'difficulty': 'Advanced'}
        ]
        
        return {
            'courses': courses,
            'path': await self.generate_learning_path(current_skills, industry, []),
            'duration_weeks': sum(course['duration'] for course in courses[:3]),
            'difficulty_curve': 'Progressive',
            'certifications': ['Industry Certification', 'AI Specialist'],
            'projects': ['Portfolio Project 1', 'Capstone Project'],
            'mentors': ['Senior Professional', 'Industry Expert'],
            'schedule': f'{time_availability} hours/week recommended'
        }


class JobMarketAnalyzer:
    def __init__(self):
        self.is_ready = False
        
    async def initialize(self):
        """Initialize job market analyzer"""
        self.is_ready = True
        logger.info("Job Market Analyzer initialized")
    
    async def predict_salary(self, industry: str, skills: List[str], experience_years: str) -> Dict[str, float]:
        """Predict salary based on industry, skills, and experience"""
        
        base_salaries = {
            'cybersecurity': 85000,
            'healthcare': 75000,
            'manufacturing': 65000,
            'finance': 90000,
            'retail': 55000,
            'education': 60000,
            'logistics': 58000,
            'legal': 95000
        }
        
        base_salary = base_salaries.get(industry, 70000)
        
        # Experience multiplier
        exp_multipliers = {'0-2': 1.0, '3-5': 1.2, '6-10': 1.5, '10+': 1.8}
        multiplier = exp_multipliers.get(experience_years, 1.0)
        
        # Skills bonus
        skill_bonus = len(skills) * 2000
        
        current_salary = base_salary * multiplier + skill_bonus
        projected_salary = current_salary * 1.15  # 15% increase with training
        
        return {
            'current_estimate': round(current_salary, 0),
            'with_training': round(projected_salary, 0),
            'increase': round(projected_salary - current_salary, 0)
        }
    
    async def analyze_market(self, industry: str) -> Dict[str, Any]:
        """Analyze job market for specific industry"""
        
        return {
            'demand_score': np.random.uniform(7.0, 9.5),
            'salary_trends': {
                'current_avg': np.random.randint(60000, 120000),
                'growth_rate': np.random.uniform(3.0, 8.0)
            },
            'top_skills': ['AI/ML', 'Data Analysis', 'Process Automation', 'Digital Literacy'],
            'growth_forecast': np.random.uniform(5.0, 15.0),
            'automation_risk': np.random.uniform(20.0, 60.0),
            'emerging_positions': [
                'AI Ethics Specialist',
                'Human-AI Collaboration Manager',
                'Digital Transformation Lead'
            ],
            'location_data': {
                'remote_percentage': np.random.uniform(40.0, 80.0),
                'top_cities': ['San Francisco', 'New York', 'Seattle', 'Austin']
            },
            'insights': [
                f'{industry.title()} sector showing strong growth',
                'High demand for AI-skilled professionals',
                'Remote work opportunities increasing'
            ]
        }
