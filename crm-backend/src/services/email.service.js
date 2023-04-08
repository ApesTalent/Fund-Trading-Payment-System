const sgMail = require("@sendgrid/mail");
const HTMLParser = require("node-html-parser");
const config = require("../config/config");
const logger = require("../config/logger");
const tokenService = require("./token.service");
const payoutService = require("./payout.service");
const invoiceService = require("./invoice.service");
const templateService = require("./template.service");
const overviewService = require("./overview.service");
const moment = require("moment");
const { tokenTypes } = require("../config/tokens");
const ApiError = require("../utils/ApiError");
const { formatMoney } = require("../utils/Formatter");

sgMail.setApiKey(config.email.sendgrid_api_key);

/**
 * Send an Information Need email
 * @param {string} sendTo
 * @param {string} pId
 */
const sendPendingEmail = async (sendTo, pId, from) => {
  const payout = await payoutService.getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }

  const payoutEmailTemplate = await templateService.getTemplateById(
    "payoutEmailTemplate"
  );
  if (!payoutEmailTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, "payoutEmailTemplate not found");
  }
  var payoutEmail = HTMLParser.parse(payoutEmailTemplate.text);

  const formTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const formToken = tokenService.generateToken(
    pId,
    formTokenExpires,
    tokenTypes.ACCESS
  );
  const formLink = `${config.form}?token=${formToken}`;
  const subject = "Information Needed — Pending Payout";
  payoutEmail.querySelector("#name").set_content(payout.name);
  payoutEmail.querySelector(
    "#form"
  ).innerHTML = `<a href=${formLink} target="_blank">this form</a>`;
  await sendEmail(sendTo, subject, payoutEmail.toString());
};

/**
 * Send an Information Gathered email
 * @param {string} pId
 */
const sendConfirmedEmail = async (pId) => {
  const payout = await payoutService.getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }

  const invoiceEmailTemplate = await templateService.getTemplateById(
    "invoiceEmailTemplate"
  );
  if (!invoiceEmailTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, "invoiceEmailTemplate not found");
  }

  const subject = "Information Gathered — Payout In Queue";
  var invoiceEmail = HTMLParser.parse(invoiceEmailTemplate.text);
  invoiceEmail.querySelector("#name").set_content(payout.name);

  const invoice = await invoiceService.generateInvoice(payout);
  await sendEmailWithAttachments(
    payout.email,
    subject,
    invoiceEmail.toString(),
    invoice
  );

  const filledEmailTemplate = await templateService.getTemplateById(
    "filledEmailTemplate"
  );
  if (!filledEmailTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, "filledEmailTemplate not found");
  }

  const subjectForSupport = `Form Filled — Pay ${payout.name.toUpperCase()} Now`;
  var fillEmail = HTMLParser.parse(filledEmailTemplate.text);
  await sendEmailWithAttachments(
    "info@fundedtradingplus.com",
    subjectForSupport,
    fillEmail.toString(),
    invoice
  );
};

/**
 * Send an Crypto Fund email to user
 * @param {string} pId
 */
const sendCryptoPaymentEmail = async (pId) => {
  const payout = await payoutService.getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }

  const payoutEmailTemplate = await templateService.getTemplateById(
    "cryptoEmailTemplate"
  );
  if (!payoutEmailTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, "cryptoEmailTemplate not found");
  }
  var payoutEmail = HTMLParser.parse(payoutEmailTemplate.text);

  const subject = "Information Gathered — Payout Sent";
  payoutEmail.querySelector("#name").set_content(payout.name);
  payoutEmail.querySelector("#amount").textContent = formatMoney(payout.amount);
  await sendEmail(payout.email, subject, payoutEmail.toString());
};

/**
 * Send an email when users click 'finialize'
 * @param {string} pId
 */
const sendFinalizedEmail = async (pId) => {
  const payout = await payoutService.getPayoutById(pId);
  if (!payout) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payout not found");
  }

  const payoutEmailTemplate = await templateService.getTemplateById(
    "finalizedEmailTemplate"
  );
  if (!payoutEmailTemplate) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "finalizedEmailTemplate not found"
    );
  }
  var payoutEmail = HTMLParser.parse(payoutEmailTemplate.text);

  const subject = "Information Gathered — Payout Sent";
  payoutEmail.querySelector("#name").set_content(payout.name);
  payoutEmail.querySelector("#amount").textContent = formatMoney(payout.amount);
  await sendEmail(payout.email, subject, payoutEmail.toString());
};

/**
 * Send an information email in ClientPage
 * @param {string} to
 * @param {string} templateId
 * @param {string} variables
 */
const sendInformationEmail = async (to, templateId, variables) => {
  const subject = "Important Account Notification — FTP London Ltd.";
  const EmailTemplate = await templateService.getTemplateById(templateId);
  if (!EmailTemplate) {
    throw new ApiError(httpStatus.NOT_FOUND, "EmailTemplate not found");
  }
  var payoutEmail = HTMLParser.parse(EmailTemplate.text);
  var fields = EmailTemplate.variables;

  if (variables != "") {
    const variableArray = variables.split(",");
    fields.map((item, key) => {
      payoutEmail.querySelector(`#${item}`).set_content(variableArray[key]);
    });
  }

  await sendEmail(to, subject, payoutEmail.toString());
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (sendTo, subject, htmlContent) => {
  const msg = {
    to: sendTo,
    from: {
      email: config.email.from,
      name: "Funded Trading Plus",
    },
    subject: subject,
    html: htmlContent,
  };
  sgMail
    .send(msg)
    .then((response) => {
      logger.info(response[0].statusCode);
    })
    .catch((error) => {
      logger.error(error);
    });

  overviewService.updateOverviewEmails(sendTo, {
    to: [sendTo],
    cc: [],
    from: {
      email: config.email.from,
      name: "Funded Trading Plus",
    },
    subject: subject,
    html: htmlContent,
    timeAdded: Math.floor(Date.now() / 1000),
  });
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} attachment
 * @returns {Promise}
 */
const sendEmailWithAttachments = async (
  sendTo,
  subject,
  htmlContent,
  attachment
) => {
  const msg = {
    to: sendTo,
    from: {
      email: config.email.from,
      name: "Funded Trading Plus",
    },
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        content: attachment,
        filename: "invoice.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };
  sgMail
    .send(msg)
    .then((response) => {
      logger.info(response[0].statusCode);
    })
    .catch((error) => {
      logger.error(error);
    });

  overviewService.updateOverviewEmails(sendTo, {
    to: [sendTo],
    cc: [],
    from: {
      email: config.email.from,
      name: "Funded Trading Plus",
    },
    subject: subject,
    html: htmlContent,
    timeAdded: Math.floor(Date.now() / 1000),
  });
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/change-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendCryptoPaymentEmail,
  sendFinalizedEmail,
  sendPendingEmail,
  sendConfirmedEmail,
  sendInformationEmail,
};
