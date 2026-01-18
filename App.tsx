
import React from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import MultiStepForm from './components/MultiStepForm.tsx';
import SocialProof from './components/SocialProof.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import ChatRobot from './components/ChatRobot.tsx';

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
