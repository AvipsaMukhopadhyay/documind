import json
import re
from google import genai
from google.genai import types
from app.config import settings
from app.models.schemas import SummaryLength, AnalysisResponse
from app.utils.text_chunker import chunk_text

class LLMService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY environment variable is not configured.")
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = "gemini-2.5-flash"

    def _build_prompt(self, text: str, length_mode: SummaryLength) -> str:
        length_instructions = {
            SummaryLength.SHORT: "Provide a concise summary in approximately 3 to 5 concise bullet points or 1 compact paragraph.",
            SummaryLength.MEDIUM: "Provide a balanced, structured summary across 1 to 3 informative paragraphs.",
            SummaryLength.LONG: "Provide an exhaustive, multi-section structured summary covering all nuances and critical details."
        }

        return f"""
You are an expert document analyst. Analyze the following document text and output a valid JSON response strictly matching the schema.

INSTRUCTIONS:
1. Summary Length Requirement: {length_instructions.get(length_mode)}
2. Key Points: Extract 4 to 8 critical, actionable takeaways.
3. Main Ideas: Extract 3 to 5 overarching themes or central subjects.
4. Improvement Suggestions: Review the text and suggest 3 to 6 tangible improvements (e.g., clarity, sentence length, missing structural elements, tone, readability, redundancy).

DOCUMENT TEXT:
\"\"\"{text}\"\"\"

Return ONLY valid raw JSON with this exact key structure without markdown code blocks:
{{
  "summary": "...",
  "key_points": ["point 1", "point 2"],
  "main_ideas": ["theme 1", "theme 2"],
  "improvement_suggestions": ["suggestion 1", "suggestion 2"]
}}
"""

    async def analyze_document(self, text: str, length_mode: SummaryLength) -> AnalysisResponse:
        chunks = chunk_text(text, max_chunk_chars=12000)

        if len(chunks) == 1:
            return await self._call_model(chunks[0], length_mode)
        
        # Map-Reduce step for multi-chunk documents
        intermediate_summaries = []
        for index, chunk in enumerate(chunks):
            chunk_prompt = f"Summarize the core insights of part {index+1}/{len(chunks)} of this document concisely:\n\n{chunk}"
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=chunk_prompt
            )
            intermediate_summaries.append(response.text)

        combined_text = "\n\n".join(intermediate_summaries)
        return await self._call_model(combined_text, length_mode)

    async def _call_model(self, text: str, length_mode: SummaryLength) -> AnalysisResponse:
        prompt = self._build_prompt(text, length_mode)
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )

        raw_output = response.text.strip()
        clean_json_str = re.sub(r"^```(json)?|```$", "", raw_output, flags=re.MULTILINE).strip()

        try:
            data = json.loads(clean_json_str)
            return AnalysisResponse(
                summary=data.get("summary", "Summary unavailable."),
                key_points=data.get("key_points", []),
                main_ideas=data.get("main_ideas", []),
                improvement_suggestions=data.get("improvement_suggestions", [])
            )
        except Exception as e:
            raise ValueError(f"Failed to parse LLM response into structured JSON: {str(e)}")
