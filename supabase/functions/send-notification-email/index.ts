import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  type: string;
  title: string;
  message: string;
  candidateName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, title, message, candidateName }: NotificationEmailRequest = await req.json();

    const emailSubjects: Record<string, string> = {
      candidate: `New Candidate: ${candidateName || 'Application'}`,
      interview: "Interview Scheduled",
      offer: "Offer Sent",
      project: "New Project Assignment",
    };

    const emailResponse = await resend.emails.send({
      from: "Humanet HR <onboarding@resend.dev>",
      to: [to],
      subject: emailSubjects[type] || title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6;">${title}</h1>
          <p style="font-size: 16px; color: #333;">${message}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="font-size: 14px; color: #6b7280;">
            This is an automated notification from Humanet HR System.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
