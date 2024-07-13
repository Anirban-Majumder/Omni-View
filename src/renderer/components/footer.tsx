import React from 'react';
import { Link } from 'react-router-dom'; 
const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/library">Library</Link></li>
          <li><Link to="/extension">Extension</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;