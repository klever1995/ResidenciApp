import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LoginSelector from './Identify';
import LoginStudents from './LoginStudents';
import StudentCreate from './StudentCreate';
import LoginOwners from './LoginOwners';
import OwnerCreate from './OwnerCreate';
import PrincipalStudents from './PrincipalStudents';
import PrincipalOwners from './PrincipalOwners';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelector />} />
        <Route path='/LoginStudents' element={<LoginStudents/>}/>
        <Route path='/StudentCreate' element={<StudentCreate/>}/>
        <Route path='/PrincipalStudents' element={<PrincipalStudents/>}/>
        <Route path='/LoginOwners' element={<LoginOwners/>}/>
        <Route path='/OwnerCreate' element={<OwnerCreate/>}/>
        <Route path='/PrincipalOwners' element={<PrincipalOwners/>}/>



      </Routes>
    </Router>
  );
};

export default App;
