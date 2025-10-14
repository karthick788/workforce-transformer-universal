"""
WorkforceTransformer Universal - Unified Application
Single file containing both backend API and frontend serving
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import logging
import uvicorn
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Access variables
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="WorkforceTransformer Universal",
    description="AI-powered workforce transformation platform",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class HealthCheck(BaseModel):
    status: str
    version: str
    ai_models_status: str

class SkillsAssessmentRequest(BaseModel):
    current_industry: str
    target_industry: Optional[str] = None
    experience_years: str
    skills: List[str]
    education_level: Optional[str] = "bachelor"
    certifications: List[str] = []

class SkillsAssessmentResponse(BaseModel):
    overall_score: float
    skill_gaps: List[Dict[str, Any]]
    transition_opportunities: List[Dict[str, Any]]
    recommendations: List[str]

class CareerTransitionResponse(BaseModel):
    success_probability: float
    required_skills: List[str]
    recommended_roles: List[str]
    timeline_months: int
    salary_increase_percent: float

class ROICalculationRequest(BaseModel):
    industry: str
    employee_count: int
    training_budget: float
    current_avg_salary: Optional[float] = 50000

class ROICalculationResponse(BaseModel):
    traditional_cost: float
    ai_enhanced_cost: float
    cost_savings: float
    roi_percentage: float
    payback_months: int
    productivity_increase: float

# AI Models (Simplified but functional)
class UnifiedAIModels:
    def __init__(self):
        self.skill_weights = {
            'data-analysis': 15, 'ai-ml': 20, 'digital-literacy': 10,
            'process-automation': 18, 'human-ai-collaboration': 12,
            'critical-thinking': 14, 'adaptability': 13, 'communication': 11,
            'project-management': 16, 'ethical-decision': 9
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
        
        self.roi_multipliers = {
            'cybersecurity': 2.8, 'healthcare': 3.5, 'manufacturing': 3.0,
            'finance': 3.7, 'retail': 2.7, 'education': 2.6,
            'logistics': 2.6, 'legal': 3.7
        }

    def assess_skills(self, current_industry: str, skills: List[str], 
                     experience_years: str, target_industry: Optional[str] = None) -> Dict[str, Any]:
        # Calculate base score
        exp_factor = {'0-2': 0.7, '3-5': 1.0, '6-10': 1.3, '10+': 1.5}.get(experience_years, 1.0)
        base_score = 0
        
        for skill in skills:
            weight = self.skill_weights.get(skill, 10)
            industry_mult = self.industry_multipliers.get(current_industry, {}).get(skill, 1.0)
            base_score += weight * industry_mult * exp_factor
        
        max_possible = len(skills) * 20 * 1.5
        overall_score = min((base_score / max_possible) * 100, 100) if max_possible > 0 else 0
        
        # Generate skill gaps
        skill_gaps = []
        critical_skills = ['ai-ml', 'data-analysis', 'process-automation']
        for skill in critical_skills:
            if skill not in skills:
                skill_gaps.append({
                    'skill': skill.replace('-', ' ').title(),
                    'current_level': 0,
                    'required_level': 8,
                    'priority': 'high'
                })
        
        # Generate transition opportunities
        opportunities = [
            {'role': 'Data Scientist', 'match_score': 0.8, 'industry': target_industry or current_industry},
            {'role': 'ML Engineer', 'match_score': 0.75, 'industry': target_industry or current_industry}
        ]
        
        # Generate recommendations
        recommendations = []
        if overall_score < 40:
            recommendations = ["Focus on foundational digital skills", "Complete AI literacy training"]
        elif overall_score < 70:
            recommendations = ["Advance technical skills", "Pursue certifications"]
        else:
            recommendations = ["Ready for leadership roles", "Explore emerging technologies"]
        
        return {
            'overall_score': round(overall_score, 1),
            'skill_gaps': skill_gaps[:3],
            'transition_opportunities': opportunities,
            'recommendations': recommendations
        }

    def predict_transition(self, current_industry: str, target_industry: str, 
                          skills: List[str] = None) -> Dict[str, Any]:
        transition_matrix = {
            'cybersecurity': {'healthcare': 0.75, 'finance': 0.85},
            'healthcare': {'cybersecurity': 0.70, 'education': 0.80},
            'manufacturing': {'logistics': 0.85, 'retail': 0.70},
            'finance': {'cybersecurity': 0.80, 'legal': 0.75}
        }
        
        base_prob = transition_matrix.get(current_industry, {}).get(target_industry, 0.6)
        skill_bonus = len(skills) * 0.05 if skills else 0
        success_probability = min(base_prob + skill_bonus, 0.95)
        
        industry_skills = {
            'cybersecurity': ['AI/ML', 'Security Analysis', 'Risk Management'],
            'healthcare': ['Healthcare IT', 'Patient Care', 'Compliance'],
            'finance': ['Financial Analysis', 'Risk Assessment', 'Regulations']
        }
        
        return {
            'success_probability': round(success_probability, 2),
            'required_skills': industry_skills.get(target_industry, ['Technical Skills']),
            'recommended_roles': ['Specialist', 'Analyst', 'Coordinator'],
            'timeline_months': max(6, 18 - int(success_probability * 12)),
            'salary_increase_percent': round(success_probability * 30, 1)
        }

    def calculate_roi(self, industry: str, employee_count: int, 
                     training_budget: float, current_avg_salary: float) -> Dict[str, Any]:
        multiplier = self.roi_multipliers.get(industry, 2.5)
        traditional_cost = employee_count * 2500
        ai_enhanced_cost = traditional_cost * 0.7  # 30% reduction
        cost_savings = traditional_cost - ai_enhanced_cost
        roi_percentage = multiplier * 100
        payback_months = max(1, int(ai_enhanced_cost / (cost_savings / 12)))
        
        return {
            'traditional_cost': traditional_cost,
            'ai_enhanced_cost': ai_enhanced_cost,
            'cost_savings': cost_savings,
            'roi_percentage': round(roi_percentage, 1),
            'payback_months': payback_months,
            'productivity_increase': round(roi_percentage, 1)
        }

# Initialize AI models
ai_models = UnifiedAIModels()

# API Endpoints
@app.get("/health", response_model=HealthCheck)
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "ai_models_status": "operational"
    }

@app.post("/api/assess", response_model=SkillsAssessmentResponse)
async def assess_skills(request: SkillsAssessmentRequest):
    try:
        logger.info(f"Processing assessment for {request.current_industry}")
        results = ai_models.assess_skills(
            current_industry=request.current_industry,
            skills=request.skills,
            experience_years=request.experience_years,
            target_industry=request.target_industry
        )
        return SkillsAssessmentResponse(**results)
    except Exception as e:
        logger.error(f"Assessment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transition/{employee_id}/{target_industry}", response_model=CareerTransitionResponse)
async def predict_transition(employee_id: str, target_industry: str, 
                           current_industry: str = "technology", skills: Optional[str] = None):
    try:
        skill_list = skills.split(',') if skills else []
        results = ai_models.predict_transition(
            current_industry=current_industry,
            target_industry=target_industry,
            skills=skill_list
        )
        return CareerTransitionResponse(**results)
    except Exception as e:
        logger.error(f"Transition prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/roi/calculate", response_model=ROICalculationResponse)
async def calculate_roi(request: ROICalculationRequest):
    try:
        logger.info(f"Calculating ROI for {request.industry}")
        results = ai_models.calculate_roi(
            industry=request.industry,
            employee_count=request.employee_count,
            training_budget=request.training_budget,
            current_avg_salary=request.current_avg_salary
        )
        return ROICalculationResponse(**results)
    except Exception as e:
        logger.error(f"ROI calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/job-market/{industry}")
async def get_job_market_analytics(industry: str):
    market_data = {
        'cybersecurity': {'growth_rate': 15.2, 'avg_salary': 95000, 'job_openings': 125000},
        'healthcare': {'growth_rate': 8.7, 'avg_salary': 75000, 'job_openings': 890000},
        'manufacturing': {'growth_rate': -2.1, 'avg_salary': 65000, 'job_openings': 450000}
    }
    
    return {
        'industry': industry,
        'market_data': market_data.get(industry, {'growth_rate': 2.5, 'avg_salary': 60000, 'job_openings': 100000}),
        'last_updated': '2025-01-04'
    }

@app.post("/api/training/recommendations")
async def get_training_recommendations(request: SkillsAssessmentRequest):
    assessment = ai_models.assess_skills(
        current_industry=request.current_industry,
        skills=request.skills,
        experience_years=request.experience_years,
        target_industry=request.target_industry
    )
    
    modules = []
    for gap in assessment['skill_gaps']:
        modules.append({
            'module_id': f"{gap['skill'].lower().replace(' ', '-')}-training",
            'title': f"{gap['skill']} Training",
            'duration_weeks': 4,
            'difficulty': 'intermediate',
            'priority': gap.get('priority', 'medium')
        })
    
    return {
        'assessment_score': assessment['overall_score'],
        'recommended_modules': modules[:5],
        'estimated_completion_time': len(modules) * 4,
        'learning_path_id': f"path-{request.current_industry}"
    }

# Serve frontend files
frontend_path = Path(__file__).parent / "frontend"

# Mount static files
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")

@app.get("/")
async def serve_frontend():
    frontend_file = frontend_path / "index.html"
    if frontend_file.exists():
        return FileResponse(str(frontend_file))
    else:
        return {"message": "WorkforceTransformer Universal API", "docs": "/docs"}

@app.get("/{filename}")
async def serve_static_files(filename: str):
    file_path = frontend_path / filename
    if file_path.exists() and file_path.is_file():
        return FileResponse(str(file_path))
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    logger.info("🚀 Starting WorkforceTransformer Universal")
    logger.info("📊 Backend API: http://localhost:8000/docs")
    logger.info("🌐 Frontend: http://localhost:8000")
    
    try:
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=8000, 
            reload=False,  # Disable reload to prevent shutdown
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise
