import Hero from './Hero';
import ServicesOverview from './ServicesOverview';
import FeaturedProjects from './FeaturedProjects';
import Testimonials from './Testimonials';
import ContactCTA from './ContactCTA';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedProjects />
      <ServicesOverview />
      <Testimonials />
      <ContactCTA />
    </div>
  );
};

export default HomePage;
