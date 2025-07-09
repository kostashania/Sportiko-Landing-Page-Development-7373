import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import FeaturesSection from './sections/FeaturesSection';
import BenefitsSection from './sections/BenefitsSection';
import DemoSection from './sections/DemoSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

const LandingPage = () => {
  const { loadSettings, loadFeatures, loadDemoItems, loadContactInfo } = useSettings();

  // Load all necessary data when the component mounts
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Loading landing page data...');
        await Promise.all([
          loadSettings(),
          loadFeatures(),
          loadDemoItems(),
          loadContactInfo()
        ]);
        console.log('Landing page data loaded successfully');
      } catch (error) {
        console.error('Error loading landing page data:', error);
      }
    };

    initializeData();
  }, [loadSettings, loadFeatures, loadDemoItems, loadContactInfo]);

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