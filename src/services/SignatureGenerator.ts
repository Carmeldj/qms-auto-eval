export class SignatureGenerator {
  private static instance: SignatureGenerator;

  private constructor() {}

  public static getInstance(): SignatureGenerator {
    if (!SignatureGenerator.instance) {
      SignatureGenerator.instance = new SignatureGenerator();
    }
    return SignatureGenerator.instance;
  }

  /**
   * Génère une signature manuscrite élégante
   * @param name - Nom complet de la personne
   * @param width - Largeur de l'image en pixels (défaut: 300)
   * @param height - Hauteur de l'image en pixels (défaut: 100)
   * @returns Base64 string de l'image PNG
   */
  public generateSignature(name: string, width: number = 300, height: number = 100): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    // Fond transparent
    ctx.clearRect(0, 0, width, height);

    // Extraire nom et initiale du prénom
    const nameParts = name.trim().split(/\s+/);
    let signatureText = '';

    if (nameParts.length >= 2) {
      // Nom suivi de la première lettre du prénom
      const lastName = nameParts[nameParts.length - 1];
      const firstNameInitial = nameParts[0][0].toUpperCase();
      signatureText = `${lastName} ${firstNameInitial}`;
    } else {
      signatureText = name;
    }

    // Configuration du style de signature élégant - COULEUR BLEUE
    ctx.fillStyle = '#0066cc';
    ctx.strokeStyle = '#0066cc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculer la taille de police optimale
    const fontSize = Math.min(width / (signatureText.length * 0.5), height * 0.55);
    ctx.font = `${fontSize}px 'Dancing Script', 'Brush Script MT', cursive`;

    // Appliquer une légère rotation pour l'aspect manuscrit
    ctx.save();
    ctx.translate(width / 2, height / 2.3);
    ctx.rotate(-3 * Math.PI / 180); // -3 degrés

    // Dessiner le texte avec un léger effet d'ombre
    ctx.shadowColor = 'rgba(0, 102, 204, 0.2)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(signatureText, 0, 0);

    ctx.restore();

    // Ajouter un trait fin fantaisiste en dessous de la signature
    ctx.save();
    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';

    // Position du trait en dessous
    const underlineY = height / 2 + fontSize / 3;
    const underlineStartX = width / 2 - (signatureText.length * fontSize * 0.25);
    const underlineEndX = width / 2 + (signatureText.length * fontSize * 0.25);

    // Dessiner un trait courbe fantaisiste avec des ondulations
    ctx.beginPath();
    ctx.moveTo(underlineStartX, underlineY);

    // Créer une courbe élégante avec des points de contrôle
    const midX = width / 2;
    const controlOffset = 3;

    ctx.quadraticCurveTo(
      underlineStartX + (midX - underlineStartX) / 3,
      underlineY - controlOffset,
      midX - (midX - underlineStartX) / 3,
      underlineY
    );

    ctx.quadraticCurveTo(
      midX,
      underlineY + controlOffset,
      midX + (underlineEndX - midX) / 3,
      underlineY
    );

    ctx.quadraticCurveTo(
      underlineEndX - (underlineEndX - midX) / 3,
      underlineY - controlOffset,
      underlineEndX,
      underlineY
    );

    ctx.stroke();
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  /**
   * Génère une signature manuscrite avec options personnalisées
   */
  public generateCustomSignature(options: {
    name: string;
    width?: number;
    height?: number;
    color?: string;
    fontSize?: number;
    rotation?: number;
  }): string {
    const {
      name,
      width = 300,
      height = 100,
      color = '#1a1a1a',
      fontSize,
      rotation = -3
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    ctx.clearRect(0, 0, width, height);

    // Extraire nom et initiale
    const nameParts = name.trim().split(/\s+/);
    let signatureText = '';

    if (nameParts.length >= 2) {
      const lastName = nameParts[nameParts.length - 1];
      const firstNameInitial = nameParts[0][0].toUpperCase();
      signatureText = `${lastName} ${firstNameInitial}`;
    } else {
      signatureText = name;
    }

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const calculatedFontSize = fontSize || Math.min(width / (signatureText.length * 0.5), height * 0.6);
    ctx.font = `${calculatedFontSize}px 'Dancing Script', 'Brush Script MT', cursive`;

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation * Math.PI / 180);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(signatureText, 0, 0);

    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  /**
   * Génère une image de texte simple pour afficher un nom
   * @param text - Texte à afficher
   * @param width - Largeur de l'image en pixels (défaut: 200)
   * @param height - Hauteur de l'image en pixels (défaut: 30)
   * @param fontSize - Taille de la police (défaut: 12)
   * @returns Base64 string de l'image PNG
   */
  public generateTextImage(text: string, width: number = 200, height: number = 30, fontSize: number = 12): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Impossible de créer le contexte canvas');
    }

    // Fond transparent
    ctx.clearRect(0, 0, width, height);

    // Configuration du texte
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Dessiner le texte
    ctx.fillText(text, 0, height / 2);

    return canvas.toDataURL('image/png');
  }
}

export const signatureGenerator = SignatureGenerator.getInstance();
