import React, { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import InputZone from './components/InputZone/InputZone';
import OutputResume from './components/OutputResume/OutputResume';
import OutputQuiz from './components/OutputQuiz/OutputQuiz';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import './styles/global.css';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);

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
            language="fr"
          />
          <OutputQuiz 
            qcm={generatedContent.qcm}
            openQuestions={generatedContent.questions_ouvertes}
            language="fr"
          />
        </>
      )}
      
      <ContactForm language="fr" />
      <Footer />
    </div>
  );
}

export default App;
