import { IInvoice } from '@/src/types/DBTypes';
import puppeteer, { PDFOptions } from 'puppeteer';
import { pdfInvoiceTemplate } from './pdfInvoiceTemplate';
import fs from 'fs';
import { nunaLogo } from './logos';
import { bucket } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

export const generatePDFInvoice = async (invoice: IInvoice) => {
  const html = pdfInvoiceTemplate(invoice);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const propsPDF: PDFOptions = {
    format: 'A4',
    landscape: false,
    displayHeaderFooter: true,
    headerTemplate: '<span></span',
    footerTemplate: `<div style="display: flex; justify-content: center; align-items:center; margin-left: 100px">
        <div style="display: flex; flex-direction: column; align-items: center">
          <p style="text-align: center; font-size: 12px; margin: 0">
            l'entrepreneur Rachel Moulis bénéficie d'un Contrat d'appui au
            projet d'entreprise du 08/01/2024 au 07/01/2025
          </p>
          <p style="text-align: center; font-size: 12px; margin: 0"> avec la couveuse
            Nuna Développement THYEZ
          </p>
          <p style="text-align: center; font-size: 12px; margin: 0">
            Site économique des Lacs 320, rue des Sorbiers 74300 Thyez
          </p>
          <p style="text-align: center; font-size: 12px; margin: 0">
            Siret: 53825476400029 Code NAF: RCS: Numéro formation:
            Email:<a style="text-decoration: none;
        color: #000;" href="mailto:couveuse@nunadev.com">couveuse@nunadev.com</a> Téléphone: <a style="text-decoration: none;
        color: #000;" href="tel:+33450907240">+33450907240</a>
          </p>
        </div>
          <img src=${nunaLogo} style="width: 30px" />
      </div>`,
    pageRanges: '',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '150px',
      left: '10mm',
    },
  };
  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf(propsPDF);

  await browser.close();

  const pdfPath = `./uploads/${Date.now()}.pdf`;

  const filename = `${invoice.invoiceId}/${Date.now()}.pdf`;
  const folderName = `invoices/${filename}`;

  const file = bucket.file(folderName);
  await file.save(pdf, {
    metadata: {
      contentType: 'application/pdf'
    }
  });
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491', // Set an appropriate expiry date
  });

  fs.writeFileSync(pdfPath, pdf);

  return { content: pdf, url, filename, contentType: 'application/pdf' };
};
