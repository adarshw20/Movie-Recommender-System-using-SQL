import React, { useState, useCallback } from 'react';
import { Upload, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface DatasetManagerProps {
  db: any; // SQL.js database instance
  onDatasetImported: () => void;
}

export const DatasetManager: React.FC<DatasetManagerProps> = ({ db, onDatasetImported }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tableName, setTableName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Set table name from filename (remove extension)
      const name = e.target.files[0].name.split('.').slice(0, -1).join('.');
      setTableName(name.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
    }
  };

  const processCSV = (csv: string, delimiter = ',') => {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/[^a-z0-9_]/gi, '_').toLowerCase());
    const rows = lines.slice(1).map(line => {
      const values = line.split(delimiter).map(v => v.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as Record<string, string>);
    });

    return { headers, rows };
  };

  const handleImport = useCallback(async () => {
    if (!selectedFile || !tableName) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const content = await selectedFile.text();
      const { headers, rows } = processCSV(content);

      if (headers.length === 0 || rows.length === 0) {
        throw new Error('No valid data found in the file');
      }

      // Create SQL to create table and insert data
      const createTableSQL = `
        DROP TABLE IF EXISTS ${tableName};
        CREATE TABLE ${tableName} (
          ${headers.map(h => `${h} TEXT`).join(',\n          ')}
        );
      `;

      const insertSQL = `
        INSERT INTO ${tableName} (${headers.join(', ')})
        VALUES ${rows.map(row => 
          `(${headers.map(header => `'${row[header]?.toString().replace(/'/g, "''") || ''}')`).join(', ')})`
        ).join(',\n        ')};
      `;

      // Execute the SQL
      db.run(createTableSQL);
      db.run(insertSQL);

      setSuccess(`Successfully imported ${rows.length} rows into table '${tableName}'`);
      onDatasetImported();
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import dataset');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, tableName, onDatasetImported]);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Dataset Manager</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Upload CSV File
          </label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md border border-gray-600">
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : 'Choose a file...'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="tableName" className="block text-sm font-medium text-gray-300 mb-1">
            Table Name
          </label>
          <input
            type="text"
            id="tableName"
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Enter table name"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleImport}
            disabled={isLoading || !selectedFile || !tableName}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
              isLoading || !selectedFile || !tableName
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Import Dataset
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-400 font-medium">Import Error</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-400 font-medium">Success</h3>
              <p className="text-green-300 text-sm mt-1">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
