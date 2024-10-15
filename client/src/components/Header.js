import React from "react";

const Header = ({ onLogout }) => {
  return (
    <header className="bg-gray-800 text-white py-4 px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">PDF Summarizer</h1>
        <button
          className="text-sm bg-red-500 px-4 py-2 rounded"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
