import { IInvoice } from '@/src/types/DBTypes';
import fetch from 'node-fetch';
import { pdfInvoiceTemplate } from './pdfInvoiceTemplate';
import { bucket } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

import path from 'path';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
export const config = {
  maxDuration: 150 // seconds. You'll need a paid plan to increase the duration above 10s as it's likely not enough time to complete the task.
};

const chromeArgs = [
  '--font-render-hinting=none', // Improves font-rendering quality and spacing
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--disable-animations',
  '--disable-background-timer-throttling',
  '--disable-restore-session-state',
  '--disable-web-security', // Only if necessary, be cautious with security implications
  '--single-process' // Be cautious as this can affect stability in some environments
];

async function getBrowser() {
  return puppeteer.launch({
    args: chromeArgs,
    executablePath: await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar'
    ),
    ignoreHTTPSErrors: true,
    headless: true
    // ignoreHTTPSErrors: true
  } as any);
}

const fetchGeneratedPdf = async (
  invoiceId: string,
  pdf: { html: string; options: Record<string, any> }
) =>
  new Promise<{
    content: any;
    url: string;
    filename: string;
    contentType: string;
  }>((resolve, reject) => {
    try {
      getBrowser()
        .then(async (browser) => {
          const page = await browser.newPage();
          await page.setContent(pdf.html, { waitUntil: 'networkidle0' });

          page
            .pdf({
              format: 'A4',
              printBackground: true,
              margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
            })
            .then(async (uint8Array) => {
              const filename = `${invoiceId}/${Date.now()}.pdf`;
              const folderName = `invoices/${filename}`;
              const buffer = Buffer.from(uint8Array);

              const file = bucket.file(folderName);
              await file.save(buffer, {
                metadata: {
                  contentType: 'application/pdf'
                }
              });

              console.log(`File uploaded to ${folderName}`);

              const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 60 * 60 * 1000 // 1 hour from now
              });
              console.log(`Generated signed URL: ${url}`);
              resolve({
                content: buffer,
                url,
                filename: `${invoiceId}/${Date.now()}.pdf`,
                contentType: 'application/pdf'
              });
            });
          await browser.close();
        })
        .catch((error) => {
          reject(error);
        });

      // fetch(`${process.env.NEXT_PUBLIC_PDF_URL}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(pdf)
      // }).then((response) => {
      //   if (!response.ok) {
      //     reject(new Error(`HTTP error! Status: ${response.status}`));
      //     return;
      //   }
      //   const filename = `${invoiceId}/${Date.now()}.pdf`;
      //   const folderName = `invoices/${filename}`;
      //   const file = bucket.file(folderName);
      // });
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
    footerTemplate: ` <div

      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 200px;
      ">
      <div style="display: flex; flex-direction: column; align-items: center">
        <p style="text-align: center; font-size: 12px; margin: 0; font-family: serif">
          Rachel Moulis - 2521 route de Bonneville - 74800 Arenthon
        </p>

        <div style="text-align: center; font-size: 12px; margin: 0">
          Téléphone:
          <a style="text-decoration: none; color: #000; font-family: serif" href="tel:+33616224928"
            >+33 (0)6 16 22 49 28</a
          >
          <span class="text-align: center; font-size: 12px; margin: 0; font-family: serif">-</span>
          Email:<a
            style="text-decoration: none; color: #000; margin-left: 5px; font-family: serif"
            href="mailto:contact@rartcreation.fr"
            >contact@rartcreation.fr</a
          >
          <p style="text-align: center; font-size: 12px; margin: 0; font-family: serif">
            <a style="font-family: serif" href="http://www.rartcreation.fr">rarcreation.fr</a> - Siret: 75043160300026 - Code APE: 9003A
          </p>
        </div>
      </div>
    </div>`,
    pageRanges: '',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '150px',
      left: '10mm'
    }
  };
  try {
    // const test = await renderToBuffer(<MyDocument />);
    // console.log(test)

    const response = await fetchGeneratedPdf(invoice.invoiceId, {
      html,
      options: propsPDF
    });
    return response;
  } catch (error: any) {
    console.log('ERROR LOG', error.message);
    throw new Error('Error while generating PDF');
  }
};
