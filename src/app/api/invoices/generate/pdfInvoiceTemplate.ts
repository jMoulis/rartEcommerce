import { IInvoiceInput } from '@/src/types/DBTypes';
import { format } from 'date-fns';
import { rartLogo } from './logos';

export const pdfInvoiceTemplate = (invoice: IInvoiceInput) => {
  const {
    customerInformations,
    createdAt,
    invoiceId,
    comment
  } = invoice;
  const date = format(createdAt ?? new Date(), 'dd/MM/yyyy');
  const firstname = customerInformations?.firstname ?? '';
  const lastname = customerInformations?.lastname ?? '';
  const fullName = `${firstname} ${lastname}`;
  const companyName = customerInformations?.companyName ?? '';
  const email = customerInformations?.email ?? '';
  const address = customerInformations?.address ?? null;
  const table = invoice.lineItems.map((item) => {
    const tvaTaux = 0;
    const tauxTvaString = '0%';
    const priceHt = item.quantity * item.unitPrice;
    const totalTva = Math.ceil(priceHt * tvaTaux);
    const total = priceHt + totalTva;
    return `
    <tr>
      <td class="table-row">
        <p class="table-cell">${item.description}</p>
      </td>
      <td class="table-row">
        <p class="table-cell">${item.quantity}</p>
      </td>
      <td class="table-row">
        <p class="table-cell">${item.unitPrice}</p>
      </td>
      <td class="table-row">
        <p class="table-cell">${tauxTvaString}</p>
      </td>
      <td class="table-row">
        <p class="table-cell">${totalTva}</p>
      </td>
      <td class="table-row">
        <p class="table-cell">${total}</p>
      </td>
      </tr>
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
    <style>
      @media print {
        body {
          margin: 0;
        }
        * {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
         tr {
          page-break-inside: avoid;
        }
        .footer {
          page-break-before: always;
        }
        .table {
          page-break-after: auto;
          max-height: calc(100vh - 1500px);
        }
      }
      html,
      body {
        padding-bottom: 0;
      }
      body {
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 50px 40px 0 40px;
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
        font-family: 'Eb garamond', serif;
        margin: 0;
        padding: 0;
      }
      .main {
        display: flex;
        flex-direction: column;
      }
      .table {
        border-collapse: collapse;
        background-color: rgba(0, 0, 0, 0.03);
        border-radius: 10px;
        padding-bottom: 10px;
        box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.1);
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .table-row {
        border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      }
      .table-cell {
        padding: 5px 10px;
      }
      .table-cell-header {
        display: flex;
        align-items: center;
        font-family: 'Eb garamond', serif;
        padding-bottom: 5px;
        padding: 5px 15px;
        white-space: nowrap;
        height: 40px;
      }
      .table-footer {
        padding: 10px;
      }
      .price-footer {
        display: grid;
        grid-template-columns: 150px 50px;
        justify-content: flex-end;
      }
      .header {
        display: flex;
        flex-direction: column;
        margin-bottom: 30px;
      }
      .customer {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      .customer-name {
        font-weight: bold;
        font-size: 20px;
      }
       .company {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
      }
      .company-logo {
        height: 100px;
        width: 100px;
        border-radius: 5px;
      }
      .company-name {
        max-width: 100px;
        font-weight: bold;
      }
      .conditions {
        margin-top: 10px;
      }
      .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
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
        <img src=${rartLogo} class="company-logo" />
        <span class="company-name">Rart Création</span>
      </div>
      <div class="customer">
        <div>
          <span class="customer-name">${companyName || fullName}</span>
          <div>
            <p>${address?.address}</p>
            <p>${`${address?.postalCode ?? ''} ${address?.locality ?? ''}`}</p>
            <p>${email}</p>
          </div>
        </div>
      </div>
    </header>
    <main class="main">
      <div>
        <p style="font-size: 20px">Facture: ${invoiceId}</p>
        <p>Date: ${date}</p>
      </div>
     <table class="table">
      <thead>
          <tr>
            <th class="table-row">
              <p class="table-cell-header">Description</p>
            </th>
            <th class="table-row">
              <p class="table-cell-header">Quantité</p>
            </th>
            <th class="table-row">
              <p class="table-cell-header">Prix HT (€)</p>
            </th>
            <th class="table-row">
              <p class="table-cell-header">Taux TVA</p>
            </th>
            <th class="table-row">
              <p class="table-cell-header">TVA (€)</p>
            </th>
            <th class="table-row">
              <p class="table-cell-header">Prix TTC (€)</p>
            </th>
          </tr>
        </thead>

      <tbody>
        ${table.join('')}
      </tbody>
      <tfoot>
         <tr>
         <td class="table-footer" colspan="6">
          <div class="price-footer">
            <p style="font-weight: bolder; white-space: nowrap">Total HT:</p>
            <p>${invoice.ht}€</p>
          </div>
          <div class="price-footer">
            <p style="font-weight: bolder; white-space: nowrap">Total taxes:</p>
            <p>${invoice.taxes}€</p>
          </div>
          <div class="price-footer">
            <p style="font-weight: bolder; white-space: nowrap">Total TTC:</p>
            <p>${invoice.amount.toLocaleString()}€</p>
          </div>
          <div class="price-footer">
            <p style="font-weight: bolder">Reste dû:</p>
            <p>0,00€</p>
          </div>
         </td>
        </tr>
        </tfoot>
      </table>
      <div class="conditions">
        <div style="margin-bottom: 10px">
        <p  class="x-small">Détails de la facture</p>
        <p class="x-small">${comment ?? ''}</p>
        </div>
        <p class="x-small">
          Paiement à réception de la facture par virement ou chèque
        </p>
        <p class="x-small">
          IBAN : FR32 3000 2060 6500 0000 0512 M03 BIC: CRLYFRPP
        </p>
        <p class="x-small">
          En cas de retard de paiement, des frais forfaitaires de recouvrement
          de 40€ seront appliqués.
        </p>
      </div>
    </main>
  </body>
</html>
`;
};
