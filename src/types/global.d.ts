// Add type declarations for the global window object
declare global {
  interface Window {
    sqlDb: any; // This will be our SQL.js database instance
  }
}

export {}; // This file needs to be a module
