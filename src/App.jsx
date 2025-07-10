import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import DestinationsPage from './components/destinations/DestinationsPage';
import ExperiencesPage from './components/experiences/ExperiencesPage';
import OffersPage from './components/offers/OffersPage';
import DiningPage from './components/dining/DiningPage';
import SpaPage from './components/spa/SpaPage';
import MeetingsPage from './components/meetings/MeetingsPage';
import WeddingsPage from './components/weddings/WeddingsPage';
import ContactPage from './components/contact/ContactPage';
import ScrollToTop from './components/common/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/:country" element={<DestinationsPage />} />
          <Route path="destinations/:country/:city" element={<DestinationsPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="dining" element={<DiningPage />} />
          <Route path="spa" element={<SpaPage />} />
          <Route path="meetings" element={<MeetingsPage />} />
          <Route path="weddings" element={<WeddingsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
