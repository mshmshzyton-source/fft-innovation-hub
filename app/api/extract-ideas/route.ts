import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { shortDescription, projectName } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback mock response
      return NextResponse.json({
        ideas: [
          {
            title: `فكرة مستوحاة من ${projectName}`,
            content_angle: 'زاوية تسويقية ومحتوى إبداعي.',
            technical_highlight: 'التفاصيل التقنية هنا.',
            roadmap: '1. خطوة 1\n2. خطوة 2\n3. خطوة 3'
          },
          {
            title: `تحدي ${projectName} المصغر`,
            content_angle: 'تحدي مثير للطلاب!',
            technical_highlight: 'استخدام تقنيات جديدة.',
            roadmap: '1. خطوة 1\n2. خطوة 2\n3. خطوة 3'
          }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `
      You are an AI Inspiration Engine for a student club called "FFT Student Hub". 
      Analyze this successful student project:
      Project Name: ${projectName}
      Description: ${shortDescription}

      Generate exactly 2 creative, out-of-the-box content ideas or event concepts for our "FFT Student Hub" inspired by this project. 
      
      STRICT RULES:
      - The output MUST be written entirely in Arabic.
      - The tone MUST be witty, direct, and engaging (avoid boring, formal corporate jargon). 
      - It should sound like a smart, energetic brainstorming session for a youth-driven project.
      
      Respond ONLY with a valid JSON array of objects matching this schema, without any markdown formatting or code blocks:
      [
        {
          "title": "Short creative title of the idea",
          "content_angle": "The creative content angle or marketing hook (funny/witty)",
          "technical_highlight": "The scientific or technical highlight",
          "roadmap": "A quick, step-by-step roadmap for execution (string with line breaks)"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON response
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const ideas = JSON.parse(cleanedText);
      return NextResponse.json({ ideas });
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", cleanedText);
      throw new Error("Invalid JSON from AI");
    }

  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate idea' },
      { status: 500 }
    );
  }
}
