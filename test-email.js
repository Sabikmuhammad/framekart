#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * Run with: node test-email.js
 */

// Load environment variables from .env.local
const fs = require("fs");
const path = require("path");

try {
  const envPath = path.join(__dirname, ".env.local");
  const envFile = fs.readFileSync(envPath, "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
} catch (error) {
  console.log("Warning: Could not load .env.local");
}

const https = require("https");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check environment variables
log("\n📧 FrameKart Email Configuration Test\n", "cyan");
log("═".repeat(50), "blue");

log("\n1️⃣  Checking Environment Variables...\n", "yellow");

const checks = [
  {
    name: "RESEND_API_KEY",
    value: process.env.RESEND_API_KEY,
    required: true,
  },
  {
    name: "EMAIL_FROM",
    value: process.env.EMAIL_FROM,
    required: true,
  },
  {
    name: "ADMIN_EMAIL",
    value: process.env.ADMIN_EMAIL,
    required: false,
  },
];

let allPassed = true;

checks.forEach((check) => {
  if (check.value) {
    log(`✅ ${check.name}: ${check.value}`, "green");
  } else {
    log(
      `${check.required ? "❌" : "⚠️ "} ${check.name}: Not set${
        check.required ? " (REQUIRED)" : " (optional)"
      }`,
      check.required ? "red" : "yellow"
    );
    if (check.required) allPassed = false;
  }
});

if (!allPassed) {
  log("\n❌ Configuration check failed!", "red");
  log("\nPlease set the required environment variables in .env.local", "yellow");
  process.exit(1);
}

// Test Resend API
log("\n2️⃣  Testing Resend API Connection...\n", "yellow");

const testEmail = {
  from: process.env.EMAIL_FROM,
  to: ["delivered@resend.dev"],
  subject: "FrameKart Email Test",
  html: "<div><h1>Email System Working!</h1><p>Test from FrameKart at " + new Date().toLocaleString("en-IN") + "</p></div>",
};

const data = JSON.stringify(testEmail);

const options = {
  hostname: "api.resend.com",
  path: "/emails",
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

const req = https.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    log("═".repeat(50), "blue");

    if (res.statusCode === 200) {
      const result = JSON.parse(responseData);
      log("\n✅ SUCCESS! Email sent successfully!\n", "green");
      log(`Email ID: ${result.id}`, "cyan");
      log(`\nNext steps:`, "yellow");
      log(
        `1. Check delivered@resend.dev for the test email`,
        "blue"
      );
      log(`2. Visit Resend Dashboard: https://resend.com/emails`, "blue");
      log(`3. Search for email ID: ${result.id}`, "blue");
      log(`4. Verify email content and delivery status\n`, "blue");
    } else {
      log("\n❌ FAILED! Email sending failed!\n", "red");
      log(`Status Code: ${res.statusCode}`, "red");
      log(`Response: ${responseData}\n`, "red");

      const error = JSON.parse(responseData);
      if (error.message) {
        log(`Error: ${error.message}`, "red");
      }

      log(`\nPossible issues:`, "yellow");
      log(`1. Domain not verified in Resend dashboard`, "blue");
      log(`2. Invalid API key`, "blue");
      log(
        `3. EMAIL_FROM domain doesn't match verified domain (framekart.co.in)`,
        "blue"
      );
      log(`4. Check Resend dashboard: https://resend.com/domains\n`, "blue");
    }

    log("═".repeat(50), "blue");
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on("error", (error) => {
  log("\n❌ Network error occurred!\n", "red");
  log(`Error: ${error.message}\n`, "red");
  process.exit(1);
});

req.write(data);
req.end();
