import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from "./context";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import Decouvrir from './Components/Decouvrir/Decouvrir';
import Consult from './Components/Consult/Consult';
import SpecialtyPage from './Components/SpecialtyPage/SpecialtyPage';
import SymptomPage from './Components/SymptomPage/SymptomPage';
import Inscrit from './Components/Inscrit/Inscrit';
import DoctorPage from './Components/DoctorPage/DoctorPage';
import PatientDetails from './Components/PatientDetails/PatientDetails';
import Profile from './Components/Profile/Profile';
import HistoriquePatient from './Components/HistoriquePatient/HistoriquePatient';
import Conversation from './Components/Conversation/Conversation';
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NewsPage from './pages/NewsPage';


const App = () => {

 useUser();
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/decouvrir" element={<Decouvrir />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/inscrit" element={<Inscrit />} />
        <Route path="/news" element={<NewsPage />} />
        



        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/:id" 
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PatientDetails />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={["doctor", "patient"]}>
              <Profile />
            </ProtectedRoute>
          } 
        />
         




<Route 
          path="/consult" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Consult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/specialty/:specialty" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <SpecialtyPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/symptoms/:doctorId" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <SymptomPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historique/:patientId" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <HistoriquePatient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/conversation/:doctorId" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Conversation />
            </ProtectedRoute>
          } 
        />
        



        
        
        
        
      </Routes>
    </Router>
  );
}

export default App;
