import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Toast from '../ui/Toast';
import styles from './ContactForm.module.css';

const ContactForm = ({ language = 'fr' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'EduAI Team',
      };

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setToast({
          message: 'Message envoyé avec succès! Nous vous répondrons bientôt.',
          type: 'success',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setToast({
        message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  const getPlaceholder = (field) => {
    const placeholders = {
      fr: {
        name: 'Jean Dupont',
        email: 'jean@lycee.fr',
        message: 'Dis-nous tout...',
      },
      en: {
        name: 'John Doe',
        email: 'john@school.com',
        message: 'Tell us everything...',
      },
      ar: {
        name: 'أحمد محمد',
        email: 'ahmed@school.com',
        message: 'أخبرنا بكل شيء...',
      },
    };
    return placeholders[language]?.[field] || placeholders.fr[field];
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return language === 'fr' ? 'Envoi en cours...' : 
             language === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    }
    return language === 'fr' ? 'Envoyer le message' : 
           language === 'ar' ? 'إرسال الرسالة' : 'Send the message';
  };

  return (
    <section id="contact" className={styles.contactForm}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {language === 'fr' ? 'Contacte-nous' : 
             language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'fr' 
              ? 'Une question, une idée, un bug ? On est là pour toi. 💬'
              : language === 'ar'
              ? 'لديك سؤال، فكرة، أو خلل؟ نحن هنا من أجلك. 💬'
              : 'A question, an idea, a bug? We are here for you. 💬'}
          </p>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.decorativeCorner} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                <User size={18} />
                <span>{language === 'fr' ? 'Ton nom' : 
                      language === 'ar' ? 'اسمك' : 'Your name'}</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={getPlaceholder('name')}
                className={`${styles.input} ${errors.name ? styles.error : ''}`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className={styles.errorMessage}>
                  <AlertCircle className={styles.errorIcon} />
                  {errors.name}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={18} />
                <span>{language === 'fr' ? 'Ton email' : 
                      language === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={getPlaceholder('email')}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className={styles.errorMessage}>
                  <AlertCircle className={styles.errorIcon} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                <MessageSquare size={18} />
                <span>{language === 'fr' ? 'Ton message' : 
                      language === 'ar' ? 'رسالتك' : 'Your message'}</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={getPlaceholder('message')}
                className={`${styles.textarea} ${errors.message ? styles.error : ''}`}
                rows={5}
                disabled={isSubmitting}
              />
              {errors.message && (
                <div className={styles.errorMessage}>
                  <AlertCircle className={styles.errorIcon} />
                  {errors.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  <span>{getButtonText()}</span>
                </>
              ) : (
                <>
                  <Send className={styles.submitIcon} />
                  <span>{getButtonText()}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={closeToast}
          />
        )}
      </div>
    </section>
  );
};

export default ContactForm;
