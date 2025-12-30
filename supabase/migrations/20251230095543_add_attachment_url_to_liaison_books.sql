/*
  # Ajout de la colonne attachment_url à liaison_books

  1. Modifications
    - Ajoute la colonne `attachment_url` à la table `liaison_books`
    - Permet de stocker l'URL d'un fichier PDF joint optionnel au cahier de liaison
    - La colonne est nullable car l'attachement est optionnel

  2. Important
    - Cette colonne permet aux utilisateurs d'ajouter un document PDF supplémentaire
    - Le PDF sera uploadé dans le bucket 'documents' avant le partage WhatsApp
*/

-- Ajouter la colonne attachment_url si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'liaison_books' AND column_name = 'attachment_url'
  ) THEN
    ALTER TABLE liaison_books ADD COLUMN attachment_url text;
  END IF;
END $$;
