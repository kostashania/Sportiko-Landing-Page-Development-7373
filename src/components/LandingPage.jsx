import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import FeaturesSection from './sections/FeaturesSection';
import BenefitsSection from './sections/BenefitsSection';
import DemoSection from './sections/DemoSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <HeroSection />
      <IntroSection />
      <FeaturesSection />
      <BenefitsSection />
      <DemoSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;