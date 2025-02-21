import React from 'react';
import { Link } from 'react-router-dom'; 
const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Anime</Link></li>
            <li><Link to="/">Manga</Link></li>
            <li><Link to="/">TV</Link></li>
            <li><Link to="/">Movies</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;