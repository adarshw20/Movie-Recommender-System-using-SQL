import React, { useState, useEffect, useCallback } from 'react';
import { Database, Play, Download, BarChart3, Film, Upload } from 'lucide-react';
import { DatabaseManager } from './components/DatabaseManager';
import { QueryPanel } from './components/QueryPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { StatsPanel } from './components/StatsPanel';
import { DatasetManager } from './components/DatasetManager';

export interface QueryResult {
  headers: string[];
  rows: any[][];
  query: string;
  timestamp: Date;
}

// Make database available globally for DatasetManager
if (typeof window !== 'undefined') {
  (window as any).sqlDb = null;
}

function App() {
  const [db, setDb] = useState<any>(null);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatasetManager, setShowDatasetManager] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Update global db reference when db changes
  useEffect(() => {
    if (db) {
      (window as any).sqlDb = db;
      setDbInitialized(true);
    }
  }, [db]);

  const refreshData = useCallback(() => {
    setCurrentResult(null);
  }, []);

  const handleQueryExecute = async (query: string) => {
    if (!db) {
      setError('Database not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // SQL.js uses exec() for all queries
      const result = db.exec(query);
      
      if (result.length === 0) {
        // For queries that don't return results (INSERT, UPDATE, DELETE)
        setCurrentResult({
          headers: ['Status'],
          rows: [['Query executed successfully']],
          query,
          timestamp: new Date()
        });
        return;
      }

      // For SELECT queries, result[0] contains the query results
      const { columns, values } = result[0];
      
      setCurrentResult({
        headers: columns,
        rows: values,
        query,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Query error:', err);
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Film className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Movie Analysis Project</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore movie datasets using beginner-friendly SQL queries. Practice joins, aggregations, and data analysis without complex features.
          </p>
        </div>

        {/* Database Manager */}
        <div className="space-y-6">
          <DatabaseManager onDatabaseReady={setDb} />
          
          {dbInitialized && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowDatasetManager(!showDatasetManager)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                <Upload className="h-4 w-4" />
                {showDatasetManager ? 'Hide Dataset Manager' : 'Manage Datasets'}
              </button>
            </div>
          )}
        </div>

        {showDatasetManager && dbInitialized && (
          <div className="mt-6">
            <DatasetManager db={db} onDatasetImported={refreshData} />
          </div>
        )}

        {db && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Query Panel */}
            <div className="space-y-6">
              <QueryPanel onExecute={handleQueryExecute} isLoading={isLoading} />
              <StatsPanel db={db} />
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <ResultsPanel 
                result={currentResult} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            Practice SQL fundamentals: SELECT, JOIN, GROUP BY, ORDER BY, and basic aggregations
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;