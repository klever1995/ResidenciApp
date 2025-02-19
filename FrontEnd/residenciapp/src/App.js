import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PropertyList from './components/PropertyListOwner';
import PropertyDetail from './components/PropertyDetail';
import PropertyForm from './components/PropertyForm';
import CreateProperty from "./components/CreateProperty";
import CreateReservation from "./components/CreateReservation";
import ManageReservation from "./components/ManageReservation";
import Reservations from "./pages/Dashboard";
import LoginSelector from "./components/Identify";
import LoginOwners from "./components/LoginOwners";
import LoginStudents from "./components/LoginStudents";
import OwnerCreate from "./components/OwnerCreate";
import StudentCreate from "./components/StudentCreate";
import PrincipalStudents from "./components/PrincipalStudents";
import FilteredProperties from "./components/ListProperties";
import SearchInvoices from "./components/SearchInvoices";
import StudentProfile from "./components/StudentProfile";
import PrincipalOwners from "./components/PrincipalOwners";
import CommentForm from "./components/CommentForm";
import ReservationList from "./components/ReservationList";



import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



function App() {
    return (
        <Router>
            <Routes>
            <Route path="/StudentProfile" element={<StudentProfile/>} />
            <Route path="/" element={<LoginSelector/>} />
            <Route path="/listProperties" element={<FilteredProperties/>} />
            <Route path="/SearchInvoices" element={<SearchInvoices/>} />
            <Route path="/principalStudents" element={<PrincipalStudents/>} />
            <Route path="/principalOwners" element={<PrincipalOwners/>} />
            <Route path="/loginStudent" element={<LoginStudents/>} />
            <Route path="/studentCreate" element={<StudentCreate/>} />
            <Route path="/loginOwner" element={<LoginOwners/>} />
            <Route path="/ownerCreate" element={<OwnerCreate/>} />
            <Route path="/createReservation/:id" element={<CreateReservation/>} />
            <Route path="/manageReservation" element={<ManageReservation />} />
            <Route path="/createProperty" element={<CreateProperty />} />
            <Route path="/PropertyList" element={<PropertyList />} />
            <Route path="/StudentProfile" element={<StudentProfile/>} />
            <Route path="/comments" element={<CommentForm />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/PropertyDetail" element={<PropertyDetail />} />
                <Route path="/dashboard" element={<Reservations />} />
                <Route path="/" element={<PropertyList />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/update/:id" element={<PropertyForm />} />
            </Routes>
        </Router>
    );
}

export default App;
