import { IEmailWithLinkToken } from './types';

export const templates = {
    verifyAccount: ({ companyName, contactName, mailSystem, subject, linkToken }: IEmailWithLinkToken) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${subject}</h1>
        <p>Bonjour,</p>
        <p>Nous sommes ravis de vous compter parmi notre communauté et espérons que votre expérience sur <strong>${companyName}</strong> sera inspirante et enrichissante.</p>
        <p>Afin de valider votre compte Veuillez cliquer sur le lien suivant,</p>
        <a href="${linkToken}" class="button">Vérifier</a>
        <p>Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail.</p>
        <p>Bien cordialement,</p>
        <p>${contactName}<br>
        ${mailSystem}</p>
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${companyName}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>

  `
};
