import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

//ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//)
const container = document.getElementById('root');
const root = createRoot(container); // Ensure container is not null
root.render( 
    <App />
);