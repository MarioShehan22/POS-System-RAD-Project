import PDFDocument from 'pdfkit';
import fs from 'fs';

// Function to create the invoice PDF
function createInvoice(invoiceData, filePath) {
  return new Promise((resolve, reject) => {
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 30
    });
    
    // Use the provided path or generate a default one
    const outputPath = filePath || `bill_${invoiceData._id}.pdf`;
    
    // Pipe the PDF to a writable stream and save the stream reference
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Background wave design
    drawWaveBackground(doc);

    // Add company logo and info
    addCompanyInfo(doc, invoiceData.company || {});

    // Add invoice header
    addInvoiceHeader(doc);

    // Add customer information
    addCustomerInfo(doc, invoiceData.Customer);

    // Add order details
    addOrderInfo(doc, { _id: invoiceData._id, Date: invoiceData.date });

    // Add invoice items table
    addInvoiceTable(doc, invoiceData.products);

    // Add total
    addTotal(doc, invoiceData.total);

    // Add thank you note
    addThankYouNote(doc);

    // Finalize the PDF
    doc.end();
    
    // Properly resolve the promise when the stream is finished
    stream.on('finish', () => {
      resolve(outputPath);
    });
    
    // Handle errors
    stream.on('error', (error) => {
      reject(error);
    });
  });
}

// Draw the wave background design
function drawWaveBackground(doc) {
  // Top-right curved area
  doc.save()
    .moveTo(450, 0)
    .lineTo(600, 0)
    .lineTo(600, 300)
    .bezierCurveTo(450, 250, 550, 150, 450, 0)
    .fill('#0c2d6b');

  // Bottom wave design
  doc.save()
    .moveTo(0, 1100)
    .bezierCurveTo(200, 1000, 400, 1200, 600, 1100)
    .lineTo(600, 842)
    .lineTo(0, 842)
    .fill('#0c2d6b');
}

// Add company logo and information
function addCompanyInfo(doc, company) {
  // Draw a circle for the logo background
  doc.circle(130, 105, 25)
    .lineWidth(2)
    .stroke('#0c2d6b');

  // Company name
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#0c2d6b')
    .text('SMART', 155, 85)
    .text('STOCK PRIME', 155, 100)
    .text('INVENTORY', 155, 115);

  // Company address and contact info
  doc
    .font('Helvetica')
    .fontSize(12)
    .text('123 Main St., Negambo, ST 12345', 100, 172, { align: 'left' })
    .text('+94-707654321', 100, 187, { align: 'left' })
    .text('smartStockPrime@gmail.com', 100, 202, { align: 'left' });
  
  // Horizontal line
  doc
    .strokeColor('#000000')
    .lineWidth(1)
    .moveTo(100, 230)
    .lineTo(500, 230)
    .stroke();
}

// Add invoice header
function addInvoiceHeader(doc) {
  doc
    .font('Helvetica-Bold')
    .fontSize(30)
    .fillColor('#0c2d6b')
    .text('Invoice', 400, 80);
}

// Add customer information
function addCustomerInfo(doc, customer) {
  if (!customer) {
    customer = { firstName: 'N/A', address: 'N/A' };
  }
  
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor('#000000')
    .text('BILLED TO:', 100, 250);

  doc
    .font('Helvetica')
    .fontSize(10)
    .text(`Customer's Name: ${customer.firstName}`, 350, 250, { align: 'right' })
    .text(`Address: ${customer.address}`, 350, 265, { align: 'right' });
  
  // Horizontal line
  doc
    .strokeColor('#000000')
    .lineWidth(1)
    .moveTo(100, 290)
    .lineTo(500, 290)
    .stroke();
}

// Add order information
function addOrderInfo(doc, order) {
  doc
    .font('Helvetica')
    .fontSize(8)
    .text(`Order #: ${order._id}`, 350, 310, { align: 'right' })
    .text(`Invoice Date: ${order.Date}`, 350, 325, { align: 'right' });
  
  // Horizontal line
  doc
    .strokeColor('#000000')
    .lineWidth(1)
    .moveTo(100, 345)
    .lineTo(500, 345)
    .stroke();
}

// Add invoice items table
function addInvoiceTable(doc, products) {
  // Table headers
  const tableTop = 375;
  const tableWidth = 400;
  
  doc
    .fillColor('#ffffff')
    .rect(100, tableTop, tableWidth, 30)
    .fill('#0c2d6b');
  
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('ITEM', 115, tableTop + 10)
    .text('UNIT PRICE', 225, tableTop + 10)
    .text('DISCOUNTED PRICE', 310, tableTop + 10)
    .text('QTY', 415, tableTop + 10)
    .text('TOTAL', 465, tableTop + 10);
  
  let position = tableTop + 40;
  
  // Table content
  if (products && products.length > 0) {
    products.forEach(item => {
      doc
        .fillColor('#000000')
        .font('Helvetica')
        .fontSize(8)
        .text(item.name, 115, position)
        .text(item.unitprice, 225, position)
        .text(item.discountedprice || item.unitPrice, 310, position)
        .text(item.qty.toString(), 415, position)
        .text(item.total, 465, position);
      
      // Horizontal line
      position += 20;
      doc
        .strokeColor('#000000')
        .lineWidth(1)
        .moveTo(100, position)
        .lineTo(500, position)
        .stroke();
      
      position += 20;
    });
  }

  return position;
}

// Add total
function addTotal(doc, total) {
  doc
    .fillColor('#ffffff')
    .rect(340, 650, 160, 30)
    .fill('#0c2d6b');
  
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('TOTAL', 380, 660);
  
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(total, 450, 660);
}

// Add thank you note
function addThankYouNote(doc) {
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('Thank you for purchase!', 100, 780, {
      align: 'center'
    });
}

export {
  createInvoice
};