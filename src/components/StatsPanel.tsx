import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Film, Star } from 'lucide-react';

interface StatsPanelProps {
  db: any;
}

interface Stats {
  totalMovies: number;
  totalGenres: number;
  averageRating: number;
  mostPopularGenre: string;
  newestMovie: string;
  oldestMovie: string;
  longestMovie: string;
  shortestMovie: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ db }) => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!db) return;

    try {
      // Helper function to execute a query and get the first result
      const queryFirst = (sql: string) => {
        const result = db.exec(sql);
        return result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : null;
      };

      // Helper function to execute a query and get a single value
      const queryValue = (sql: string) => {
        const result = db.exec(sql);
        return result.length > 0 && result[0].values.length > 0 ? result[0].values[0][0] : 0;
      };

      const totalMovies = queryValue('SELECT COUNT(*) FROM movies');
      const totalGenres = queryValue('SELECT COUNT(DISTINCT genre) FROM genres');
      const averageRating = queryValue('SELECT ROUND(AVG(rating), 2) FROM ratings');
      
      const mostPopularGenre = queryFirst(`
        SELECT genre FROM genres 
        GROUP BY genre 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
      `) || 'N/A';

      const newestMovie = queryFirst(`
        SELECT title FROM movies 
        ORDER BY year DESC 
        LIMIT 1
      `) || 'N/A';

      const oldestMovie = queryFirst(`
        SELECT title FROM movies 
        ORDER BY year ASC 
        LIMIT 1
      `) || 'N/A';

      const longestMovie = queryFirst(`
        SELECT title FROM movies 
        ORDER BY duration DESC 
        LIMIT 1
      `) || 'N/A';

      const shortestMovie = queryFirst(`
        SELECT title FROM movies 
        ORDER BY duration ASC 
        LIMIT 1
      `) || 'N/A';

      setStats({
        totalMovies: Number(totalMovies) || 0,
        totalGenres: Number(totalGenres) || 0,
        averageRating: Number(averageRating) || 0,
        mostPopularGenre: String(mostPopularGenre),
        newestMovie: String(newestMovie),
        oldestMovie: String(oldestMovie),
        longestMovie: String(longestMovie),
        shortestMovie: String(shortestMovie)
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, [db]);

  if (!stats) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-orange-400" />
          <h2 className="text-xl font-semibold text-white">Dataset Statistics</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Film className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Total Movies</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalMovies}</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="text-gray-300 text-sm">Genres</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalGenres}</div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300 text-sm">Average Rating</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.averageRating}/10</div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">Most Popular Genre</span>
            <span className="text-white font-medium">{stats.mostPopularGenre}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">Newest Movie</span>
            <span className="text-white font-medium">{stats.newestMovie}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">Oldest Movie</span>
            <span className="text-white font-medium">{stats.oldestMovie}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400 text-sm">Longest Movie</span>
            <span className="text-white font-medium">{stats.longestMovie}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-sm">Shortest Movie</span>
            <span className="text-white font-medium">{stats.shortestMovie}</span>
          </div>
        </div>
      </div>
    </div>
  );
};