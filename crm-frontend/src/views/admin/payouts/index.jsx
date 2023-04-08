// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import ManualPayout from "views/admin/payouts/components/ManualPayout";
import ClientPayout from "views/admin/payouts/components/ClientPayout";
import FormsAwaiting from "views/admin/payouts/components/FormsAwaiting";
import UnusedPayout from "views/admin/payouts/components/UnusedPayout";
import PayoutHistory from "views/admin/payouts/components/PayoutHistory";

import { strDivider } from "./constant";

import React from "react";
import { useEffect, useState } from "react";
import { Client, API_URL } from "api/axios";
import { statusTypes, eventTypes } from "./constant";
import Emitter from "api/emitter";

export default function Overview() {
  const [clientPayouts, setClientPayouts] = useState([]);
  const [awaitingPayments, setAwaitingPayments] = useState([]);
  const [unusedPayout, setUnusedPayout] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const limit = 1000000;

  function compare(a, b) {
    if (a.paidDate < b.paidDate) {
      return -1;
    }
    
    if (a.paidDate === b.paidDate) {
      if (a._id > b._id) return 1;
      else return -1;
    }

    if (a.paidDate > b.paidDate) {
      return 1;
    }
    return 0;
  }

  function reverseCompare(a, b) {
    if (a.paidDate > b.paidDate) {
      return -1;
    }

    if (a.paidDate === b.paidDate) {
      if (a._id < b._id) return 1;
      else return -1;
    }

    if (a.paidDate < b.paidDate) {
      return 1;
    }
    return 0;
  }

  const getClientPayouts = async () => {
    try {
      const client = Client(true);
      const response = await client.get(
        `${API_URL}/payouts?status=${statusTypes.REQUEST}&limit=${limit}`
      );
      const newPayouts = response.data.results.map((v) => ({
        ...v,
        payee: v.name + strDivider + v.email,
      }));
      newPayouts.sort(compare);
      setClientPayouts(newPayouts);
    } catch (err) {
      console.log(err);
    }
  };

  const getAwaitingPayment = async () => {
    try {
      const client = Client(true);
      const response = await client.get(
        `${API_URL}/payouts?status=${statusTypes.AWAITING_PAYMENT}&limit=${limit}`
      );
      const newPayments = response.data.results.map((v) => ({
        ...v,
        payee: v.name + strDivider + v.email,
        amount: v.amount + strDivider + v.payoutMethod,
      }));
      newPayments.sort(compare);
      setAwaitingPayments(newPayments);
    } catch (err) {
      console.log(err);
    }
  };

  const getUnusedPayout = async () => {
    try {
      const client = Client(true);
      const response = await client.get(
        `${API_URL}/payouts?status=${statusTypes.UNUSED}&limit=${limit}`
      );
      const newPayouts = response.data.results.map((v) => ({
        ...v,
        payee: v.name + strDivider + v.email,
      }));
      newPayouts.sort(compare);
      setUnusedPayout(newPayouts);
    } catch (err) {
      console.log(err);
    }
  };

  const getPayoutHistory = async () => {
    try {
      const client = Client(true);
      const paidRes = await client.get(
        `${API_URL}/payouts?status=${statusTypes.PAID}&limit=${limit}`
      );
      let paidHistory = paidRes.data.results.map((v) => ({
        ...v,
        payee: v.name + strDivider + v.email,
      }));

      const finalizedRes = await client.get(
        `${API_URL}/payouts?status=${statusTypes.FINALIZED}&limit=${limit}`
      );

      let finalizedHistory = finalizedRes.data.results.map((v) => ({
        ...v,
        payee: v.name + strDivider + v.email,
      }));

      Array.prototype.push.apply(paidHistory, finalizedHistory);
      paidHistory.sort(reverseCompare);
      setPayoutHistory(paidHistory);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getClientPayouts();
    getAwaitingPayment();
    getUnusedPayout();
    getPayoutHistory();
  }, []);

  useEffect(() => {
    Emitter.on(eventTypes.CLIENT_PAYOUT_UPDATE, () => getClientPayouts());
    Emitter.on(eventTypes.AWAITING_PAYMENT_UPDATE, () => getAwaitingPayment());
    Emitter.on(eventTypes.UNUSED_PAYOUT_UPDATE, () => getUnusedPayout());
    Emitter.on(eventTypes.PAYOUT_HISTORY_UPDATE, () => getPayoutHistory());
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid templateColumns="repeat(1, 1fr)" gap={{ base: "20px", xl: "20px" }}>
        <ManualPayout />
        <ClientPayout tableData={clientPayouts} />
        <FormsAwaiting tableData={awaitingPayments} />
        <UnusedPayout tableData={unusedPayout} />
        <PayoutHistory tableData={payoutHistory} />
      </Grid>
    </Box>
  );
}
