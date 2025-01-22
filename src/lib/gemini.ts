import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

export async function getDietRecommendations(
  healthConditions: string,
  dietaryGoals: string,
  currentDiet: string,
  language: string = 'en'
): Promise<string> {
  const languagePrompt = language === 'id' ? 
    'Berikan rekomendasi dalam Bahasa Indonesia.' : 
    'Provide recommendations in English.';

  const prompt = `${languagePrompt}
    As a nutrition expert, provide personalized halal diet recommendations based on the following:
    Health Conditions: ${healthConditions}
    Dietary Goals: ${dietaryGoals}
    Current Diet: ${currentDiet}
    
    Please provide specific recommendations including:
    1. Daily meal plan
    2. Foods to include
    3. Foods to avoid
    4. Healthy halal alternatives
    5. Additional lifestyle tips
    
    Keep all recommendations halal-compliant and consider the health conditions provided.`;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting diet recommendations:', error);
    return language === 'id' ? 
      'Maaf, terjadi kesalahan dalam menghasilkan rekomendasi. Silakan coba lagi.' : 
      'Sorry, there was an error generating recommendations. Please try again.';
  }
}