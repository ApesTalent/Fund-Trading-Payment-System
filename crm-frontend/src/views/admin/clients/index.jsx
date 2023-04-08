// Chakra imports
import { Box, useDisclosure } from "@chakra-ui/react";

import ClientDetail from "./components/dashboard/ClientDetail";
import ClientDashboard from "./components/dashboard/ClientDashboard";

import { useState, useEffect } from "react";
import { Client, API_URL } from "api/axios";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";
import EmailForm from "./components/email/EmailForm";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export default function Overview() {
  const viewClient = () => {
    setShowDetail(true);
  };

  const viewEmail = async (clientId) => {
    await getClient(clientId);
    emailOnOpen();
  };

  const getClient = async (clientId) => {
    try {
      const client = Client(true);
      const response = await client.get(`${API_URL}/client/${clientId}`);
      setClientObj(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const {
    isOpen: emailIsOpen,
    onOpen: emailOnOpen,
    onClose: emailOnClose,
  } = useDisclosure();

  const [clientObj, setClientObj] = useState({});

  const [showDetail, setShowDetail] = useState(false);
  const [clients, setClients] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    Emitter.on(eventTypes.SEARCH_QUERY_UPDATE, async (searchStr) => {
      if (searchStr) {
        const client = Client(true);
        const response = await client.get(
          `${API_URL}/client?name=${searchStr}`
        );
        setClients(response.data);
      } else {
        getClients();
      }
    });
  }, []);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    try {
      const client = Client(true);
      const response = await client.get(`${API_URL}/client?limit=20`);
      setClients(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      {!showDetail && (
        <ClientDashboard
          clients={clients}
          viewClient={viewClient}
          viewEmail={viewEmail}
          setId={setId}
        />
      )}
      {showDetail && <ClientDetail id={id} toBack={setShowDetail} />}

      <Modal isOpen={emailIsOpen} onClose={emailOnClose}>
        <ModalOverlay />
        <ModalContent
          maxW="900px"
          maxH="1080px"
          style={{ backgroundColor: "#111C44" }}
        >
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody
            className="email-modal"
            overflowY={{ base: "auto" }}
          >
            <div>
            <EmailForm
              name={clientObj.name}
              email={clientObj.email}
              accounts={clientObj.accounts}
            />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
