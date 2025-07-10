import { motion } from 'framer-motion';
import QuotingTool from './QuotingTool';
import './QuotingPage.css';

const QuotingPage = () => {
  return (
    <div className="quoting-page">
      <div className="quoting-hero">
        <div className="quoting-hero-overlay"></div>
        <div className="container">
          <h1 className="quoting-hero-title">Services & Pricing</h1>
          <p className="quoting-hero-subtitle">
            Build your custom quote with our interactive quoting tool
          </p>
        </div>
      </div>

      <section className="quoting-intro">
        <div className="container">
          <div className="intro-content">
            <h2>Transparent Pricing for Quality Services</h2>
            <p>
              At SkillAxis Dynamics, we believe in transparent pricing and delivering exceptional value. Our interactive quoting tool allows you to build a custom quote based on your specific needs. Simply select the services you're interested in, adjust quantities as needed, and request a detailed quote.
            </p>
            <p>
              Our team of experts is ready to help you bring your vision to life with our comprehensive range of services, from graphic design and web development to CNC conversions and software development.
            </p>
          </div>
        </div>
      </section>

      <QuotingTool />

      <section className="quoting-faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How does your pricing work?</h3>
              <p>
                Our pricing is based on the scope and complexity of each project. We provide transparent pricing for standard services, but custom projects may require a detailed quote. Use our quoting tool to get an estimate, and we'll follow up with a detailed proposal.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you offer discounts for multiple services?</h3>
              <p>
                Yes, we offer package discounts when you combine multiple services. Contact us for details on how we can create a custom package that meets your needs and budget.
              </p>
            </div>
            <div className="faq-item">
              <h3>What is your payment process?</h3>
              <p>
                For most projects, we require a 50% deposit to begin work, with the remaining balance due upon completion. For larger projects, we can arrange milestone payments. We accept bank transfers, credit cards, and other payment methods.
              </p>
            </div>
            <div className="faq-item">
              <h3>How long do projects typically take?</h3>
              <p>
                Project timelines vary based on scope and complexity. Small projects may take a few days, while larger projects can take several weeks or months. We'll provide a detailed timeline in your project proposal.
              </p>
            </div>
            <div className="faq-item">
              <h3>Do you offer ongoing support after project completion?</h3>
              <p>
                Yes, we offer various maintenance and support packages to ensure your project continues to perform optimally. These can be added to your quote or discussed after project completion.
              </p>
            </div>
            <div className="faq-item">
              <h3>Can I request a custom service not listed in the quoting tool?</h3>
              <p>
                Absolutely! Our quoting tool covers our most common services, but we offer many more specialized services. Contact us directly to discuss your custom requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="quoting-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Contact our team today to discuss your project requirements and how we can help you achieve your goals.
            </p>
            <div className="cta-buttons">
              <a href="/contact" className="btn btn-primary">
                Contact Us
              </a>
              <a href="#" className="btn btn-secondary" onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                Build Your Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotingPage;
