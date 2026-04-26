import nodemailer from "nodemailer";

function emailConfigured() {
  return (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_FROM
  );
}

export async function sendEmail({ to, subject, html }) {
  if (!emailConfigured()) {
    console.log("Email not configured. Skipping email:", subject);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function newLeadEmailTemplate(lead) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Lead Created</h2>
      <p>A new property lead has been added to the CRM.</p>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Interest:</strong> ${lead.propertyInterest}</p>
      <p><strong>Budget:</strong> PKR ${Number(lead.budget).toLocaleString()}</p>
      <p><strong>Priority:</strong> ${lead.score}</p>
    </div>
  `;
}

export function assignedLeadEmailTemplate(lead, agent) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Lead Assigned</h2>
      <p>A lead has been assigned to you.</p>
      <p><strong>Lead Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Interest:</strong> ${lead.propertyInterest}</p>
      <p><strong>Budget:</strong> PKR ${Number(lead.budget).toLocaleString()}</p>
      <p><strong>Priority:</strong> ${lead.score}</p>
      <p><strong>Assigned Agent:</strong> ${agent.name}</p>
    </div>
  `;
}