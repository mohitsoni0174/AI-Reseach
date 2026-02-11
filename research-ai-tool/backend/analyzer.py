"""Earnings call transcript analysis using OpenAI API."""

import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from prompt import SYSTEM_PROMPT

# Load environment variables from .env file
load_dotenv()


def analyze_transcript(text: str) -> str:
    """
    Analyze earnings call transcript using OpenAI API.
    
    Args:
        text: Extracted transcript text
        
    Returns:
        Structured JSON string with analysis results
        
    Raises:
        ValueError: If API key is missing or API call fails
        json.JSONDecodeError: If response is not valid JSON
    """
    # Validate API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    
    try:
        # Truncate text if too long (to avoid token limits)
        max_chars = 50000  # ~12.5k tokens
        if len(text) > max_chars:
            text = text[:max_chars] + "\n\n[Transcript truncated due to length]"
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze this earnings call transcript:\n\n{text}"}
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        # Extract and validate JSON response
        analysis_json = response.choices[0].message.content
        
        # Validate it's proper JSON
        parsed = json.loads(analysis_json)
        
        # Validate required fields
        required_fields = [
            "tone", "confidence", "positives", "concerns",
            "guidance", "capacity_trend", "growth_initiatives"
        ]
        for field in required_fields:
            if field not in parsed:
                raise ValueError(f"Missing required field in analysis: {field}")
        
        return analysis_json
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response from LLM: {str(e)}")
    except Exception as e:
        raise ValueError(f"OpenAI API error: {str(e)}")
