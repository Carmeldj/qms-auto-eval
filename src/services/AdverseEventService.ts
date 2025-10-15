import jsPDF from 'jspdf';
import { AdverseEventReport } from '../types/adverseEvents';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class AdverseEventService {
  async saveReport(report: AdverseEventReport): Promise<void> {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/adverse_event_reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          epid_number: report.epidNumber,
          report_data: report,
          email_sent: false
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du rapport');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  }

  async sendEmail(report: AdverseEventReport, pdfBase64: string): Promise<void> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/send-adverse-event-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          reportId: report.id,
          epidNumber: report.epidNumber,
          notifierName: report.notifier.fullName,
          notifierEmail: report.notifier.email,
          patientName: `${report.patient.firstName} ${report.patient.lastName}`,
          productName: report.suspectProducts[0]?.productName || 'Non spécifié',
          pdfBase64: pdfBase64
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi de l\'email');
      }

      await fetch(`${SUPABASE_URL}/rest/v1/adverse_event_reports?epid_number=eq.${report.epidNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
      });

    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  generatePDFBase64(report: AdverseEventReport): string {
    const pdf = this.createPDF(report);
    return pdf.output('datauristring').split(',')[1];
  }

  async generatePDF(report: AdverseEventReport): Promise<void> {
    const pdf = this.createPDF(report);
    const fileName = `notification-abmed-${report.epidNumber.replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);
  }

  private createPDF(report: AdverseEventReport): jsPDF {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, lineSpacing: number = 1.15) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      pdf.text(lines, margin, yPosition);
      const lineHeight = fontSize * 0.35 * lineSpacing;
      yPosition += lines.length * lineHeight + 3;

      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    const addCheckbox = (x: number, y: number, checked: boolean) => {
      pdf.rect(x, y - 3, 3, 3);
      if (checked) {
        pdf.setFontSize(12);
        pdf.text('✓', x + 0.5, y);
      }
    };

    pdf.setTextColor(0, 0, 0);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉPUBLIQUE DU BÉNIN - MINISTÈRE DE LA SANTÉ', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;
    addText('ABMed - Agence Béninoise du Médicament', 11, true, 1.0);
    yPosition += 5;

    pdf.setFontSize(11);
    pdf.text('FICHE DE NOTIFICATION DES EFFETS/ÉVÉNEMENTS INDÉSIRABLES', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.text('OBSERVÉS APRÈS L\'UTILISATION DE PRODUIT DE SANTÉ', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    addText(`NUM EPID: ${report.epidNumber}`, 10, true, 1.2);
    addText(`Date: ${new Date(report.notifier.notificationDate).toLocaleDateString('fr-FR')}`, 10, false, 1.2);
    yPosition += 3;

    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    addText('NOTIFICATEUR', 11, true, 1.0);
    addText(`Département: ${report.notifier.department} | ZS: ${report.notifier.zs}`, 10, false, 1.2);
    addText(`Commune: ${report.notifier.commune} | FS: ${report.notifier.fs}`, 10, false, 1.2);
    addText(`Nom et Prénom: ${report.notifier.fullName}`, 10, false, 1.2);
    addText(`Qualification: ${report.notifier.qualification.toUpperCase()}`, 10, false, 1.2);
    if (report.notifier.specialty) {
      addText(`Spécialité: ${report.notifier.specialty}`, 10, false, 1.2);
    }
    addText(`Téléphone: ${report.notifier.telephone} | Email: ${report.notifier.email}`, 10, false, 1.2);
    yPosition += 3;

    pdf.setDrawColor(0, 150, 136);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    addText('PATIENT', 11, true, 1.0);
    addText(`Nom: ${report.patient.lastName} | Prénom: ${report.patient.firstName}`, 10);
    addText(`Sexe: ${report.patient.sex === 'M' ? 'Masculin' : 'Féminin'} | Âge: ${report.patient.ageYears || 'N/A'} ans`, 10);
    if (report.patient.weight || report.patient.height) {
      addText(`Poids: ${report.patient.weight || 'N/A'} Kg | Taille: ${report.patient.height || 'N/A'} Cm`, 10);
    }
    addText(`Adresse: ${report.patient.address}`, 10);
    yPosition += 5;

    addText('ANTÉCÉDENTS/FACTEURS FAVORISANTS', 12, true);
    const history = report.medicalHistory;
    const historyItems = [];
    if (history.pregnancy) historyItems.push('Grossesse');
    if (history.alcoholism) historyItems.push('Alcoolisme');
    if (history.hepatopathy) historyItems.push('Hépatopathie');
    if (history.allergy) historyItems.push('Allergie');
    if (history.nephropathy) historyItems.push('Néphropathie');
    if (history.smoking) historyItems.push('Tabagisme');
    if (history.traditionalRemedy) historyItems.push('Remède traditionnel');
    if (history.chronicTreatment) historyItems.push('Traitement chronique');
    if (history.previousReactionSameProduct) historyItems.push('Réaction antérieure au même produit');
    if (history.previousReactionOtherProduct) historyItems.push('Réaction antérieure à un autre produit');

    if (historyItems.length > 0) {
      addText(historyItems.join(', '), 10);
    } else {
      addText('Aucun antécédent signalé', 10);
    }
    if (history.other) {
      addText(`Autres: ${history.other}`, 10);
    }
    yPosition += 5;

    addText('ÉVÉNEMENT(S) INDÉSIRABLE(S)', 12, true);
    const events = [];
    const ae = report.adverseEvent;
    if (ae.fever) events.push('Fièvre >38°C');
    if (ae.urticaria) events.push('Urticaire');
    if (ae.localReactionSevere3Days) events.push('Réaction locale sévère >3jrs');
    if (ae.localReactionSevereLess3Days) events.push('Réaction locale sévère <3jrs');
    if (ae.localReactionBeyondJoint) events.push('Réaction locale s\'étendant au-delà articulation');
    if (ae.febrileConvulsion) events.push('Convulsion fébrile');
    if (ae.nonFebrileConvulsion) events.push('Convulsion non fébrile');
    if (ae.abscess) events.push('Abcès');
    if (ae.sepsis) events.push('Septicémie');
    if (ae.encephalopathy) events.push('Encéphalopathie');
    if (ae.toxicShockSyndrome) events.push('Syndrome de choc toxique');
    if (ae.thrombocytopenia) events.push('Thrombopénie');
    if (ae.anaphylacticShock) events.push('Choc anaphylactique');
    if (ae.lyellSyndrome) events.push('Syndrome de Lyell');

    if (events.length > 0) {
      addText(events.join(', '), 10);
    }
    if (ae.otherDescription) {
      addText(`Autres événements: ${ae.otherDescription}`, 10);
    }
    if (ae.administrationDate) {
      addText(`Date de prise/vaccination: ${new Date(ae.administrationDate).toLocaleDateString('fr-FR')}`, 10);
    }
    if (ae.eventDate) {
      addText(`Date d'apparition: ${new Date(ae.eventDate).toLocaleDateString('fr-FR')}`, 10);
    }
    yPosition += 5;

    addText('PRODUITS SUSPECTS', 12, true);
    report.suspectProducts.forEach((product, index) => {
      addText(`${index + 1}. ${product.productName}`, 11, true);
      addText(`   Fabricant: ${product.manufacturer || 'N/A'}`, 9);
      addText(`   Lieu d'achat: ${product.purchaseLocation || 'N/A'} | N° Lot: ${product.lotNumber || 'N/A'}`, 9);
      addText(`   Voie: ${product.administrationRoute || 'N/A'} | Posologie: ${product.dosage || 'N/A'}`, 9);
      addText(`   Indication: ${product.indication || 'N/A'}`, 9);
      addText(`   Dates: ${product.startDate || 'N/A'} → ${product.endDate || 'N/A'}`, 9);
      yPosition += 2;
    });
    yPosition += 3;

    addText('GRAVITÉ', 12, true);
    const severity = report.severityEvolution;
    const severityItems = [];
    if (severity.hospitalization) severityItems.push('Hospitalisation');
    if (severity.prolongedHospitalization) severityItems.push('Prolongation d\'hospitalisation');
    if (severity.permanentDisability) severityItems.push('Incapacité permanente');
    if (severity.lifeThreatening) severityItems.push('Mise en jeu du pronostic vital');
    if (severity.congenitalMalformation) severityItems.push('Malformation congénitale');
    if (severity.death) severityItems.push('Décès');

    if (severityItems.length > 0) {
      addText(severityItems.join(', '), 10);
    }
    yPosition += 3;

    addText('ÉVOLUTION', 12, true);
    const evolution = [];
    if (severity.recoveryWithoutSequelae) evolution.push('Guérison sans séquelle');
    if (severity.recoveryWithSequelae) evolution.push('Guérison avec séquelle');
    if (severity.notYetRecovered) evolution.push('Pas encore guéri');
    if (severity.deceased) evolution.push('Décès');
    if (severity.unknown) evolution.push('Inconnu');

    if (evolution.length > 0) {
      addText(evolution.join(', '), 10);
    }
    yPosition += 3;

    addText('ATTITUDE ADOPTÉE', 12, true);
    if (severity.medicationStopped) {
      addText('Arrêt du médicament: OUI', 10);
      if (severity.effectDisappeared) addText('  → Effet indésirable: Disparu', 9);
      if (severity.effectDiminished) addText('  → Effet indésirable: Diminué', 9);
      if (severity.effectPersisted) addText('  → Effet indésirable: Persisté', 9);
    }
    yPosition += 5;

    addText('CONTACT ABMed', 12, true);
    addText('Tél: (229) 01 51 45 79 87', 10);
    addText('Email: contact.abmed@gouv.bj', 10);
    addText('Adresse: Guinkomey, rue 108, Cotonou, Bénin', 10);
    addText('Site web: www.abmed.bj', 10);

    return pdf;
  }
}

export const adverseEventService = new AdverseEventService();
