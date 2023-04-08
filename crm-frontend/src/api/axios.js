import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

export const Client = (auth = false) => {
  const defaultOptions = {
    headers: auth
      ? {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("user"))?.accessToken?.token,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        },
  };

  const invoiceOptions = {
    headers: {
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user"))?.accessToken?.token,
      responseType: "blob",
      "Content-Type": "application/json",
    },
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) =>
      axios.put(url, data, { ...defaultOptions, ...options }),
    patch: (url, data, options = {}) =>
      axios.patch(url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) =>
      axios.delete(url, { ...defaultOptions, ...options }),
    getInvoice: (url, options = {}) =>
      axios.get(url, { ...invoiceOptions, ...options }),
  };
};
