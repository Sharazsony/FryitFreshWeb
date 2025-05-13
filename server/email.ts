import nodemailer from "nodemailer";
import { User, Order, OrderItem, InsertContactMessage } from "@shared/schema";
import { storage } from "./storage";

// Create reusable transporter
const createTransporter = () => {
  // For development, we'll use Ethereal, a fake SMTP service
  if (process.env.NODE_ENV !== "production") {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "ethereal.user@ethereal.email",
        pass: process.env.EMAIL_PASSWORD || "ethereal.password",
      },
    });
  }
  
  // In production, use configured mail service
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send contact form notification
export async function sendContactNotification(message: InsertContactMessage) {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER || '"FruitFresh" <sharazsony@gmail.com>',
    to: process.env.ADMIN_EMAIL || "sharazsony@gmail.com",
    subject: `Contact Form: ${message.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2C5E1A;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.message.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px; color: #777;">This message was sent from the FruitFresh contact form.</p>
      </div>
    `,
  };
  
  const info = await transporter.sendMail(mailOptions);
  console.log("Contact notification email sent:", info.messageId);
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

// Send order confirmation
export async function sendOrderConfirmation(user: User, order: Order, orderItems: OrderItem[]) {
  const transporter = createTransporter();
  
  // Get product details for each order item
  const itemsWithDetails = await Promise.all(
    orderItems.map(async (item) => {
      const product = await storage.getProduct(item.productId);
      return {
        ...item,
        product,
      };
    })
  );
  
  // Format order items as HTML
  const itemsHtml = itemsWithDetails.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div>${item.product?.name}</div>
        <div style="color: #777; font-size: 14px;">${item.product?.category}</div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
    </tr>
  `).join('');
  
  const mailOptions = {
    from: process.env.EMAIL_USER || '"FruitFresh" <sharazsony@gmail.com>',
    to: user.email,
    subject: `Order Confirmation #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2C5E1A; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmation</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${user.firstName || user.username},</p>
          
          <p>Thank you for your order with FruitFresh! We're preparing your fresh organic produce for delivery.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order Number:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${order.createdAt.toLocaleString()}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
            <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
          </div>
          
          <h3 style="color: #2C5E1A;">Order Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Order Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">$${(order.totalAmount / 100).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <p style="margin-top: 30px;">If you have any questions about your order, please contact our customer support team at sharazsony@gmail.com.</p>
          
          <p>Thank you for supporting local farmers and choosing organic!</p>
          
          <p>Sincerely,<br>The FruitFresh Team</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #777; font-size: 14px;">
          <p>© ${new Date().getFullYear()} FruitFresh. All rights reserved.</p>
          <p>Fast NUCES, chionot FSD</p>
        </div>
      </div>
    `,
  };
  
  const info = await transporter.sendMail(mailOptions);
  console.log("Order confirmation email sent:", info.messageId);
  
  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}
