import { supabase } from '../lib/supabase';

export interface PrescriptionFileUpload {
  file: File;
  password: string;
  entryId: string;
}

export interface PrescriptionFileAccess {
  entryId: string;
  password: string;
}

/**
 * Service pour gérer les fichiers d'ordonnance avec protection par mot de passe
 */
export class PrescriptionFileService {
  private static readonly BUCKET_NAME = 'prescriptions';
  private static readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Hash un mot de passe avec SHA-256
   */
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Valide le type et la taille du fichier
   */
  private static validateFile(file: File): void {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Type de fichier non autorisé. Utilisez PDF, JPG ou PNG uniquement.');
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('Le fichier est trop volumineux. Taille maximale: 10MB.');
    }
  }

  /**
   * Génère un nom de fichier unique et sécurisé
   */
  private static generateFileName(entryId: string, file: File): string {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'pdf';
    const random = Math.random().toString(36).substring(2, 8);
    return `${entryId}_${timestamp}_${random}.${extension}`;
  }

  /**
   * Obtient le type de fichier à partir du MIME type
   */
  private static getFileType(mimeType: string): 'pdf' | 'jpg' | 'jpeg' | 'png' {
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'image/jpeg') return 'jpg';
    if (mimeType === 'image/jpg') return 'jpg';
    if (mimeType === 'image/png') return 'png';
    return 'pdf';
  }

  /**
   * Upload un fichier d'ordonnance avec mot de passe
   */
  static async uploadPrescriptionFile({ file, password, entryId }: PrescriptionFileUpload): Promise<string> {
    try {
      // Validation
      this.validateFile(file);

      if (!password || password.trim().length < 4) {
        throw new Error('Le mot de passe doit contenir au moins 4 caractères.');
      }

      // Hash du mot de passe
      const passwordHash = await this.hashPassword(password);

      // Génération du nom de fichier
      const fileName = this.generateFileName(entryId, file);
      const filePath = `${fileName}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload Supabase:', uploadError);
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      // Stocker uniquement le chemin du fichier (pas l'URL complète)
      // L'URL signée sera générée à la demande lors de l'accès
      const fileUrl = filePath;

      // Mettre à jour l'entrée dans la base de données
      const { error: updateError } = await supabase
        .from('ordonnancier_entries')
        .update({
          prescription_file_url: fileUrl,
          prescription_file_type: this.getFileType(file.type),
          prescription_password_hash: passwordHash,
          prescription_uploaded_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (updateError) {
        // Supprimer le fichier si la mise à jour échoue
        await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);
        throw new Error(`Erreur lors de la sauvegarde: ${updateError.message}`);
      }

      return fileUrl;
    } catch (error) {
      console.error('Erreur dans uploadPrescriptionFile:', error);
      throw error;
    }
  }

  /**
   * Vérifie le mot de passe et retourne l'URL signée du fichier
   */
  static async accessPrescriptionFile({ entryId, password }: PrescriptionFileAccess): Promise<string> {
    try {
      // Récupérer l'entrée avec le hash du mot de passe
      const { data: entry, error: fetchError } = await supabase
        .from('ordonnancier_entries')
        .select('prescription_file_url, prescription_password_hash, prescription_file_type')
        .eq('id', entryId)
        .single();

      if (fetchError || !entry) {
        throw new Error('Ordonnance non trouvée.');
      }

      if (!entry.prescription_file_url) {
        throw new Error('Aucun fichier d\'ordonnance associé à cette délivrance.');
      }

      // Vérifier le mot de passe
      const passwordHash = await this.hashPassword(password);

      if (passwordHash !== entry.prescription_password_hash) {
        throw new Error('Mot de passe incorrect.');
      }

      // Générer une URL signée valide pendant 1 heure
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(entry.prescription_file_url, 3600);

      if (signedUrlError || !signedUrlData) {
        console.error('Erreur génération URL signée:', signedUrlError);
        throw new Error('Erreur lors de la génération du lien d\'accès.');
      }

      // Retourner l'URL signée
      return signedUrlData.signedUrl;
    } catch (error) {
      console.error('Erreur dans accessPrescriptionFile:', error);
      throw error;
    }
  }

  /**
   * Vérifie si une entrée a un fichier d'ordonnance
   */
  static async hasPrescriptionFile(entryId: string): Promise<boolean> {
    try {
      const { data: entry, error } = await supabase
        .from('ordonnancier_entries')
        .select('prescription_file_url')
        .eq('id', entryId)
        .single();

      if (error) return false;

      return !!entry?.prescription_file_url;
    } catch (error) {
      console.error('Erreur dans hasPrescriptionFile:', error);
      return false;
    }
  }

  /**
   * Supprime un fichier d'ordonnance
   */
  static async deletePrescriptionFile(entryId: string, password: string): Promise<void> {
    try {
      // Vérifier le mot de passe d'abord
      const { data: entry, error: fetchError } = await supabase
        .from('ordonnancier_entries')
        .select('prescription_file_url, prescription_password_hash')
        .eq('id', entryId)
        .single();

      if (fetchError || !entry) {
        throw new Error('Ordonnance non trouvée.');
      }

      if (!entry.prescription_file_url) {
        throw new Error('Aucun fichier à supprimer.');
      }

      // Vérifier le mot de passe
      const passwordHash = await this.hashPassword(password);

      if (passwordHash !== entry.prescription_password_hash) {
        throw new Error('Mot de passe incorrect.');
      }

      // Extraire le nom du fichier de l'URL
      const fileName = entry.prescription_file_url.split('/').pop();
      if (!fileName) {
        throw new Error('URL de fichier invalide.');
      }

      // Supprimer le fichier du storage
      const { error: deleteError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (deleteError) {
        console.error('Erreur suppression storage:', deleteError);
      }

      // Mettre à jour l'entrée (supprimer les références au fichier)
      const { error: updateError } = await supabase
        .from('ordonnancier_entries')
        .update({
          prescription_file_url: null,
          prescription_file_type: null,
          prescription_password_hash: null,
          prescription_uploaded_at: null
        })
        .eq('id', entryId);

      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
      }
    } catch (error) {
      console.error('Erreur dans deletePrescriptionFile:', error);
      throw error;
    }
  }
}

export const prescriptionFileService = new PrescriptionFileService();
