import React from 'react';
import { Table, Download, Clock, AlertCircle } from 'lucide-react';
import { QueryResult } from '../App';

interface ResultsPanelProps {
  result: QueryResult | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
  const exportToCSV = () => {
    if (!result) return;

    const csvContent = [
      result.headers.join(','),
      ...result.rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Table className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Query Results</h2>
          </div>
          {result && (
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-gray-300">Executing query...</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium">Query Error</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Executed at {result.timestamp.toLocaleTimeString()}
              </div>
              <div>
                {result.rows.length} row{result.rows.length !== 1 ? 's' : ''} returned
              </div>
            </div>

            {result.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {result.headers.map((header, index) => (
                        <th key={index} className="text-left p-3 bg-gray-700 text-gray-300 font-semibold border-b border-gray-600">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-700/50 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-3 text-gray-300 border-b border-gray-700">
                            {cell !== null ? String(cell) : <span className="text-gray-500 italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Query executed successfully but returned no results.
              </div>
            )}

            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Executed Query:</h4>
              <pre className="text-xs text-gray-400 font-mono overflow-x-auto">{result.query}</pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a query to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
};