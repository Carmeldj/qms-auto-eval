import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrdonnancierEmailRequest {
  trimestre: number;
  annee: number;
  pharmacieName: string;
  pharmacieEmail: string;
  totalEntries: number;
  pdfBase64: string;
  excelBase64?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: OrdonnancierEmailRequest = await req.json();

    const trimestreLabels = ['1er Trimestre', '2ème Trimestre', '3ème Trimestre', '4ème Trimestre'];
    const trimestreLabel = trimestreLabels[data.trimestre - 1] || `Trimestre ${data.trimestre}`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #009688; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .info-row { margin: 10px 0; padding: 10px; background-color: white; border-left: 3px solid #009688; }
    .label { font-weight: bold; color: #009688; }
    .footer { background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Point Trimestriel - Produits sous Contrôle International</h2>
      <p>Agence Béninoise du Médicament</p>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Veuillez trouver ci-joint le point trimestriel des produits sous contrôle international.</p>

      <div class="info-row">
        <span class="label">Période:</span> ${trimestreLabel} ${data.annee}
      </div>
      <div class="info-row">
        <span class="label">Pharmacie:</span> ${data.pharmacieName}
      </div>
      <div class="info-row">
        <span class="label">Nombre de délivrances:</span> ${data.totalEntries}
      </div>

      <p style="margin-top: 20px;">
        <strong>Documents joints:</strong>
      </p>
      <ul>
        <li>Rapport détaillé au format PDF</li>
        ${data.excelBase64 ? '<li>Données au format Excel (CSV)</li>' : ''}
      </ul>

      <p>Cordialement,<br>${data.pharmacieName}</p>
    </div>
    <div class="footer">
      <p>Agence Béninoise du Médicament (ABMed)</p>
      <p>Service de Surveillance du Marché et de Réglementation (SSMUR)</p>
    </div>
  </div>
</body>
</html>
    `;

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuration email manquante. Veuillez contacter l\'administrateur.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Destinataires officiels ABMed
    const recipients = ['ssmur.abmed@gouv.bj'];
    const ccRecipients = ['contact.abmed@gouv.bj'];

    // Ajouter l'email de la pharmacie en copie si fourni
    if (data.pharmacieEmail) {
      ccRecipients.push(data.pharmacieEmail);
    }

    const attachments: any[] = [
      {
        filename: `rapport_ordonnancier_T${data.trimestre}_${data.annee}.pdf`,
        content: data.pdfBase64,
      }
    ];

    // Ajouter le fichier Excel s'il est fourni
    if (data.excelBase64) {
      attachments.push({
        filename: `rapport_ordonnancier_T${data.trimestre}_${data.annee}.csv`,
        content: data.excelBase64,
      });
    }

    const emailPayload = {
      from: 'Ordonnancier ABMed <ordonnancier@notifications.gouv.local>',
      to: recipients,
      cc: ccRecipients,
      subject: `[Ordonnancier] Point Trimestriel T${data.trimestre} ${data.annee} - ${data.pharmacieName}`,
      html: emailBody,
      attachments: attachments,
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API Error:', errorData);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Rapport trimestriel envoyé avec succès à l'ABMed (PDF${data.excelBase64 ? ' + Excel' : ''})`,
        emailId: emailResult.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
