import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Use a mock response if no API key is set, to avoid crashing during development
const mockResponses: Record<string, any> = {
  'Tech & AI Club': {
    title: 'محلل مشاعر القطط بالذكاء الاصطناعي',
    content_angle: 'لأننا نعلم أن قطتك تخطط للسيطرة على العالم، دعنا نكشف أسرارها بفيديو تيك توك تريند!',
    technical_highlight: 'استخدام نماذج الرؤية الحاسوبية (Computer Vision) وتحليل المشاعر لترجمة مواء القطط.',
    roadmap: '1. تجميع بيانات مواء القطط (بالتوفيق في عدم التعرض للخدش).\n2. تدريب نموذج صغير.\n3. إطلاق التطبيق وتصوير فيديو درامي لرد فعل قطتك.'
  },
  'Media & Creativity Club': {
    title: 'صناعة محتوى بدون صانع محتوى',
    content_angle: 'لماذا تتعب نفسك أمام الكاميرا بينما يمكن للذكاء الاصطناعي أن يكون الوجه الإعلاني الأفضل منك؟ (أقل تذمراً أيضاً)',
    technical_highlight: 'دمج تقنيات التزييف العميق (الآمنة) والتوليد الصوتي لإنشاء شخصية افتراضية كاملة.',
    roadmap: '1. تصميم الشخصية 3D.\n2. كتابة السكريبت بالذكاء الاصطناعي.\n3. إنتاج أول فيديو ونشره كأن شيئاً لم يكن.'
  },
  'Entrepreneurship & Projects Club': {
    title: 'تطبيق يمنعك من شراء القهوة',
    content_angle: 'تطبيق يعاملك بقسوة كلما اقتربت من مقهى غالي الثمن، ويوفر مالك لتبدأ مشروعك الحقيقي بدلاً من إضاعته على الكافيين.',
    technical_highlight: 'استخدام تحديد الموقع الجغرافي (Geolocation) مع إشعارات Push قاسية ومستفزة.',
    roadmap: '1. برمجة تتبع الموقع الجغرافي.\n2. كتابة رسائل إشعارات مستفزة.\n3. إطلاق التطبيق وجمع التبرعات من الغاضبين.'
  }
};

export async function POST(req: Request) {
  try {
    const { club } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return mock data if API key is missing
      const mock = mockResponses[club] || mockResponses['Tech & AI Club'];
      return NextResponse.json(mock);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `
      You are an AI Inspiration Engine for a student club called "FFT". 
      The user selected the club: "${club}".
      Generate a trending, global project idea similar to this club's niche. 
      Tone: Humorous, witty, direct, and slightly brutally honest.
      Language: Arabic.
      
      Respond ONLY with a valid JSON object matching this schema, without markdown formatting or code blocks:
      {
        "title": "Short creative title of the idea",
        "content_angle": "The creative content angle or marketing hook (funny/witty)",
        "technical_highlight": "The scientific or technical highlight",
        "roadmap": "A quick, step-by-step roadmap for execution (string with line breaks)"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON response (remove markdown code blocks if any)
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const idea = JSON.parse(cleanedText);
      return NextResponse.json(idea);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini:", cleanedText);
      // Fallback
      return NextResponse.json(mockResponses[club] || mockResponses['Tech & AI Club']);
    }

  } catch (error) {
    console.error('Error generating idea:', error);
    return NextResponse.json(
      { error: 'Failed to generate idea' },
      { status: 500 }
    );
  }
}
