import React, { useState, useRef } from 'react';
import { Upload, FileText, X, RotateCcw } from 'lucide-react';
import { useUploadPDF } from '../../hooks/useUploadPDF';
import { useGenerate } from '../../hooks/useGenerate';
import Loader from '../ui/Loader';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';
import styles from './InputZone.module.css';

const InputZone = ({ onGenerate }) => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('fr');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const { uploadFile, isLoading: isUploading, error: uploadError, progress: uploadProgress } = useUploadPDF();
  const { generate, isLoading: isGenerating, error: generateError, progress: generateProgress } = useGenerate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    const result = await uploadFile(file);
    if (result) {
      setText(result.text);
      setMode('text');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    const result = await generate(text.trim(), language);
    if (result) {
      onGenerate(result);
    }
  };

  const handleReset = () => {
    setText('');
    setMode('text');
    setLanguage('fr');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLoading = isUploading || isGenerating;
  const progress = isUploading ? uploadProgress : generateProgress;
  const error = uploadError || generateError;

  return (
    <section id="tool" className={styles.inputZone}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Analyser votre cours</h2>
          <p className={styles.subtitle}>
            Collez votre texte ou uploadez un fichier PDF pour commencer l'analyse
          </p>
        </div>

        <div className={styles.modeSelector}>
          <button
            className={`${styles.modeButton} ${mode === 'text' ? styles.active : ''}`}
            onClick={() => setMode('text')}
          >
            <FileText className={styles.modeIcon} />
            Coller le texte
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'pdf' ? styles.active : ''}`}
            onClick={() => setMode('pdf')}
          >
            <Upload className={styles.modeIcon} />
            Uploader PDF
          </button>
        </div>

        <div className={styles.content}>
          {mode === 'text' ? (
            <div className={styles.textArea}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez votre contenu de cours ici..."
                className={styles.textInput}
                disabled={isLoading}
                maxLength={50000}
              />
              <div className={styles.charCounter}>
                {text.length} / 50,000 caractères
              </div>
            </div>
          ) : (
            <div
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className={styles.fileInput}
                disabled={isLoading}
              />
              <div className={styles.dropContent}>
                <Upload className={styles.dropIcon} />
                <p className={styles.dropText}>
                  Glissez-déposez votre PDF ici ou cliquez pour sélectionner
                </p>
                <p className={styles.dropHint}>
                  Format PDF uniquement • Maximum 10MB
                </p>
              </div>
            </div>
          )}

          <div className={styles.languageSelector}>
            <span className={styles.languageLabel}>Langue:</span>
            <div className={styles.languageButtons}>
              {[
                { code: 'fr', label: 'FR 🇫🇷' },
                { code: 'en', label: 'EN 🇬🇧' },
                { code: 'ar', label: 'AR 🇸🇦' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  className={`${styles.languageButton} ${language === lang.code ? styles.active : ''}`}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <Badge variant="hard">{error}</Badge>
            </div>
          )}

          {isLoading && (
            <div className={styles.loading}>
              <ProgressBar progress={progress} />
              <div className={styles.loadingText}>
                {isUploading ? 'Extraction du PDF...' : 'Génération du contenu...'}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.generateButton}
              onClick={handleGenerate}
              disabled={!text.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader type="spinner" size="small" />
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <span>Générer</span>
                  <FileText className={styles.buttonIcon} />
                </>
              )}
            </button>

            <button
              className={styles.resetButton}
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className={styles.buttonIcon} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InputZone;
