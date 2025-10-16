import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CertificateData {
  recipientName: string;
  category: string;
  month: string;
  year: number;
  date: Date;
}

export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  // ESE Colors
  const blueColor = rgb(0.04, 0.28, 0.45); // #094773
  const greenColor = rgb(0.17, 0.36, 0.30); // #2C5B4C

  // Draw border
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: blueColor,
    borderWidth: 3,
  });

  // Draw inner border
  page.drawRectangle({
    x: 50,
    y: 50,
    width: width - 100,
    height: height - 100,
    borderColor: greenColor,
    borderWidth: 1,
  });

  // Title
  page.drawText('Certificate of Recognition', {
    x: width / 2 - 150,
    y: height - 120,
    size: 28,
    font: boldFont,
    color: blueColor,
  });

  // ESE Title
  page.drawText('Eternity School of Egypt', {
    x: width / 2 - 120,
    y: height - 160,
    size: 20,
    font: font,
    color: greenColor,
  });

  // Presented to
  page.drawText('This certificate is proudly presented to', {
    x: width / 2 - 140,
    y: height - 240,
    size: 14,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient name
  page.drawText(data.recipientName, {
    x: width / 2 - (data.recipientName.length * 8),
    y: height - 290,
    size: 32,
    font: boldFont,
    color: blueColor,
  });

  // Award description
  const awardText = `For being recognized as the ${data.category}`;
  page.drawText(awardText, {
    x: width / 2 - (awardText.length * 3.5),
    y: height - 350,
    size: 16,
    font: font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Month and Year
  const dateText = `${data.month} ${data.year}`;
  page.drawText(dateText, {
    x: width / 2 - (dateText.length * 5),
    y: height - 390,
    size: 18,
    font: boldFont,
    color: greenColor,
  });

  // Congratulations message
  const congrats = 'In recognition of your outstanding contribution and dedication';
  page.drawText(congrats, {
    x: width / 2 - (congrats.length * 3),
    y: height - 460,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  const congrats2 = 'to the excellence of Eternity School of Egypt';
  page.drawText(congrats2, {
    x: width / 2 - (congrats2.length * 3),
    y: height - 485,
    size: 12,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Date issued
  const issuedDate = data.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  page.drawText(`Date Issued: ${issuedDate}`, {
    x: 100,
    y: 120,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Signature lines
  page.drawLine({
    start: { x: 100, y: 200 },
    end: { x: 250, y: 200 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawLine({
    start: { x: width - 250, y: 200 },
    end: { x: width - 100, y: 200 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText('CEO', {
    x: 150,
    y: 180,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText('People & Culture', {
    x: width - 220,
    y: 180,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function generateCertificateBlob(data: CertificateData): Promise<Blob> {
  const bytes = await generateCertificate(data);
  return new Blob([bytes as any], { type: 'application/pdf' });
}
