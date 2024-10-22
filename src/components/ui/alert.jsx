import React from 'react';

export const Alert = ({ children, className }) => {
  return (
    <div className={`p-4 bg-yellow-100 border border-yellow-300 rounded-md ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className }) => {
  return (
    <div className={`text-gray-700 ${className}`}>
      {children}
    </div>
  );
};
