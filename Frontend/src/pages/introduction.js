import React from 'react';
import { Link } from 'react-router-dom';

const IntroductionPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-6xl text-blue-600 font-bold mb-8">
          Welcome to the Inventory Management System
        </h1>
        <p className="text-2xl text-blue-500 mb-6">
          Manage and track your inventory efficiently
        </p>
        <Link to="/login">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-500">
            Enter
          </button>
        </Link>
      </div>
    </div>
  );
};

export default IntroductionPage;
