import { IContactMail } from './type';

export const templates = {
    successContactForm: ({ name, companyName, contactName, mailSystem, subject }: IContactMail) => `
  <!DOCTYPE html>
<html>
<head>
    <style>
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
    </style>
</head>
<body>
    <div class="container">
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
    </div>
</body>
</html>
  `,
    contactMail: ({ name, email, message, subject }: IContactMail) => `
  <!DOCTYPE html>
<html>
<head>
    <style>
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
        .list-item {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="container">
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
    </div>
</body>
</html>
  `
};
