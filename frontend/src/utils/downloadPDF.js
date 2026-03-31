import jsPDF from 'jspdf';

export const downloadResultsPDF = (data, language = 'fr') => {
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  doc.setFontSize(20);
  
  const title = language === 'fr' ? 'Analyse de Cours EduAI' : 
                language === 'ar' ? 'تحليل الدورة التعليمية' : 
                'EduAI Course Analysis';
  
  doc.text(title, 20, 20);
  
  doc.setFontSize(14);
  doc.text(`${language === 'fr' ? 'Généré le' : language === 'ar' ? 'تم إنشاؤه في' : 'Generated on'}: ${new Date().toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  
  doc.setFontSize(16);
  doc.text(language === 'fr' ? 'Résumé' : language === 'ar' ? 'ملخص' : 'Summary', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(language === 'fr' ? 'Introduction:' : language === 'ar' ? 'مقدمة:' : 'Introduction:', 20, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  const introLines = doc.splitTextToSize(data.resume.introduction, 170);
  doc.text(introLines, 20, yPosition);
  yPosition += introLines.length * 5 + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text(language === 'fr' ? 'Points Clés:' : language === 'ar' ? 'النقاط الرئيسية:' : 'Key Points:', 20, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  data.resume.points_cles.forEach((point, index) => {
    const pointLines = doc.splitTextToSize(`${index + 1}. ${point}`, 170);
    doc.text(pointLines, 20, yPosition);
    yPosition += pointLines.length * 5 + 3;
    
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  yPosition += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.text(language === 'fr' ? 'Définitions:' : language === 'ar' ? 'التعريفات:' : 'Definitions:', 20, yPosition);
  yPosition += 7;
  
  doc.setFont('helvetica', 'normal');
  data.resume.definitions.forEach((def) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${def.terme}:`, 20, yPosition);
    yPosition += 5;
    
    doc.setFont('helvetica', 'normal');
    const defLines = doc.splitTextToSize(def.definition, 165);
    doc.text(defLines, 25, yPosition);
    yPosition += defLines.length * 5 + 5;
    
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
  });
  
  doc.addPage();
  yPosition = 20;
  
  doc.setFontSize(16);
  doc.text(language === 'fr' ? 'Questions à Choix Multiples' : language === 'ar' ? 'أسئلة الاختيار من متعدد' : 'Multiple Choice Questions', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  data.qcm.slice(0, 10).forEach((qcm, index) => {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${qcm.question}`, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    qcm.options.forEach((option) => {
      doc.text(option, 25, yPosition);
      yPosition += 5;
    });
    
    doc.setFont('helvetica', 'italic');
    doc.text(`${language === 'fr' ? 'Réponse:' : language === 'ar' ? 'الإجابة:' : 'Answer:'} ${qcm.reponse}`, 25, yPosition);
    yPosition += 5;
    
    doc.text(`${language === 'fr' ? 'Explication:' : language === 'ar' ? 'شرح:' : 'Explanation:'} ${qcm.explication}`, 25, yPosition);
    yPosition += 10;
  });
  
  doc.addPage();
  yPosition = 20;
  
  doc.setFontSize(16);
  doc.text(language === 'fr' ? 'Questions Ouvertes' : language === 'ar' ? 'أسئلة مفتوحة' : 'Open Questions', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  data.questions_ouvertes.slice(0, 5).forEach((question, index) => {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'italic');
    const corrigeLines = doc.splitTextToSize(`${language === 'fr' ? 'Corrigé:' : language === 'ar' ? 'تصحيح:' : 'Answer:'} ${question.corrige}`, 170);
    doc.text(corrigeLines, 20, yPosition);
    yPosition += corrigeLines.length * 5 + 10;
  });
  
  doc.save(`eduai-analysis-${Date.now()}.pdf`);
};
