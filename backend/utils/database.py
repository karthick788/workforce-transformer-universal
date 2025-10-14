import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import sqlite3
from pathlib import Path

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, database_url: str = "sqlite:///workforce_transformer.db"):
        self.database_url = database_url
        self.db_path = Path("workforce_transformer.db")
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database with required tables"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Users table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT UNIQUE NOT NULL,
                    email TEXT,
                    industry TEXT,
                    experience_level TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Skills assessments table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS skills_assessments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    assessment_data TEXT,
                    overall_score REAL,
                    industry TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            ''')
            
            # Career transitions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS career_transitions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    from_industry TEXT,
                    to_industry TEXT,
                    success_probability REAL,
                    status TEXT DEFAULT 'planned',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            ''')
            
            # Training records table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS training_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    program_name TEXT,
                    completion_status TEXT DEFAULT 'enrolled',
                    progress_percent REAL DEFAULT 0,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (user_id)
                )
            ''')
            
            # Job market data table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS job_market_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    industry TEXT,
                    job_postings INTEGER,
                    avg_salary REAL,
                    demand_score REAL,
                    data_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Platform metrics table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS platform_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    metric_name TEXT,
                    metric_value REAL,
                    metric_data TEXT,
                    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
    
    async def store_user(self, user_data: Dict[str, Any]) -> bool:
        """Store user information"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO users (user_id, email, industry, experience_level)
                VALUES (?, ?, ?, ?)
            ''', (
                user_data.get('user_id'),
                user_data.get('email'),
                user_data.get('industry'),
                user_data.get('experience_level')
            ))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Failed to store user: {e}")
            return False
    
    async def store_assessment(self, assessment_data: Dict[str, Any]) -> bool:
        """Store skills assessment result"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO skills_assessments (user_id, assessment_data, overall_score, industry)
                VALUES (?, ?, ?, ?)
            ''', (
                assessment_data.get('user_id'),
                json.dumps(assessment_data),
                assessment_data.get('overall_score'),
                assessment_data.get('industry')
            ))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Failed to store assessment: {e}")
            return False
    
    async def get_user_assessments(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's assessment history"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT assessment_data, overall_score, created_at
                FROM skills_assessments
                WHERE user_id = ?
                ORDER BY created_at DESC
            ''', (user_id,))
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    'assessment_data': json.loads(row[0]),
                    'overall_score': row[1],
                    'created_at': row[2]
                })
            
            conn.close()
            return results
            
        except Exception as e:
            logger.error(f"Failed to get user assessments: {e}")
            return []


class Settings:
    def __init__(self):
        self.database_url = "sqlite:///workforce_transformer.db"
        self.api_key = "your-api-key-here"
        self.debug = True
        self.log_level = "INFO"
