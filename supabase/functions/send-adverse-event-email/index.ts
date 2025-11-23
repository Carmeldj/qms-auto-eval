import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  reportId: string;
  epidNumber: string;
  notifierName: string;
  notifierEmail: string;
  patientName: string;
  productName: string;
  pdfBase64?: string;
  recipientEmail: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: EmailRequest = await req.json();

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
      <h2>Notification d'Effet Indésirable - Agence du Médicament</h2>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Une nouvelle notification d'effet indésirable a été soumise via le système de pharmacovigilance.</p>
      
      <div class="info-row">
        <span class="label">Numéro épidémiologique:</span> ${data.epidNumber}
      </div>
      <div class="info-row">
        <span class="label">Notificateur:</span> ${data.notifierName}
      </div>
      <div class="info-row">
        <span class="label">Email du notificateur:</span> ${data.notifierEmail}
      </div>
      <div class="info-row">
        <span class="label">Patient:</span> ${data.patientName}
      </div>
      <div class="info-row">
        <span class="label">Produit suspect:</span> ${data.productName}
      </div>
      
      <p style="margin-top: 20px;">
        <strong>Le rapport complet au format PDF est joint à ce message.</strong>
      </p>
      
      <p>Cordialement,<br>Système de Pharmacovigilance</p>
    </div>
    <div class="footer">
      <p>Agence Nationale de Régulation Pharmaceutique</p>
      <p>Veuillez contacter votre agence pour plus d'informations</p>
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

    const emailPayload: any = {
      from: 'Pharmacovigilance <pharmacovigilance@notifications.gouv.local>',
      to: [data.recipientEmail],
      cc: data.notifierEmail ? [data.notifierEmail] : [],
      subject: `[Pharmacovigilance] Notification d'Effet Indésirable - ${data.epidNumber}`,
      html: emailBody,
    };

    if (data.pdfBase64) {
      emailPayload.attachments = [
        {
          filename: `notification-${data.epidNumber.replace(/\//g, '-')}.pdf`,
          content: data.pdfBase64,
        },
      ];
    }

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
        message: 'Notification envoyée avec succès à l\'agence du médicament',
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
