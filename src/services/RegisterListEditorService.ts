import { supabase } from '../lib/supabase';
import { RegisterListData, RegisterListType, RegisterCategory } from '../types/registerList';
import { registerListService } from './RegisterListService';
import jsPDF from 'jspdf';

export class RegisterListEditorService {
  private static instance: RegisterListEditorService;

  private constructor() {}

  public static getInstance(): RegisterListEditorService {
    if (!RegisterListEditorService.instance) {
      RegisterListEditorService.instance = new RegisterListEditorService();
    }
    return RegisterListEditorService.instance;
  }

  /**
   * Récupère ou crée la structure par défaut d'une liste
   */
  public async getOrCreateDefaultList(
    userEmail: string,
    listType: RegisterListType
  ): Promise<RegisterListData> {
    try {
      const { data, error } = await supabase
        .from('register_lists')
        .select('*')
        .eq('user_email', userEmail)
        .eq('list_type', listType)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return data.list_data as RegisterListData;
      }

      const defaultData = this.getDefaultListData(listType);

      const { error: insertError } = await supabase
        .from('register_lists')
        .insert({
          user_email: userEmail,
          list_type: listType,
          list_data: defaultData
        });

      if (insertError) throw insertError;

      return defaultData;
    } catch (error) {
      console.error('Error getting/creating list:', error);
      return this.getDefaultListData(listType);
    }
  }

  /**
   * Sauvegarde une liste personnalisée
   */
  public async saveCustomList(
    userEmail: string,
    listType: RegisterListType,
    listData: RegisterListData
  ): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('register_lists')
        .select('id')
        .eq('user_email', userEmail)
        .eq('list_type', listType)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('register_lists')
          .update({ list_data: listData })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('register_lists')
          .insert({
            user_email: userEmail,
            list_type: listType,
            list_data: listData
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving custom list:', error);
      throw error;
    }
  }

  /**
   * Réinitialise une liste aux valeurs par défaut
   */
  public async resetToDefault(
    userEmail: string,
    listType: RegisterListType
  ): Promise<RegisterListData> {
    const defaultData = this.getDefaultListData(listType);
    await this.saveCustomList(userEmail, listType, defaultData);
    return defaultData;
  }

  /**
   * Génère le PDF personnalisé
   */
  public generateCustomPDF(
    pharmacyName: string,
    listType: RegisterListType,
    listData: RegisterListData
  ): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const titles: Record<RegisterListType, { main: string; sub: string; color: [number, number, number] }> = {
      management: {
        main: 'LISTE DES REGISTRES/DOCUMENTS',
        sub: 'DE GESTION PRÉVUS',
        color: [0, 150, 136]
      },
      dispensation: {
        main: 'LISTE DES REGISTRES/DOCUMENTS',
        sub: 'DE TRAÇABILITÉ DES DISPENSATIONS',
        color: [0, 96, 88]
      },
      information: {
        main: 'LISTE DES DOCUMENTS',
        sub: 'D\'INFORMATIONS PHARMACEUTIQUES PRÉVUS',
        color: [59, 130, 246]
      }
    };

    const config = titles[listType];

    doc.setFillColor(config.color[0], config.color[1], config.color[2]);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(config.main, pageWidth / 2, 15, { align: 'center' });
    doc.text(config.sub, pageWidth / 2, 25, { align: 'center' });

    yPos = 45;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pharmacie : ${pharmacyName}`, margin, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);

    yPos += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('(Liste personnalisée)', margin, yPos);

    yPos += 15;

    doc.setFontSize(10);

    const enabledCategories = listData.categories.filter(cat => cat.enabled);

    enabledCategories.forEach((section) => {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFillColor(section.color[0], section.color[1], section.color[2]);
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(section.category, pageWidth / 2, yPos + 1, { align: 'center' });
      yPos += 8;

      if (section.description) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(section.description, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
      }

      const enabledItems = section.items.filter(item => item.enabled);

      enabledItems.forEach((item, index) => {
        if (yPos > pageHeight - 35) {
          doc.addPage();
          yPos = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const prefix = item.code ? `[${item.code}] ` : `${index + 1}. `;
        doc.text(`${prefix}${item.title}`, margin + 2, yPos);
        yPos += 5;

        if (item.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(64, 64, 64);
          doc.text(item.description, margin + 5, yPos, { maxWidth: pageWidth - margin - 10 });
          yPos += 4;
        }

        if (item.location) {
          doc.setFontSize(7);
          doc.setTextColor(100, 100, 100);
          doc.text(`📍 Localisation : ${item.location}`, margin + 5, yPos);
          yPos += 4;
        }

        if (item.obligation && item.reference) {
          const obligationColor = item.obligation.includes('OBLIGATOIRE') ? [220, 53, 69] : [249, 115, 22];
          doc.setTextColor(obligationColor[0], obligationColor[1], obligationColor[2]);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.text(item.obligation, margin + 5, yPos);

          doc.setTextColor(100, 100, 100);
          doc.setFont('helvetica', 'italic');
          doc.text(`• Référence : ${item.reference}`, margin + 70, yPos);
          yPos += 4;
        }

        if (item.retention) {
          doc.setTextColor(100, 100, 100);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(7);
          doc.text(`Conservation : ${item.retention}`, margin + 5, yPos);
          yPos += 4;
        }

        yPos += 2;
      });

      yPos += 5;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Système de Management de la Qualité - Liste personnalisée',
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    const fileNames: Record<RegisterListType, string> = {
      management: 'Registres_Gestion_Personnalise',
      dispensation: 'Registres_Tracabilite_Personnalise',
      information: 'Documents_Information_Personnalise'
    };

    doc.save(`${fileNames[listType]}_${pharmacyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  /**
   * Retourne la structure de données par défaut pour chaque type de liste
   */
  private getDefaultListData(listType: RegisterListType): RegisterListData {
    // Cette méthode retournera les données complètes du RegisterListService
    // converties en format éditable
    switch (listType) {
      case 'management':
        return this.getManagementDefaultData();
      case 'dispensation':
        return this.getDispensationDefaultData();
      case 'information':
        return this.getInformationDefaultData();
      default:
        return { categories: [] };
    }
  }

  private getManagementDefaultData(): RegisterListData {
    return {
      categories: [
        {
          id: 'cat-00',
          category: '00 – ADMINISTRATION GÉNÉRALE DE LA QUALITÉ',
          color: [240, 240, 240],
          enabled: true,
          items: [
            { id: '00.01', title: 'Politique Qualité et Engagement', code: '00.01', enabled: true },
            { id: '00.02', title: 'Objectifs Qualité', code: '00.02', enabled: true },
            { id: '00.03', title: 'Manuel Qualité', code: '00.03', enabled: true },
            { id: '00.04', title: 'Lettre de désignation RMQ', code: '00.04', enabled: true },
            { id: '00.05', title: 'Planning annuel Qualité', code: '00.05', enabled: true },
            { id: '00.06', title: 'Revue de direction', code: '00.06', enabled: true },
            { id: '00.07', title: 'Communication interne qualité', code: '00.07', enabled: true }
          ]
        },
        {
          id: 'cat-01',
          category: '01 – PROCÉDURES ET DOCUMENTS DE RÉFÉRENCE',
          color: [240, 240, 240],
          enabled: true,
          items: [
            { id: '01.01', title: 'Procédures générales (37 procédures du SMQ)', code: '01.01', enabled: true },
            { id: '01.02', title: 'Instructions de travail', code: '01.02', enabled: true },
            { id: '01.03', title: 'Fiches techniques', code: '01.03', enabled: true },
            { id: '01.04', title: 'Modèles de documents', code: '01.04', enabled: true },
            { id: '01.05', title: 'Fiches de vie documentaire', code: '01.05', enabled: true }
          ]
        }
      ]
    };
  }

  private getDispensationDefaultData(): RegisterListData {
    return {
      categories: [
        {
          id: 'cat-05',
          category: '05 - DOCUMENTS DE TRAÇABILITÉ PHARMACEUTIQUE',
          color: [0, 150, 136],
          enabled: true,
          items: [
            {
              id: '05.01-ord',
              code: '05.01',
              title: 'Registre de dispensation (Ordonnancier)',
              description: 'Enregistrement chronologique de toutes les dispensations sur prescription médicale',
              obligation: 'OBLIGATOIRE',
              retention: '3 ans minimum',
              enabled: true
            },
            {
              id: '05.02-stup',
              code: '05.02',
              title: 'Registre des stupéfiants',
              description: 'Traçabilité complète des substances vénéneuses',
              obligation: 'OBLIGATOIRE',
              retention: '10 ans minimum',
              enabled: true
            }
          ]
        }
      ]
    };
  }

  private getInformationDefaultData(): RegisterListData {
    return {
      categories: [
        {
          id: 'cat-aff',
          category: 'AFFICHAGES OBLIGATOIRES À L\'OFFICINE',
          color: [239, 68, 68],
          description: 'Documents devant être visibles par le public',
          enabled: true,
          items: [
            {
              id: 'aff-01',
              title: 'Diplôme du pharmacien titulaire',
              description: 'Diplôme d\'État de Docteur en Pharmacie du titulaire',
              location: 'Visible dans l\'espace de dispensation',
              obligation: 'OBLIGATOIRE',
              reference: 'Art. L.4221-1 CSP',
              enabled: true
            }
          ]
        }
      ]
    };
  }
}

export const registerListEditorService = RegisterListEditorService.getInstance();
