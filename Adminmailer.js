const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const express = require("express");

exports.adminNodemailer = async (email, token, id) => {
  const API_KEY =
    "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";
   
  sgMail.setApiKey(API_KEY);
 
  function getMessage() {
    const body = "This is a test email using SendGrid from Node.js";
    return {
      to: "anserishaq472@gmail.com",
      from: "ali.raees500@gmail.com",
      subject: "Test email with Node.js and SendGrid",
      text: "hello",
      html: `<strong> http://127.0.0.1:5173/admin-reset-password/${id} click here to reset password</strong>`,
    };
  }
  // console.log("getting message from",getMessage)

  async function sendEmail() {
    try {
      await sgMail.send(getMessage());
      
      console.log("Test email sent successfully");
    } catch (error) {
      console.error("Error sending test email");
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  (async () => {
    console.log("Sending test email");
    await sendEmail();
  })();
};
