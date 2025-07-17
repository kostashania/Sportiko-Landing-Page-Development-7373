import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;