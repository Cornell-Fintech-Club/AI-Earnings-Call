// Header.tsx
import React from 'react';
import logo from './logo.png';

const Header: React.FC = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <div className="title">AI Earnings Call</div>
    </div>
  );
};
export default Header;