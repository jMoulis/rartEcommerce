import { IInvoice, IInvoiceInput } from '@/src/types/DBTypes';
import puppeteer, { PDFOptions } from 'puppeteer';
import { pdfInvoiceTemplate } from './pdfInvoiceTemplate';
import { getAdminDocument } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { format } from 'date-fns';
import fs from 'fs';
export const generatePDFInvoice = async (invoice: IInvoiceInput) => {
  const html = pdfInvoiceTemplate(invoice);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const propsPDF: PDFOptions = {
    format: 'A4',
    landscape: false,
    pageRanges: '',
    margin: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm',
    },
  };
  const page = await browser.newPage();

  await page.setContent(html);

  const pdf = await page.pdf(propsPDF);

  await browser.close();

  // // Specify the path where you want to save the PDF
  const pdfPath = `./uploads/${Date.now()}.pdf`;

  // // Write the PDF to a file
  fs.writeFileSync(pdfPath, pdf);

  // console.info(pdf);
};
