import { IInvoiceInput } from '@/src/types/DBTypes';
import { format } from 'date-fns';
import { nunaLogo, rartLogo } from './logos';

export const pdfInvoiceTemplate = (invoice: IInvoiceInput) => {
  const {
    customerInformations: {
      address,
      firstname,
      lastname,
      email,
    },
    createdAt,
    invoiceId
  } = invoice;
  const date = format(createdAt || new Date(), 'dd/MM/yyyy');

  const table = invoice.lineItems.map((item) => {
    const tvaTaux = 0.20;
    const tauxTvaString = '20%';
    const priceHt = item.quantity * item.unitPrice;
    const totalTva = priceHt * tvaTaux;
    const total = priceHt + totalTva;
    return `
          <div class="table-row">
            <p class="table-cell">${item.description}</p>
          </div>
          <div class="table-row">
            <p class="table-cell">${item.quantity}</p>
          </div>
          <div class="table-row">
            <p class="table-cell">${item.unitPrice}</p>
          </div>
          <div class="table-row">
            <p class="table-cell">${tauxTvaString}</p>
          </div>
          <div class="table-row">
            <p class="table-cell">${totalTva}</p>
          </div>
          <div class="table-row">
            <p class="table-cell">${total}</p>
          </div>
        `;
  });

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
      rel="stylesheet" />
    <style>
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        * {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          /* Ensure print styles are not excluding this */
        }
      }
      html,
      body {
        height: 100vh;
      }
      body {
        display: flex;
        flex-direction: column;
      }
      p,
      span,
      a {
        font-family: 'Eb garamond', serif;
        font-weight: 400;
        font-size: 13px;
      }
      a {
        text-decoration: none;
        color: #000;
      }
      p {
        margin: 0;
        padding: 0;
      }
      .table {
        display: grid;
        grid-template-columns: 50% repeat(5, 1fr);
        background-color: rgba(0, 0, 0, 0.03);
        border-radius: 10px;
        margin: 5px 10px;
        margin-top:20px;
        padding-bottom: 10px;
        box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.1);
      }
      .table-row {
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
        overflow: hidden;
        display: flex;
        align-items: center;
      }
      .table-cell {
        padding: 5px 10px;
      }
      .table-cell-header {
        font-family: 'Eb garamond', serif;
        padding-bottom: 5px;
        padding: 5px 10px;
        white-space: nowrap;

      }
      .table-footer {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        grid-column: 1 / -1;
      }
      .header {
        display: flex;
      }
      .customer {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .customer-name {
        font-weight: bold;
        font-size: 20px;
      }
      .company {
        display: flex;
      }
      .main {
        margin: 20px 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
      }
      .price-footer {
        display: grid;
        grid-template-columns: 100px 100px;
      }
      .flexbox {
        display: flex;
      }
      .small {
        font-size: 13px;
      }
      .x-small {
        font-size: 11px;
      }
    </style>
    <title>PDF</title>
  </head>
  <body>
    <header class="header">
      <div class="company">
        <img src=${rartLogo} style="height: 50px; border-radius: 5px; margin-right: 20px" />
        <div>
          <span>RartCreation</span>
          <div>
            <p>2521 route de bonneville</p>
            <p>74800 Arenthon</p>
            <p>
              <a href="mailto:contact@rartcreation.fr"
                >contact@rartcreation.fr</a
              >
            </p>
            <p>
              <a href="https://www.rartcreation.fr"
                >https://www.rartcreation.fr</a
              >
            </p>
          </div>
        </div>
      </div>
      <div class="customer">
        <div>
          <span class="customer-name">${`${firstname} ${lastname}`}</span>
          <div>
            <p>${address?.address}</p>
            <p>${`${address?.postalCode ?? ''} ${address?.locality ?? ''}`}</p>
            <p>${email}</p>
          </div>
        </div>
      </div>
    </header>
    <main class="main">
      <div style="margin-left: 20px">
        <p style="font-size: 20px">Facture: ${invoiceId}</p>
        <p>Date: ${date}</p>
      </div>
      <div class="table">
        <div class="table-row">
          <p class="table-cell-header">Description</p>
        </div>
        <div class="table-row">
          <p class="table-cell-header">quantité</p>
        </div>
        <div class="table-row">
          <p class="table-cell-header">prix ht (€)</p>
        </div>
        <div class="table-row">
          <p class="table-cell-header">Taux tva</p>
        </div>
        <div class="table-row">
          <p class="table-cell-header">TVA (€)</p>
        </div>
        <div class="table-row">
          <p class="table-cell-header">prix ttc (€)</p>
        </div>
       ${table.join('')}
         <div class="table-footer">
      <div class="price-footer">
        <p style="font-weight: bolder">Total HT:</p>
        <p>${invoice.ht}€</p>
      </div>
      <div class="price-footer">
        <p style="font-weight: bolder">Total taxes:</p>
        <p>${invoice.taxes}€</p>
      </div>
      <div class="price-footer">
        <p style="font-weight: bolder">Total TTC:</p>
        <p>${invoice.amount}€</p>
      </div>
      <div class="price-footer">
        <p style="font-weight: bolder">Reste dû:</p>
        <p>0,00€</p>
      </div>
    </div>
      </div>
    </main>
    <footer style="margin: 10px 50px">
      <div>
        <p class="small">Date de règlement: ${date}</p>
        <p class="small">Date d'exécution de la vente: ${date}</p>
      </div>
      <div>
        <p class="x-small">
          En votre aimable règlement par virement ou chèque à l'ordre de la
          Couveuse d'entreprises / Rart Création Nuna Développement THYEZ
        </p>
        <p class="x-small">
          Site économique des Lacs 320, rue des Sorbiers 74300 Thyez
        </p>
        <p class="x-small">
          IBAN : FR76 3000 3036 0503 2200 0820 439 Banque: Société Générale
        </p>
        <p class="x-small">Escompte pour paiement anticipé : néant</p>
        <p class="x-small">
          En cas de non-paiement à la date de règlement, des pénalités de retard
          forfaitaires de 40€ seront appliquées pour frais de recouvrement.
        </p>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        ">
        <div style="display: flex; flex-direction: column; align-items: center">
          <p class="x-small" style="font-weight: bold">
            Site web : www.rartcreation.fr
          </p>
          <p class="x-small" style="text-align: center">
            l'entrepreneur Rachel Moulis bénéficie d'un Contrat d'appui au
            projet d'entreprise du 08/01/2024 au 07/01/2025 avec la couveuse
            Nuna Développement THYEZ
          </p>
          <p class="x-small">
            Site économique des Lacs 320, rue des Sorbiers 74300 Thyez
          </p>
          <p class="x-small">
            Siret:53825476400029 Code NAF: RCS: Numéro formation:
            Email:couveuse@nunadev.com Téléphone:+33450907240
          </p>
        </div>
        <img src=${nunaLogo} style="width: 30px" />
      </div>
    </footer>
  </body>
</html>
`;
};
