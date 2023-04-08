const easyinvoice = require("easyinvoice");
const { bankTypes } = require("../config/bank")
/**
 * Generate Invoice based on payout
 * @param {Oject} payout
 */
const generateInvoice = async (payout) => {
  const bankInf = bankTypes.find(obj => {
    return obj.code === payout.personalDetails.address.country
  })
  var data = {
    images: {
      // The logo on top of your invoice
      logo: 'https://i.postimg.cc/26DcMN2b/logo.png',
      // The invoice background
    },

    client: {
      company: "Funded Trading Plus (FTP London Ltd.)",
      address: "7 Bell Yard",
      zip: "London WC2A 2JR",
      city: "UK",
    },

    // Your recipient
    sender: {
      company: payout.name,
      address: payout.personalDetails.address.street,
      zip: payout.personalDetails.address.city + ", " + payout.personalDetails.address.region + " " + payout.personalDetails.address.zip,
      city: payout.personalDetails.address.country,
    },

    information: {
      // Invoice number
      number: payout.invoice,
      // Invoice data
      date: payout.paidDate,
      // Invoice due date
      'due-date': payout.paidDate,
    },
    // The products you would like to see on your invoice
    // Total values are being calculated automatically
    products: [
      {
        quantity: 1,
        description: payout.purpose,
        'tax-rate': 0,
        price: payout.amount,
      },
    ],
    // The message you would like to display on the bottom of your invoice
    "bottom-notice":
        payout.payoutMethod === "cryptocurrency"
          ? "Please send a form to collect my cryptocurrency wallet details."
          : bankInf.requirements[0] + ": " + payout.payoutDetails[0].value + " | " + bankInf.requirements[1] + ": " + payout.payoutDetails[1].value,
    // Settings to customize your invoice
    settings: {
      currency: 'USD', // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
    },
  };
  const result = await easyinvoice.createInvoice(data);
  return result.pdf.toString('base64');
};

module.exports = {
  generateInvoice,
};
