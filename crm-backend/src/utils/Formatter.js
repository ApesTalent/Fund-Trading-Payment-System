const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatMoney = (amount) => {
  try {
    amount = amount.replace(/,/g, "");
    return Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  formatter, formatMoney
}