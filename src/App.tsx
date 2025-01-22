import React, { useState, useEffect } from 'react';
import { Brain, Salad, Heart, Loader2, History, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDietRecommendations } from './lib/gemini';
import { Auth } from './components/Auth';
import { Footer } from './components/Footer';
import { LanguageSelector } from './components/LanguageSelector';
import { ProgressChart } from './components/ProgressChart';
import { supabase } from './lib/supabase';
import { translations } from './lib/translations';
import ReactMarkdown from 'react-markdown';

function App() {
  const [language, setLanguage] = useState('en');
  const [healthConditions, setHealthConditions] = useState('');
  const [dietaryGoals, setDietaryGoals] = useState('');
  const [currentDiet, setCurrentDiet] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const t = translations[language];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('diet_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setSavedHistory(data);
    }
  };

  const getProgressData = () => {
    return savedHistory.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(),
      recommendations: 1
    })).reverse();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await getDietRecommendations(
        healthConditions,
        dietaryGoals,
        currentDiet,
        language
      );
      setRecommendations(result);
      setShowConfetti(true);
      
      if (user) {
        await supabase.from('diet_history').insert([{
          user_id: user.id,
          health_conditions: healthConditions,
          dietary_goals: dietaryGoals,
          current_diet: currentDiet,
          recommendations: result
        }]);
        loadHistory();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="max-w-4xl mx-auto px-4 py-4"
        >
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Brain className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </motion.div>
            <div className="flex items-center gap-4">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <Auth user={user} translations={t} />
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="inline-block w-4 h-4 mr-2" />
                {t.healthConditions}
              </label>
              <textarea
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder={t.healthConditionsPlaceholder}
                rows={3}
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Salad className="inline-block w-4 h-4 mr-2" />
                {t.dietaryGoals}
              </label>
              <textarea
                value={dietaryGoals}
                onChange={(e) => setDietaryGoals(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder={t.dietaryGoalsPlaceholder}
                rows={3}
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring" }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.currentDiet}
              </label>
              <textarea
                value={currentDiet}
                onChange={(e) => setCurrentDiet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder={t.currentDietPlaceholder}
                rows={3}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.generatingRecommendations}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {t.getRecommendations}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <AnimatePresence>
          {recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-xl p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.personalizedRecommendations}</h2>
              <div className="prose max-w-none">
                <ReactMarkdown>{recommendations}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {user && savedHistory.length > 0 && (
          <>
            <ProgressChart data={getProgressData()} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <History className="w-5 h-5" />
                {t.previousRecommendations}
              </h2>
              <div className="space-y-4">
                {savedHistory.map((item, index) => (
                  <motion.details
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 group"
                  >
                    <summary className="font-medium text-gray-700 cursor-pointer hover:text-green-600 transition-colors">
                      {t.recommendationFrom} {new Date(item.created_at).toLocaleDateString()}
                    </summary>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="mt-4 space-y-2"
                    >
                      <div className="text-sm">
                        <strong>{t.healthConditions}:</strong> {item.health_conditions}
                      </div>
                      <div className="text-sm">
                        <strong>{t.dietaryGoals}:</strong> {item.dietary_goals}
                      </div>
                      <div className="prose max-w-none mt-4">
                        <ReactMarkdown>{item.recommendations}</ReactMarkdown>
                      </div>
                    </motion.div>
                  </motion.details>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </main>

      <Footer translations={t} />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Add confetti animation here */}
        </div>
      )}
    </div>
  );
}

export default App;