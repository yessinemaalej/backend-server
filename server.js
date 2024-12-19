const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Initialize the app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Outlook365", // You can use other services like SendGrid, Mailgun, etc.
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_NODE_MAILER_USER, 
    pass: process.env.NEXT_PUBLIC_NODE_MAILER_PASS, 
  },
});

// Send Email Function
const sendEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: {
        name: "Orion team",
        address: "orion@dioneprotocol.com"
      },
      to: email,
      subject: "Your Orion is on the Way!",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orion Purchase Confirmation</title>
  <style>
    /* Base Styles */
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #f4f4f4, #fce7f3);
      margin: 0;
      padding: 0;
      color: #333333;
    }

    /* Container Styles */
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(79, 33, 161, 0.15);
      overflow: hidden;
    }

    /* Header Styles */
    .email-header {
      background: linear-gradient(135deg, #4F21A1, #ab48c1);
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
      position: relative;
      overflow: hidden;
    }

    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }

    .email-header h1 {
      margin: 0;
      font-size: 24px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    /* Body Styles */
    .email-body {
      padding: 20px 30px;
      line-height: 1.6;
      background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(252,231,243,0.3));
    }

    .email-body p {
      margin: 10px 0;
    }

    .email-body a {
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      font-weight: bold;
    }

    /* Footer Styles */
    .email-footer {
      background: linear-gradient(135deg, #4F21A1, #ab48c1);
      color: #ffffff;
      text-align: center;
      padding: 15px 10px;
      font-size: 14px;
      position: relative;
    }

    .email-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }

    .email-footer p {
      margin: 5px 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    /* Button Styles */
    .cta-button {
      display: inline-block;
      color: #490b66;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 5px;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(79, 33, 161, 0.2);
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 33, 161, 0.3);
    }

    /* Media Queries */
    @media (max-width: 600px) {
      .cta-button {
        font-size: 14px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <h1>Congratulations, ${fullName}!</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Thank you for purchasing your <strong>Orion device</strong>. We're thrilled to have you as part of the Dione Protocol community!</p>
      <p>We are currently <strong>manufacturing your device</strong> and expect to ship it to your address in approximately <strong>1.5 months</strong>.</p>
      <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
      <p>
        <a href="mailto:orion@dioneprotocol.com">orion@dioneprotocol.com</a>
      </p>
      <p>We're excited to have you on board as we continue to innovate in renewable energy technology!</p>
      <div style="text-align: center;">
        <a href="https://dioneprotocol.com" class="cta-button">Visit Our Website</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>Best regards,</p>
      <p>The Dione Protocol Team</p>
      <p>&copy; ${new Date().getFullYear()} Dione Protocol. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
// MongoDB connection
const dbURI = process.env.NEXT_PUBLIC_MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  shipmentDetails: {
    odrerId: String,
    fullName: String,
    email: String,
    country: String,
    city: String,
    zipCode: String,
    addressLine1: String,
    addressLine2: String,
    phoneNumber: String,
  },
  shipmentStatus: { type: String, enum: ["Not Shipped", "In Progress", "Shipped"], default: "Not Shipped" },
  transactionHash: String,
});

const User = mongoose.model("User", userSchema);
app.post("/api/payment-success", async (req, res) => {
    const { email, fullName } = req.body;
  
    try {
      // Call the email function
      await sendEmail(email, fullName);
  
      res.status(200).json({ message: "Payment success email sent." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  });
// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update shipment status
app.patch("/api/users/:walletAddress", async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { shipmentStatus } = req.body;
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { shipmentStatus },
      { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
const PORT = process.env.PORT;
console.log(PORT)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));