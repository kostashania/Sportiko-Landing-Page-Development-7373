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

  // Load all data when the landing page mounts
  useEffect(() => {
    console.log('LandingPage: Loading all data...');
    const loadAllData = async () => {
      try {
        await Promise.all([
          loadSettings(),
          loadFeatures(),
          loadDemoItems(),
          loadContactInfo()
        ]);
        console.log('LandingPage: All data loaded successfully');
      } catch (error) {
        console.error('LandingPage: Error loading data:', error);
      }
    };

    loadAllData();
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