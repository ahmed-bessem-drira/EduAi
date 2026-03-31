import React, { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import InputZone from './components/InputZone/InputZone';
import OutputResume from './components/OutputResume/OutputResume';
import OutputQuiz from './components/OutputQuiz/OutputQuiz';
import ChatInterface from './components/ChatInterface/ChatInterface';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import './styles/global.css';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [language, setLanguage] = useState('fr');

  const handleGenerate = (content) => {
    setGeneratedContent(content);
  };

  const courseContent = generatedContent ? 
    `${generatedContent.resume.introduction} ${generatedContent.resume.points_cles.join(' ')} ${generatedContent.resume.conclusion}` : 
    null;

  return (
    <div className="App">
      <Header />
      <Hero />
      <InputZone onGenerate={handleGenerate} />
      
      {generatedContent && (
        <>
          <OutputResume 
            resume={generatedContent.resume} 
            language={language}
          />
          <OutputQuiz 
            qcm={generatedContent.qcm}
            openQuestions={generatedContent.questions_ouvertes}
            language={language}
          />
          <ChatInterface 
            courseContent={courseContent}
            language={language}
          />
        </>
      )}
      
      <ContactForm language={language} />
      <Footer />
    </div>
  );
}

export default App;
