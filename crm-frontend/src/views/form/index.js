// Chakra imports
import { Box } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import StartForm from "./components/StartForm";
import SecondForm from "./components/SecondForm";
import ThirdForm from "./components/ThirdForm";
import RoutingForm from "./components/RoutingForm";
import SignatureForm from "./components/SignatureForm";
import SuccessForm from "./components/SuccessForm";

import { Client, API_URL } from "api/axios";
import { toast } from "react-toastify";
import { ALERT_MESSAGE } from "variables/message";

export default function Form(props) {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    amount: "",
    accountType: "",
    status: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    region: "",
    zipCode: "",
    country: "",
    routingNumber: "",
    accountNumber: "",
    signature: null,
  });

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const token = query.get("token");
  localStorage.setItem('pToken', token);

  const getPayoutInformation = async () => {
    try {
      const client = Client();
      const response = await client.get(`${API_URL}/form?token=${token}`);
      if (response.status === 200) {
        setFormData({
          ...formData,
          name: response.data.name,
          email: response.data.email,
          amount: response.data.amount,
          purpose: response.data.purpose,
          status: response.data.status,
        });
      } else {
        toast.error(ALERT_MESSAGE.PAYOUT_LOADING_FAIL, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_LOADING_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    getPayoutInformation();
  }, []);

  const preStep = () => {
    setPage(page - 1);
  };

  const nextStep = () => {
    setPage(page + 1);
  };

  const pre2Step = () => {
    setPage(page - 2);
  };

  const next2Step = () => {
    setPage(page + 2);
  };

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return (
          <StartForm
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 1:
        return (
          <SecondForm
            nextStep={nextStep}
            preStep={preStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <ThirdForm
            nextStep={nextStep}
            preStep={preStep}
            next2Step={next2Step}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <RoutingForm
            nextStep={nextStep}
            preStep={preStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <SignatureForm
            nextStep={nextStep}
            preStep={preStep}
            pre2Step={pre2Step}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return <SuccessForm formData={formData} />;
      default:
        return (
          <StartForm
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {conditionalComponent()}
    </Box>
  );
}
