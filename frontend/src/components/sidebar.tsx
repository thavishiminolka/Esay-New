import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 bg-blue-900 h-screen flex flex-col items-center py-4">
      <button className="text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;