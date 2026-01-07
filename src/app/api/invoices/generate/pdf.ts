import { IInvoice } from '@/src/types/DBTypes';
import fetch from 'node-fetch';
import { pdfInvoiceTemplate } from './pdfInvoiceTemplate';
import { bucket } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { PassThrough } from 'stream';
// btoa and fetch are needed
global.btoa = (b) => Buffer.from(b).toString('base64');

const fetchGeneratedPdf = async (invoiceId: string, pdf: { html: string, options: Record<string, any> }, estimate: boolean) => new Promise<{ content: any, url: string, filename: string, contentType: string }>((resolve, reject) => {
  try {
    if (!process.env.PDF_SHIFT_API_URL || !process.env.PDF_SHIFT_SK_API) {
      reject(new Error('Missing credentials'));
      return;
    }

    fetch(process.env.PDF_SHIFT_API_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(process.env.PDF_SHIFT_SK_API),
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        source: pdf.html,
        landscape: false,
        // sandbox: true,
        footer: { source: pdf.options.footerTemplate },
        margin: pdf.options.margin,
        format: pdf.options.format
      }),
    }).then((response) => {
      if (!response.ok) {
        reject(new Error(`${response.statusText} - ${response.status}`));
        return;
      }
      const filename = `${invoiceId}/${Date.now()}.pdf`;
      const folderName = estimate ? `estimates/${filename}` : `invoices/${filename}`;
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
    }).catch((error) => {
      reject(error);
    });
  } catch (error) {
    reject(error);
  }
});
export const generatePDFInvoice = async (invoice: IInvoice, estimate: boolean, webhook: boolean) => {
  const html = pdfInvoiceTemplate(invoice, estimate, webhook);
  const propsPDF = {
    format: 'A4',
    landscape: false,
    displayHeaderFooter: true,
    headerTemplate: '<span></span',
    footerTemplate: `<div
  style="
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 150px;
  "
>
  <div style="display: flex; flex-direction: column; align-items: center">
    <p style="text-align: center; font-size: 8px; margin: 0; font-family: serif">
      Rachel Moulis - 2521 route de Bonneville - 74800 Arenthon
    </p>

    <div style="text-align: center; font-size: 8px; margin: 0; font-family: serif">
      Téléphone:
      <a
        style="text-decoration: none; color: #000; font-family: serif"
        href="tel:+33616224928"
        >+33 (0)6 16 22 49 28</a
      >
      <span style="font-family: serif"> - </span>
      Email:
      <a
        style="text-decoration: none; color: #000; margin-left: 5px; font-family: serif"
        href="mailto:contact@rartcreation.fr"
        >contact@rartcreation.fr</a
      >
    </div>
    <p style="text-align: center; font-size: 8px; margin: 0; font-family: serif">
      <a
        style="text-decoration: none; color: #000; font-size:8px; font-family: serif"
        href="http://www.rartcreation.fr"
        >rartcreation.fr</a
      >
      - Siret: 75043160300026 - Code APE: 9003A
    </p>
  </div>
</div>
`,
    pageRanges: '',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '150px',
      left: '10mm',
    },
  };
  try {
    const response = await fetchGeneratedPdf(invoice.invoiceId, { html, options: propsPDF }, estimate);
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};
