import React, { useEffect, useState } from 'react';
import { Database, CheckCircle, Loader } from 'lucide-react';

interface DatabaseManagerProps {
  onDatabaseReady: (db: any) => void;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({ onDatabaseReady }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Import SQL.js dynamically
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`
        });

        // Create database
        const db = new SQL.Database();

        // Create tables and insert sample data
        const initScript = `
          -- Create movies table
          CREATE TABLE movies (
            movie_id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            year INTEGER,
            language TEXT,
            duration INTEGER
          );

          -- Create genres table
          CREATE TABLE genres (
            movie_id INTEGER,
            genre TEXT,
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
          );

          -- Create ratings table
          CREATE TABLE ratings (
            rating_id INTEGER PRIMARY KEY,
            movie_id INTEGER,
            user_id INTEGER,
            rating REAL,
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
          );

          -- Insert sample movies
          INSERT INTO movies (movie_id, title, year, language, duration) VALUES
          (1, 'Inception', 2010, 'English', 148),
          (2, 'Interstellar', 2014, 'English', 169),
          (3, 'The Dark Knight', 2008, 'English', 152),
          (4, 'Pulp Fiction', 1994, 'English', 154),
          (5, 'The Matrix', 1999, 'English', 136),
          (6, 'Forrest Gump', 1994, 'English', 142),
          (7, 'The Godfather', 1972, 'English', 175),
          (8, 'Parasite', 2019, 'Korean', 132),
          (9, 'Spirited Away', 2001, 'Japanese', 125),
          (10, 'Avengers: Endgame', 2019, 'English', 181),
          (11, 'Titanic', 1997, 'English', 194),
          (12, 'The Lion King', 1994, 'English', 88),
          (13, 'Gladiator', 2000, 'English', 155),
          (14, 'Avatar', 2009, 'English', 162),
          (15, 'Joker', 2019, 'English', 122);

          -- Insert genres
          INSERT INTO genres (movie_id, genre) VALUES
          (1, 'Sci-Fi'), (1, 'Action'), (1, 'Thriller'),
          (2, 'Sci-Fi'), (2, 'Drama'),
          (3, 'Action'), (3, 'Crime'), (3, 'Drama'),
          (4, 'Crime'), (4, 'Drama'),
          (5, 'Action'), (5, 'Sci-Fi'),
          (6, 'Drama'), (6, 'Romance'),
          (7, 'Crime'), (7, 'Drama'),
          (8, 'Thriller'), (8, 'Drama'),
          (9, 'Animation'), (9, 'Family'),
          (10, 'Action'), (10, 'Adventure'), (10, 'Sci-Fi'),
          (11, 'Romance'), (11, 'Drama'),
          (12, 'Animation'), (12, 'Family'), (12, 'Musical'),
          (13, 'Action'), (13, 'Drama'), (13, 'History'),
          (14, 'Action'), (14, 'Adventure'), (14, 'Sci-Fi'),
          (15, 'Crime'), (15, 'Drama'), (15, 'Thriller');

          -- Insert sample ratings
          INSERT INTO ratings (rating_id, movie_id, user_id, rating) VALUES
          (1, 1, 101, 9.2), (2, 1, 102, 8.8), (3, 1, 103, 9.0), (4, 1, 104, 8.5),
          (5, 2, 101, 9.5), (6, 2, 102, 9.1), (7, 2, 103, 8.9), (8, 2, 104, 9.3),
          (9, 3, 101, 9.8), (10, 3, 102, 9.4), (11, 3, 103, 9.6), (12, 3, 104, 9.2),
          (13, 4, 101, 8.9), (14, 4, 102, 9.1), (15, 4, 103, 8.7), (16, 4, 104, 8.8),
          (17, 5, 101, 8.7), (18, 5, 102, 8.9), (19, 5, 103, 8.5), (20, 5, 104, 8.6),
          (21, 6, 101, 8.8), (22, 6, 102, 9.0), (23, 6, 103, 8.6), (24, 6, 104, 8.9),
          (25, 7, 101, 9.7), (26, 7, 102, 9.8), (27, 7, 103, 9.5), (28, 7, 104, 9.6),
          (29, 8, 101, 9.0), (30, 8, 102, 8.8), (31, 8, 103, 9.2), (32, 8, 104, 8.9),
          (33, 9, 101, 9.3), (34, 9, 102, 9.1), (35, 9, 103, 9.4), (36, 9, 104, 9.0),
          (37, 10, 101, 8.4), (38, 10, 102, 8.6), (39, 10, 103, 8.2), (40, 10, 104, 8.5),
          (41, 11, 101, 7.8), (42, 11, 102, 8.0), (43, 11, 103, 7.9), (44, 11, 104, 8.1),
          (45, 12, 101, 8.5), (46, 12, 102, 8.7), (47, 12, 103, 8.3), (48, 12, 104, 8.6),
          (49, 13, 101, 8.5), (50, 13, 102, 8.7), (51, 13, 103, 8.4), (52, 13, 104, 8.6),
          (53, 14, 101, 7.8), (54, 14, 102, 8.0), (55, 14, 103, 7.9), (56, 14, 104, 7.7),
          (57, 15, 101, 8.4), (58, 15, 102, 8.6), (59, 15, 103, 8.2), (60, 15, 104, 8.5);
        `;

        db.exec(initScript);
        onDatabaseReady(db);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, [onDatabaseReady]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Database Status</h2>
      </div>
      
      <div className="flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 text-yellow-400 animate-spin" />
            <span className="text-gray-300">Initializing SQLite database...</span>
          </>
        ) : isInitialized ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-gray-300">
              Database ready with sample movie dataset (15 movies, 3 tables)
            </span>
          </>
        ) : (
          <>
            <div className="h-5 w-5 bg-red-400 rounded-full" />
            <span className="text-gray-300">Failed to initialize database</span>
          </>
        )}
      </div>

      {isInitialized && (
        <div className="mt-4 p-4 bg-gray-700 rounded border-l-4 border-blue-500">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Available Tables:</strong>
          </p>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• <code className="text-blue-300">movies</code> - Movie details (title, year, language, duration)</li>
            <li>• <code className="text-blue-300">genres</code> - Movie genres (movie_id, genre)</li>
            <li>• <code className="text-blue-300">ratings</code> - User ratings (rating_id, movie_id, user_id, rating)</li>
          </ul>
        </div>
      )}
    </div>
  );
};