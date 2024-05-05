import { IInvoice } from '@/src/types/DBTypes';
import fetch from 'node-fetch';
import { pdfInvoiceTemplate } from './pdfInvoiceTemplate';
import { nunaLogo } from './logos';
import { bucket } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { PassThrough } from 'stream';

const fetchGeneratedPdf = async (invoiceId: string, pdf: { html: string, options: Record<string, any> }) => new Promise<{ content: any, url: string, filename: string, contentType: string }>((resolve, reject) => {
  try {
    fetch(`${process.env.NEXT_PUBLIC_PDF_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdf),
    }).then((response) => {
      if (!response.ok) {
        reject(new Error(`HTTP error! Status: ${response.status}`));
        return;
      }
      const filename = `${invoiceId}/${Date.now()}.pdf`;
      const folderName = `invoices/${filename}`;
      const file = bucket.file(folderName);

      const passThrough = new PassThrough();
      const chunks: any[] = []; // Store chunks here to convert to Buffer later

      passThrough.on('data', (chunk) => {
        chunks.push(chunk);
      });
      const blobStream = file.createWriteStream({
        metadata: {
          contentType: 'application/pdf',
        },
      });

      passThrough.pipe(blobStream);
      response.body?.pipe(passThrough);

      blobStream.on('finish', async () => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '03-09-2491', // Set an appropriate expiry date
        });
        const pdfBuffer = Buffer.concat(chunks);
        resolve({ content: pdfBuffer, url, filename, contentType: 'application/pdf' });
      }).on('error', (error) => {
        throw new Error(`Stream writing error: ${error as any}`);
      });
    });
  } catch (error) {
    reject(error);
  }
});
export const generatePDFInvoice = async (invoice: IInvoice) => {
  const html = pdfInvoiceTemplate(invoice);
  const propsPDF = {
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
  try {
    const response = await fetchGeneratedPdf(invoice.invoiceId, { html, options: propsPDF });
    return response;
  } catch (error) {
    throw new Error('Error while generating PDF');
  }
};
