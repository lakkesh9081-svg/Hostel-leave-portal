import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import HodDashboard from './pages/HodDashboard';
import WardenDashboard from './pages/WardenDashboard';

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path='/' element={<Login />} />

        <Route path='/student' element={<StudentDashboard />} />

        <Route path='/parent' element={<ParentDashboard />} />

        <Route path='/tutor' element={<TutorDashboard />} />

        <Route path='/hod' element={<HodDashboard />} />

        <Route path='/warden' element={<WardenDashboard />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App;