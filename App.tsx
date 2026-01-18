
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MultiStepForm from './components/MultiStepForm';
import SocialProof from './components/SocialProof';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ChatRobot from './components/ChatRobot';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <MultiStepForm />
        <FAQ />
      </main>
      <Footer />
      
      {/* Robot Triage Chatbot */}
      <ChatRobot />
    </div>
  );
}

export default App;
