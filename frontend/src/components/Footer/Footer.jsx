import { Brain, Globe, Linkedin, Mail, Heart } from 'lucide-react';
import styles from './Footer.module.css';
import signatureUrl from '../../assets/signature.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Portfolio',
      icon: Globe,
      href: 'https://ahmed-bessem-drira.vercel.app/',
      label: 'Portfolio Profile',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/ahmed-bessem-drira/',
      label: 'LinkedIn Profile',
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:dahmedbessem@gmail.com',
      label: 'Email Contact',
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Brain className={styles.brainIcon} />
              </div>
              <span className={styles.logoText}>EduAI</span>
            </div>
            <p className={styles.description}>
              Transformez vos cours en intelligence avec l'IA. 
              Analyse, résumé, et quiz interactifs pour un apprentissage amélioré.
            </p>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Liens Rapides</h3>
            <nav className={styles.nav}>
              <a href="#home" className={styles.navLink}>
                Accueil
              </a>
              <a href="#about" className={styles.navLink}>
                À Propos
              </a>
              <a href="#summarize" className={styles.navLink}>
                Résumer
              </a>
              <a href="#future" className={styles.navLink}>
                Le futur
              </a>
              <a href="#contact" className={styles.navLink}>
                Contact
              </a>
            </nav>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Suivez-nous</h3>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className={styles.socialIcon} />
                </a>
              ))}
            </div>
            <div className={styles.newsletter}>
              <p className={styles.newsletterText}>
                Restez informé des nouvelles fonctionnalités
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p className={styles.copyrightText}>
              © {currentYear} EduAI. Tous droits réservés.
            </p>
          </div>
          <div className={styles.signature}>
            <img src={signatureUrl} alt="Signature" className={styles.signatureImg} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
