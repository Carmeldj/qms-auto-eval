import { DocumentTemplate, DocumentData } from '../types/documents';
import jsPDF from 'jspdf';
import { supabase } from '../lib/supabase';

export interface LiaisonBookData {
  pharmacyName: string;
  date: string;
  time: string;
  author: string;
  recipients: string;
  priority: string;
  category: string;
  subject: string;
  message: string;
  actionRequired: string;
  deadline?: string;
}

export const shareToWhatsApp = async (
  template: DocumentTemplate,
  document: DocumentData,
  formData: Record<string, string>
): Promise<void> => {
  if (template.id !== 'liaison-book') {
    throw new Error('Le partage WhatsApp est disponible uniquement pour le cahier de liaison');
  }

  try {
    const pdfBlob = await generateLiaisonBookPDF(template, document);

    const documentUrl = await uploadPDFToSupabase(pdfBlob, document.id);

    const whatsappMessage = formatWhatsAppMessage(formData as unknown as LiaisonBookData, documentUrl);

    await saveLiaisonBookRecord(document, documentUrl);

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    showSuccessNotification();
  } catch (error) {
    console.error('Erreur lors du partage WhatsApp:', error);
    throw error;
  }
};

const generateLiaisonBookPDF = async (
  template: DocumentTemplate,
  document: DocumentData
): Promise<Blob> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const leftMargin = 20;
  const rightMargin = 20;
  let yPosition = 20;

  const data = document.data;

  pdf.setFillColor(0, 150, 136);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('CAHIER DE LIAISON', pageWidth / 2, 15, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text(data.pharmacyName || '', pageWidth / 2, 25, { align: 'center' });

  pdf.setFontSize(10);
  pdf.text(`${data.date || ''} à ${data.time || ''}`, pageWidth / 2, 33, { align: 'center' });

  yPosition = 50;
  pdf.setTextColor(0, 0, 0);

  const addSection = (label: string, value: string, isBold: boolean = false) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 150, 136);
    pdf.text(label, leftMargin, yPosition);
    yPosition += 5;

    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(value, pageWidth - leftMargin - rightMargin);
    pdf.text(lines, leftMargin, yPosition);
    yPosition += lines.length * 5 + 5;
  };

  addSection('Auteur', data.author || 'Non renseigné');
  addSection('Destinataires', data.recipients || 'Non renseigné');
  addSection('Priorité', data.priority || 'Non renseigné', true);
  addSection('Catégorie', data.category || 'Non renseigné');
  addSection('Objet', data.subject || 'Non renseigné', true);

  yPosition += 3;
  addSection('Message', data.message || 'Non renseigné');

  addSection('Action requise', data.actionRequired || 'Non renseigné');

  if (data.deadline) {
    addSection('Échéance', new Date(data.deadline).toLocaleDateString('fr-FR'));
  }

  pdf.setDrawColor(200, 200, 200);
  pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
  yPosition += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(120, 120, 120);
  pdf.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, leftMargin, yPosition);
  yPosition += 4;
  pdf.text('PHARMA QMS - Système de Management de la Qualité', leftMargin, yPosition);

  return pdf.output('blob');
};

const uploadPDFToSupabase = async (pdfBlob: Blob, documentId: string): Promise<string> => {
  const fileName = `liaison-book-${documentId}-${Date.now()}.pdf`;
  const filePath = `liaison-books/${fileName}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, pdfBlob, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (error) {
    console.error('Erreur upload Supabase:', error);
    throw new Error(`Erreur lors de l'upload du document: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

const formatWhatsAppMessage = (data: LiaisonBookData, documentUrl: string): string => {
  const priorityEmoji = getPriorityEmoji(data.priority);
  const categoryEmoji = getCategoryEmoji(data.category);

  let message = `📋 *CAHIER DE LIAISON*\n`;
  message += `━━━━━━━━━━━━━━━━━\n\n`;

  message += `🏥 *${data.pharmacyName}*\n`;
  message += `📅 ${data.date} à ${data.time}\n`;
  message += `✍️ Auteur: ${data.author}\n\n`;

  message += `👥 *Destinataires:* ${data.recipients}\n`;
  message += `${priorityEmoji} *Priorité:* ${data.priority}\n`;
  message += `${categoryEmoji} *Catégorie:* ${data.category}\n\n`;

  message += `📌 *Objet:* ${data.subject}\n\n`;

  message += `💬 *Message:*\n`;
  message += `${data.message}\n\n`;

  message += `🎯 *Action requise:* ${data.actionRequired}\n`;

  if (data.deadline) {
    message += `⏰ *Échéance:* ${new Date(data.deadline).toLocaleDateString('fr-FR')}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━\n`;
  message += `📄 *Document PDF:* ${documentUrl}\n\n`;
  message += `_Généré par PHARMA QMS_`;

  return message;
};

const saveLiaisonBookRecord = async (document: DocumentData, documentUrl: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('liaison_books')
      .insert({
        document_id: document.id,
        pharmacy_name: document.data.pharmacyName,
        author: document.data.author,
        date: document.data.date,
        time: document.data.time,
        subject: document.data.subject,
        message: document.data.message,
        priority: document.data.priority,
        category: document.data.category,
        recipients: document.data.recipients,
        action_required: document.data.actionRequired,
        deadline: document.data.deadline || null,
        document_url: documentUrl,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erreur sauvegarde base de données:', error);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

const getPriorityEmoji = (priority: string): string => {
  switch (priority) {
    case 'Très urgent':
      return '🚨';
    case 'Urgent':
      return '⚠️';
    case 'Important':
      return '❗';
    case 'Information':
    default:
      return 'ℹ️';
  }
};

const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Information générale':
      return 'ℹ️';
    case 'Procédure':
      return '📋';
    case 'Stock':
      return '📦';
    case 'Client':
      return '👤';
    case 'Fournisseur':
      return '🏢';
    case 'Maintenance':
      return '🔧';
    case 'Formation':
      return '📚';
    case 'Réglementation':
      return '⚖️';
    default:
      return '📝';
  }
};

const showSuccessNotification = () => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #25D366;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    z-index: 9999;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
  `;

  notification.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
    <span>Document PDF partagé sur WhatsApp</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3500);
};
