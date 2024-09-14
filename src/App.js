import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WalkersTable from './components/WalkerTable';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>   
          <ToastContainer />

     <Router>
      <Routes>
        <Route path="" element={<Dashboard />} />
        <Route path="/walker" element={<WalkersTable />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
