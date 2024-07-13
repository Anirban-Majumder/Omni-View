import React from 'react';
import "./index.css"
//import { ipcRenderer } from 'electron';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/footer';
import Header from './components/header';
import Search from './pages/search';
import Library from './pages/library';
import Extension from './pages/extension';
import Settings from './pages/settings';
//import Store from 'electron-store';
//import { setDefaultStoreVariables } from '../modules/store';


//ipcRenderer.on('console-log', (event, toPrint) => {
//  console.log(toPrint);
//});

//const store = new Store(); // Use the imported Store class

const App = () => {
  //setDefaultStoreVariables();
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Search />} /> 
          <Route path="/search" element={<Search />} /> 
          <Route path="/library" element={<Library />} /> 
          <Route path="/extension" element={<Extension />} /> 
          <Route path="/settings" element={<Settings />} /> 
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;