export class StampGenerator {
  private static instance: StampGenerator;

  private constructor() {}

  public static getInstance(): StampGenerator {
    if (!StampGenerator.instance) {
      StampGenerator.instance = new StampGenerator();
    }
    return StampGenerator.instance;
  }

  /**
   * Génère un cachet circulaire avec le nom de la pharmacie
   * @param pharmacyName - Nom complet de la pharmacie
   * @param size - Taille du cachet en pixels (défaut: 200)
   * @returns Base64 string de l'image PNG
   */
  public generateStamp(pharmacyName: string, size: number = 200): string {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.45;
    const innerRadius = size * 0.35;

    // Fond transparent
    ctx.clearRect(0, 0, size, size);

    // Configuration de base
    ctx.strokeStyle = '#D32F2F'; // Rouge
    ctx.fillStyle = '#D32F2F';
    ctx.lineWidth = size * 0.015;

    // Dessiner les cercles extérieurs
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Extraire le dernier mot pour le centre
    const words = pharmacyName.trim().split(/\s+/);
    const centerText = words[words.length - 1].toUpperCase();

    // Texte central en horizontal avec ajustement automatique
    let fontSize = size * 0.09; // Réduit de 0.12 à 0.09
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Mesurer et ajuster si nécessaire
    let textWidth = ctx.measureText(centerText).width;
    const maxWidth = innerRadius * 1.6; // 80% du diamètre du cercle intérieur

    while (textWidth > maxWidth && fontSize > size * 0.05) {
      fontSize *= 0.9;
      ctx.font = `bold ${fontSize}px Arial`;
      textWidth = ctx.measureText(centerText).width;
    }

    ctx.fillText(centerText, centerX, centerY);

    // Texte circulaire en haut
    const topText = pharmacyName.toUpperCase();
    this.drawCircularText(ctx, topText, centerX, centerY, (outerRadius + innerRadius) / 2, Math.PI, false);

    // Texte circulaire en bas (répétition ou texte alternatif)
    const bottomText = pharmacyName.toUpperCase();
    this.drawCircularText(ctx, bottomText, centerX, centerY, (outerRadius + innerRadius) / 2, 0, true);

    // Dessiner des petits traits décoratifs (effet tampon usé)
    this.addWornEffect(ctx, centerX, centerY, outerRadius, innerRadius);

    return canvas.toDataURL('image/png');
  }

  /**
   * Dessine du texte circulaire
   */
  private drawCircularText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    clockwise: boolean
  ): void {
    const canvas = ctx.canvas;
    const fontSize = canvas.width * 0.055;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculer l'angle total nécessaire pour le texte
    const textWidth = ctx.measureText(text).width;
    const anglePerChar = (Math.PI * 0.85) / text.length; // Utiliser 85% du demi-cercle

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Calculer l'angle pour ce caractère
      let angle;
      if (clockwise) {
        angle = startAngle + (i * anglePerChar) + (anglePerChar / 2);
      } else {
        angle = startAngle + (i * anglePerChar) + (anglePerChar / 2);
      }

      // Position du caractère
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Sauvegarder l'état du contexte
      ctx.save();

      // Déplacer vers la position du caractère
      ctx.translate(x, y);

      // Rotation du caractère
      if (clockwise) {
        ctx.rotate(angle + Math.PI / 2);
      } else {
        ctx.rotate(angle + Math.PI / 2);
      }

      // Dessiner le caractère
      ctx.fillText(char, 0, 0);

      // Restaurer l'état du contexte
      ctx.restore();
    }
  }

  /**
   * Ajoute un effet d'usure/tampon
   */
  private addWornEffect(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    outerRadius: number,
    innerRadius: number
  ): void {
    const numMarks = 30;
    ctx.strokeStyle = 'rgba(211, 47, 47, 0.3)';
    ctx.lineWidth = 1;

    for (let i = 0; i < numMarks; i++) {
      const angle = (Math.PI * 2 * i) / numMarks;
      const randomOffset = Math.random() * 3 - 1.5;

      const x1 = centerX + (outerRadius + randomOffset) * Math.cos(angle);
      const y1 = centerY + (outerRadius + randomOffset) * Math.sin(angle);
      const x2 = centerX + (outerRadius + 3 + randomOffset) * Math.cos(angle);
      const y2 = centerY + (outerRadius + 3 + randomOffset) * Math.sin(angle);

      if (Math.random() > 0.6) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }

  /**
   * Génère un cachet avec personnalisation avancée
   */
  public generateCustomStamp(options: {
    pharmacyName: string;
    size?: number;
    color?: string;
    centerText?: string;
    topText?: string;
    bottomText?: string;
  }): string {
    const {
      pharmacyName,
      size = 200,
      color = '#D32F2F',
      centerText,
      topText,
      bottomText
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.45;
    const innerRadius = size * 0.35;

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size * 0.015;

    // Cercles
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Texte central
    const words = pharmacyName.trim().split(/\s+/);
    const defaultCenterText = words[words.length - 1].toUpperCase();
    const textToDisplay = centerText || defaultCenterText;

    // Ajuster la taille de la police pour que le texte rentre dans le cercle intérieur
    let fontSize = size * 0.09; // Réduit de 0.12 à 0.09 (25% plus petit)
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Mesurer le texte et réduire davantage si nécessaire
    let textWidth = ctx.measureText(textToDisplay).width;
    const maxWidth = innerRadius * 1.6; // 80% du diamètre du cercle intérieur

    while (textWidth > maxWidth && fontSize > size * 0.05) {
      fontSize *= 0.9;
      ctx.font = `bold ${fontSize}px Arial`;
      textWidth = ctx.measureText(textToDisplay).width;
    }

    ctx.fillText(textToDisplay, centerX, centerY);

    // Textes circulaires
    this.drawCircularText(
      ctx,
      topText || pharmacyName.toUpperCase(),
      centerX,
      centerY,
      (outerRadius + innerRadius) / 2,
      Math.PI,
      false
    );

    this.drawCircularText(
      ctx,
      bottomText || pharmacyName.toUpperCase(),
      centerX,
      centerY,
      (outerRadius + innerRadius) / 2,
      0,
      true
    );

    this.addWornEffect(ctx, centerX, centerY, outerRadius, innerRadius);

    return canvas.toDataURL('image/png');
  }
}

export const stampGenerator = StampGenerator.getInstance();
