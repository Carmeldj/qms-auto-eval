import jsPDF from 'jspdf';
import { supabase } from '../lib/supabase';

interface MissingProduct {
  id?: string;
  user_email: string;
  pharmacy_name: string;
  date: string;
  time?: string;
  product_name: string;
  dosage: string;
  quantity: string;
  unit_price: number;
  total_lost: number;
  customer_type?: string;
  customer_contact?: string;
  has_ordered: string;
  supplier_name?: string;
  expected_delivery?: string;
  reason?: string;
  observations?: string;
  recorded_by: string;
  created_at?: string;
}

interface MonthlyReport {
  totalRecords: number;
  totalCALost: number;
  productsByCategory: Record<string, number>;
  topMissingProducts: Array<{
    product: string;
    count: number;
    totalLost: number;
  }>;
}

class MissingProductsService {
  private static instance: MissingProductsService;

  private constructor() {}

  static getInstance(): MissingProductsService {
    if (!MissingProductsService.instance) {
      MissingProductsService.instance = new MissingProductsService();
    }
    return MissingProductsService.instance;
  }

  async saveMissingProduct(product: MissingProduct): Promise<void> {
    const { error } = await supabase
      .from('missing_products')
      .insert([product]);

    if (error) {
      console.error('Error saving missing product:', error);
      throw error;
    }
  }

  async getMissingProductsByMonth(
    year: number,
    month: number,
    userEmail: string
  ): Promise<MissingProduct[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('missing_products')
      .select('*')
      .eq('user_email', userEmail)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching missing products:', error);
      throw error;
    }

    return data || [];
  }

  async generateMonthlyReport(
    year: number,
    month: number,
    pharmacyName: string,
    userEmail: string
  ): Promise<void> {
    try {
      const products = await this.getMissingProductsByMonth(year, month, userEmail);

      if (products.length === 0) {
        alert('Aucun produit manquant enregistre pour ce mois');
        return;
      }

      const report = this.calculateMonthlyReport(products);
      await this.generatePDF(products, report, year, month, pharmacyName);
    } catch (error) {
      console.error('Erreur lors de la generation du rapport:', error);
      alert(`Erreur lors de la generation du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      throw error;
    }
  }

  private calculateMonthlyReport(products: MissingProduct[]): MonthlyReport {
    const totalCALost = products.reduce((sum, p) => {
      const lost = Number(p.total_lost) || 0;
      return sum + (isNaN(lost) ? 0 : lost);
    }, 0);

    const productCounts: Record<string, { count: number; totalLost: number }> = {};
    products.forEach(p => {
      const key = `${p.product_name || 'Produit inconnu'} ${p.dosage || ''}`.trim();
      if (!productCounts[key]) {
        productCounts[key] = { count: 0, totalLost: 0 };
      }
      productCounts[key].count += 1;
      const lost = Number(p.total_lost) || 0;
      productCounts[key].totalLost += (isNaN(lost) ? 0 : lost);
    });

    const topMissingProducts = Object.entries(productCounts)
      .map(([product, data]) => ({
        product,
        count: data.count,
        totalLost: data.totalLost
      }))
      .sort((a, b) => b.totalLost - a.totalLost)
      .slice(0, 10);

    const productsByCategory: Record<string, number> = {};
    products.forEach(p => {
      const reason = p.reason || 'Non specifie';
      productsByCategory[reason] = (productsByCategory[reason] || 0) + 1;
    });

    return {
      totalRecords: products.length,
      totalCALost,
      productsByCategory,
      topMissingProducts
    };
  }

  private async generatePDF(
    products: MissingProduct[],
    report: MonthlyReport,
    year: number,
    month: number,
    pharmacyName: string
  ): Promise<void> {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = 20;

      const monthNames = [
        'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
      ];

      // En-tete
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT MENSUEL', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    doc.setFontSize(16);
    doc.text('PRODUITS MANQUANTS', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(pharmacyName, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    doc.setFontSize(11);
    doc.text(`Periode : ${monthNames[month - 1]} ${year}`, pageWidth / 2, yPosition, { align: 'center' });

    // Indicateurs cles en encadres separes
    yPosition += 15;
    const boxWidth = (pageWidth - 2 * margin - 10) / 2;

    // Encadre 1 : Nombre de produits non servis
    doc.setFillColor(220, 240, 255);
    doc.rect(margin, yPosition, boxWidth, 20, 'F');
    doc.setDrawColor(0, 100, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPosition, boxWidth, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('PRODUITS NON SERVIS', margin + boxWidth / 2, yPosition + 6, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${report.totalRecords}`, margin + boxWidth / 2, yPosition + 15, { align: 'center' });

    // Encadre 2 : CA Total Perdu
    const caFormatted = String(report.totalCALost).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    doc.setFillColor(255, 230, 230);
    doc.rect(margin + boxWidth + 10, yPosition, boxWidth, 20, 'F');
    doc.setDrawColor(200, 0, 0);
    doc.rect(margin + boxWidth + 10, yPosition, boxWidth, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CA TOTAL PERDU', margin + boxWidth + 10 + boxWidth / 2, yPosition + 6, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 0, 0);
    doc.text(`${caFormatted} FCFA`, margin + boxWidth + 10 + boxWidth / 2, yPosition + 15, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    yPosition += 25;

    // Top 10 des produits manquants
    if (report.topMissingProducts.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOP 10 DES PRODUITS LES PLUS DEMANDES', margin, yPosition);

      yPosition += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      // En-tetes du tableau
      doc.text('No', margin, yPosition);
      doc.text('Produit', margin + 10, yPosition);
      doc.text('Demandes', pageWidth - margin - 65, yPosition);
      doc.text('CA Perdu (FCFA)', pageWidth - margin - 5, yPosition, { align: 'right' });

      yPosition += 2;
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');

      report.topMissingProducts.forEach((item, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text(`${index + 1}`, margin, yPosition);

        const productText = (item.product || '').length > 50
          ? (item.product || '').substring(0, 50) + '...'
          : (item.product || 'N/A');
        doc.text(productText, margin + 10, yPosition);

        doc.text(`${item.count || 0}`, pageWidth - margin - 65, yPosition);
        const totalLostFormatted = String(item.totalLost || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        doc.text(totalLostFormatted, pageWidth - margin - 5, yPosition, { align: 'right' });

        yPosition += 6;
      });

      yPosition += 5;
    }

    // Raisons d'indisponibilité
    if (Object.keys(report.productsByCategory).length > 0) {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      yPosition += 5;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('RAISONS D INDISPONIBILITE', margin, yPosition);

      yPosition += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      Object.entries(report.productsByCategory).forEach(([reason, count]) => {
        doc.text(`- ${reason || 'Non specifie'} : ${count || 0} cas`, margin + 5, yPosition);
        yPosition += 6;
      });
    }

    // Nouvelle page pour le detail
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAIL DES PRODUITS MANQUANTS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Tableau detaille
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    const colWidths = {
      date: 20,
      product: 60,
      dosage: 25,
      qty: 12,
      price: 20,
      total: 25,
      ordered: 18
    };

    let xPos = margin;
    doc.text('Date', xPos, yPosition);
    xPos += colWidths.date;
    doc.text('Produit', xPos, yPosition);
    xPos += colWidths.product;
    doc.text('Dosage', xPos, yPosition);
    xPos += colWidths.dosage;
    doc.text('Qte', xPos, yPosition);
    xPos += colWidths.qty;
    doc.text('PU (FCFA)', xPos, yPosition);
    xPos += colWidths.price;
    doc.text('Total (FCFA)', xPos, yPosition);
    xPos += colWidths.total;
    doc.text('Cmd?', xPos, yPosition);

    yPosition += 2;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    doc.setFont('helvetica', 'normal');

    products.forEach((product, index) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      xPos = margin;

      const productDate = new Date(product.date);
      const dateStr = `${productDate.getDate().toString().padStart(2, '0')}/${(productDate.getMonth() + 1).toString().padStart(2, '0')}/${productDate.getFullYear()}`;
      doc.text(dateStr, xPos, yPosition);
      xPos += colWidths.date;

      const productName = (product.product_name || '').length > 30
        ? (product.product_name || '').substring(0, 30) + '...'
        : (product.product_name || 'N/A');
      doc.text(productName, xPos, yPosition);
      xPos += colWidths.product;

      doc.text(product.dosage || 'N/A', xPos, yPosition);
      xPos += colWidths.dosage;

      doc.text(product.quantity || 'N/A', xPos, yPosition);
      xPos += colWidths.qty;

      const unitPriceFormatted = String(product.unit_price || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      doc.text(unitPriceFormatted, xPos, yPosition);
      xPos += colWidths.price;

      const totalLostFormatted = String(product.total_lost || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      doc.text(totalLostFormatted, xPos, yPosition);
      xPos += colWidths.total;

      doc.text(product.has_ordered === 'Oui' ? 'Oui' : 'Non', xPos, yPosition);

      yPosition += 6;

      if ((index + 1) % 5 === 0) {
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
      }
    });

    // Pied de page final
    const totalPages = doc.getNumberOfPages();
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} / ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        `Genere le ${dateStr} a ${timeStr}`,
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
    }

      doc.save(`Rapport_Produits_Manquants_${monthNames[month - 1]}_${year}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la generation du PDF:', error);
      throw new Error(`Impossible de generer le PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

export const missingProductsService = MissingProductsService.getInstance();
