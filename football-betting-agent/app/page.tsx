'use client';

import { useState } from 'react';

interface Match {
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
}

interface Analysis {
  match: Match;
  prediction: string;
  confidence: number;
  recommendedBet: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  analysis: string;
  keyFactors: string[];
}

export default function Home() {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [league, setLeague] = useState('Premier League');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const leagues = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
    'Champions League',
    'Europa League',
  ];

  const analyzeMatch = async () => {
    if (!homeTeam || !awayTeam) {
      alert('Please enter both teams');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam,
          awayTeam,
          league,
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">⚽ Football Betting Agent</h1>
          <p className="text-green-100 text-lg">AI-Powered Match Analysis & Betting Recommendations</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Match Analysis</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Home Team
                </label>
                <input
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="e.g., Manchester United"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Away Team
                </label>
                <input
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="e.g., Liverpool"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                League/Competition
              </label>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none text-gray-800"
              >
                {leagues.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <button
              onClick={analyzeMatch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Match...
                </span>
              ) : (
                'Analyze Match'
              )}
            </button>
          </div>

          {analysis && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
                  {analysis.match.homeTeam} vs {analysis.match.awayTeam}
                </h3>
                <p className="text-center text-gray-600">{analysis.match.league}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-blue-600 font-semibold mb-2">Home Win</p>
                    <p className="text-3xl font-bold text-blue-700">{analysis.odds.home.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Draw</p>
                    <p className="text-3xl font-bold text-gray-700">{analysis.odds.draw.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-semibold mb-2">Away Win</p>
                    <p className="text-3xl font-bold text-red-700">{analysis.odds.away.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Recommended Bet</h4>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                      {analysis.confidence}%
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-700 mb-2">{analysis.recommendedBet}</p>
                <p className="text-lg text-gray-700">{analysis.prediction}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Analysis</h4>
                <p className="text-gray-700 leading-relaxed">{analysis.analysis}</p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Key Factors</h4>
                <ul className="space-y-2">
                  {analysis.keyFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2 text-xl">•</span>
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> This analysis is for informational purposes only.
                  Gambling involves risk. Please bet responsibly and within your means.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
