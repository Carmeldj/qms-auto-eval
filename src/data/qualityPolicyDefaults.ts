export interface QualityPolicyDefault {
  vision: string;
  values: string;
  missions: string;
  means: string;
  strategicAxes: string;
}

export const qualityPolicyDefault: QualityPolicyDefault = {
  vision: `Notre Pharmacie s'engage à fournir des produits pharmaceutiques sûrs, efficaces et de haute qualité, ainsi qu'un service client exceptionnel, afin de répondre aux besoins de nos clients et de contribuer à l'amélioration de la santé publique.`,

  values: `• Excellence professionnelle et rigueur pharmaceutique
• Bienveillance et écoute envers nos clients
• Intégrité et conformité réglementaire
• Esprit d'équipe et collaboration
• Innovation et amélioration continue`,

  missions: `• CONFORMITÉ RÉGLEMENTAIRE :
Respecter toutes les lois et réglementations en vigueur, ainsi que les directives internationales pertinentes telles que celles de l'OMS. S'assurer que tous les produits pharmaceutiques sont conformes aux normes de sécurité et d'efficacité.

• SATISFACTION DU CLIENT :
Offrir un accueil chaleureux et des conseils professionnels à tous nos clients. Répondre aux attentes des clients en matière de disponibilité et d'accessibilité des médicaments.

• RESPONSABILITÉ SOCIALE :
Promouvoir l'utilisation rationnelle des médicaments et sensibiliser la communauté locale aux questions de santé publique. Participer activement à des initiatives locales de santé.`,

  means: `• RESSOURCES HUMAINES :
Formation régulière du personnel aux bonnes pratiques pharmaceutiques et aux nouvelles réglementations. Équipe qualifiée et engagée dans la démarche qualité.

• GESTION DES RISQUES :
Identification et évaluation des risques potentiels liés à la sécurité des produits et à la chaîne d'approvisionnement. Mise en œuvre de mesures préventives pour minimiser ces risques.

• SYSTÈME QUALITÉ :
Système de gestion des non-conformités et analyse des retours clients pour améliorer constamment nos services.`,

  strategicAxes: `• AMÉLIORATION CONTINUE :
Atteindre un taux de satisfaction client supérieur à 90%. Réduire les non-conformités internes de 20% chaque année.

• DÉVELOPPEMENT DES COMPÉTENCES :
Former 100% du personnel aux nouvelles normes de qualité pharmaceutique d'ici la fin de l'année.

• OPTIMISATION DES PROCESSUS :
Mettre en place des indicateurs de performance pour suivre et améliorer l'efficacité de nos services.

• ENGAGEMENT COMMUNAUTAIRE :
Renforcer notre rôle de conseil et de prévention auprès de la population locale.`
};

export const getQualityPolicyDefault = (): QualityPolicyDefault => {
  return qualityPolicyDefault;
};
