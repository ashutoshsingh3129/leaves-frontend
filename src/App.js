import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeaveTable from './components/Dashboard';
import LeaveForm from './components/LeaveForm';
import WalkersTable from './components/WalkerTable';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<LeaveTable />} />
        <Route path="/leaves" element={<WalkersTable />} />
        <Route path="/add-leave" element={<LeaveForm />} />
      </Routes>
    </Router>
  );
};

export default App;
