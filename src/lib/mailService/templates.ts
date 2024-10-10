import { IContactMail } from '@/src/app/api/contact/type';
import { IContactInformations } from '@/src/types/DBTypes';

const css = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    color: #333;
    background-color: #f4f4f4;
  }
  .container {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 20px;
  }
  .header {
    color: #444;
    margin-bottom: 20px;
  }
  .footer {
    margin-top: 20px;
    font-size: 0.8em;
    color: #555;
  }
  .register-link {
    background-color: #085B79;
    color: #fff;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    jusitfy-content: center;
  }
`;

const html = (head: string, body: string) => `
  <!DOCTYPE html>
  <html>
    ${head}
    ${body}
  </html>
`;

const header = ({ title }: { title: string }) => `
  <head>
    <title>${title}</title>
      <style>
          ${css}
      </style>
    </head>`;
const body = (content: string) => `
  <body>
    ${content}
  </body>
`;
export const templates: Record<string, (params: any) => string> = {
  successContactForm: ({ name, companyName, contactName, mailSystem, subject }: IContactMail) =>
    html(header({ title: subject }), body(`<div class="container">
            <h1 class="header">${subject}</h1>
            <p>Bonjour ${name},</p>
            <p>Nous vous remercions d'avoir contacté <strong>${companyName}</strong>, la communauté dédiée aux passionnés d'art et d'artisanat.</p>
            <p>Votre message est très important pour nous. Un membre de notre équipe va le lire attentivement et vous répondra dans les plus brefs délais. Si votre demande nécessite une réponse urgente, n'hésitez pas à nous le faire savoir.</p>
            <p>En attendant, nous vous invitons à explorer notre galerie en ligne, où vous découvrirez des œuvres uniques réalisées par des artistes et artisans talentueux.</p>
            <p>Si vous avez des questions supplémentaires ou besoin d'assistance, n'hésitez pas à répondre à ce courriel.</p>
            <p>Nous sommes ravis de vous compter parmi notre communauté et espérons que votre expérience sur <strong>${companyName}</strong> sera inspirante et enrichissante.</p>
            <p>Bien cordialement,</p>
            <p>${contactName}<br>
            ${mailSystem}</p>
            <div class="footer">
                <p>© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.</p>
            </div>
        </div>`)),
  contactMail: ({ name, email, message, subject }: IContactMail) => html(header({ title: subject }), body(`<div class="container">
      <h1 class="header">${subject}</h1>
      <ul>
        <li class="list-item">
          <span>Nom du contact</span>
          <span>${name}</span>
        </li>
        <li class="list-item">
          <span>Email contact</span>
          <span>${email}</span>
        </li>
      </ul>
      <p>${message}</p>
    </div>`)),
  paymentSuccess: ({ customer, host, contactName, companyName, mailSystem, receiptUrl }: { customer: IContactInformations, host: string, contactName: string; companyName: string, mailSystem: string, receiptUrl: string }) => html(header({ title: 'Confirmation de paiement' }),
    `<h1>Confirmation de paiement</h1>
    <div class="container">
      <div class="header">Votre achat artistique est confirmé</div>
      <p>Cher(e) ${customer.firstname} ${customer.lastname},</p>
      <p>Nous sommes ravis de vous annoncer que votre paiement a été reçu avec succès (<a download="receipt.pdf" href="${receiptUrl}">voir reçu</a>). Un nouveau chapitre s'ajoute à votre parcours artistique, qu'il s'agisse d'une œuvre d'art unique ou d'une expérience enrichissante dans nos ateliers.</p>
      <p><a href="${host}?action=register&email=${customer.email}" class="register-link">Créez votre compte</a> pour une expérience sur mesure et découvrez plus d'inspirations.</p>
      <p>Votre Facture : Retrouvez votre facture en pièce jointe, symbole de cette belle rencontre entre votre passion et notre art.</p>
      <p>Pour toute question, nous sommes à votre écoute. Bienvenue dans notre communauté artistique.</p>
      <div class="footer">
        Avec gratitude,<br>
        ${contactName} & ${companyName}<br>
        ${mailSystem}
      </div>
    </div>
    `)
};
