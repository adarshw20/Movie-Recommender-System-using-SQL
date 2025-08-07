import React, { useState } from 'react';
import { Play, BookOpen, Code } from 'lucide-react';

interface QueryPanelProps {
  onExecute: (query: string) => void;
  isLoading: boolean;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ onExecute, isLoading }) => {
  const [customQuery, setCustomQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const presetQueries = [
    {
      title: 'List All Movies',
      description: 'Basic SELECT to show all movies',
      query: 'SELECT * FROM movies;',
      difficulty: 'Beginner'
    },
    {
      title: 'Find Sci-Fi Movies',
      description: 'JOIN movies and genres tables',
      query: `SELECT DISTINCT m.title, m.year
FROM movies m
JOIN genres g ON m.movie_id = g.movie_id
WHERE g.genre = 'Sci-Fi'
ORDER BY m.year DESC;`,
      difficulty: 'Beginner'
    },
    {
      title: 'Movies by Genre Count',
      description: 'GROUP BY and COUNT aggregation',
      query: `SELECT genre, COUNT(*) AS total_movies
FROM genres
GROUP BY genre
ORDER BY total_movies DESC;`,
      difficulty: 'Beginner'
    },
    {
      title: 'Average Rating per Movie',
      description: 'JOIN with AVG aggregation',
      query: `SELECT m.title, ROUND(AVG(r.rating), 2) AS avg_rating
FROM movies m
JOIN ratings r ON m.movie_id = r.movie_id
GROUP BY m.title
ORDER BY avg_rating DESC;`,
      difficulty: 'Intermediate'
    },
    {
      title: 'Movies After 2010',
      description: 'WHERE clause with date filtering',
      query: `SELECT title, year, duration
FROM movies
WHERE year > 2010
ORDER BY year DESC;`,
      difficulty: 'Beginner'
    },
    {
      title: 'Top 5 Highest-Rated Movies',
      description: 'Complex query with LIMIT',
      query: `SELECT m.title, ROUND(AVG(r.rating), 2) AS avg_rating, m.year
FROM movies m
JOIN ratings r ON m.movie_id = r.movie_id
GROUP BY m.title, m.year
ORDER BY avg_rating DESC
LIMIT 5;`,
      difficulty: 'Intermediate'
    },
    {
      title: 'Long Movies by Language',
      description: 'Multi-condition filtering',
      query: `SELECT title, language, duration
FROM movies
WHERE duration > 150
ORDER BY duration DESC;`,
      difficulty: 'Beginner'
    },
    {
      title: 'Genre Distribution Analysis',
      description: 'Advanced aggregation with percentage',
      query: `SELECT 
  genre,
  COUNT(*) AS movie_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM genres), 1) AS percentage
FROM genres
GROUP BY genre
ORDER BY movie_count DESC;`,
      difficulty: 'Advanced'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'Advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">SQL Query Panel</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'preset'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Preset Queries
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Custom Query
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'preset' ? (
          <div className="space-y-4">
            {presetQueries.map((query, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{query.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(query.difficulty)}`}>
                    {query.difficulty}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{query.description}</p>
                <pre className="bg-gray-900 p-3 rounded text-sm text-gray-300 overflow-x-auto mb-3 font-mono">
                  {query.query}
                </pre>
                <button
                  onClick={() => onExecute(query.query)}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Play className="h-4 w-4" />
                  {isLoading ? 'Running...' : 'Execute'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Write your own SQL query:
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="SELECT * FROM movies WHERE year > 2000;"
                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => onExecute(customQuery)}
              disabled={isLoading || !customQuery.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Play className="h-4 w-4" />
              {isLoading ? 'Running...' : 'Execute Custom Query'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};