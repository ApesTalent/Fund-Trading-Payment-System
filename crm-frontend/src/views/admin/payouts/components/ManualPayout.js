// Chakra imports
import {
  Button,
  Select,
  Text,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import { useState } from "react";

import { MdOutlineEmail, MdCardTravel, MdAttachMoney } from "react-icons/md";
import { Client, API_URL } from "api/axios";
import { toast } from "react-toastify";
import { statusTypes, eventTypes } from "../constant";
import Emitter from "api/emitter";
import { ALERT_MESSAGE } from "variables/message";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

export default function ManualPayout(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const IconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");

  const {
    isOpen: acceptIsOpen,
    onOpen: acceptOnOpen,
    onClose: acceptOnClose,
  } = useDisclosure();

  const handleSend = async () => {
    try {
      const client = Client(true);
      const response = await client.post(
        `${API_URL}/payouts/`,
        JSON.stringify({
          name,
          email,
          amount: parseFloat(amount).toFixed(2).toString(),
          purpose,
          status: statusTypes.UNUSED,
          paidDate: new Date().toLocaleDateString("en-US"),
        })
      );
      if (response.status === 201) {
        toast.success(ALERT_MESSAGE.PAYOUT_MANUAL_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.CLIENT_PAYOUT_UPDATE);
        Emitter.emit(eventTypes.UNUSED_PAYOUT_UPDATE);
        sendInformationNeedEmail(response.data.id);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_MANUAL_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    acceptOnClose();
  };

  const sendInformationNeedEmail = async (id) => {
    try {
      const client = Client(true);
      await client.post(
        `${API_URL}/payouts/sendEmail`,
        JSON.stringify({
          to: email,
          pId: id,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="lg"
        align="left"
      >
        Start Manual Payout
      </Text>
      <InputGroup w={{ base: "100%" }} mt="15px">
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<MdCardTravel color={IconColor} w="15px" h="15px" />}
            ></IconButton>
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          type="text"
          bg={inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={"10px"}
          placeholder={"Payee's Legal Name"}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </InputGroup>

      <InputGroup w={{ base: "100%" }} mt="15px">
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<MdOutlineEmail color={IconColor} w="15px" h="15px" />}
            ></IconButton>
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          type="email"
          bg={inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={"10px"}
          placeholder={"Payee's Email Address"}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </InputGroup>

      <InputGroup w={{ base: "100%" }} mt="15px">
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<MdAttachMoney color={IconColor} w="15px" h="15px" />}
            ></IconButton>
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          type="number"
          bg={inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={"10px"}
          placeholder={"Dollar Amount"}
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </InputGroup>

      <Select
        mt="15px"
        id="user_type"
        placeholder="Payout Type"
        onChange={(e) => setPurpose(e.target.value)}
        value={purpose}
      >
        <option value="Trader Payout">Trader Payout</option>
        <option value="Affiliate Payout">Affiliate Payout</option>
        <option value="Support Staff Payout">Support Staff Payout</option>
        <option value="Technology Staff Payout">Technology Staff Payout</option>
        <option value="Management Staff Payout">Management Staff Payout</option>
      </Select>

      <Button
        fontSize="md"
        variant="brand"
        fontWeight="500"
        w="100px"
        h="50"
        mt="15px"
        onClick={acceptOnOpen}
      >
        Send
      </Button>

      <AlertDialog isOpen={acceptIsOpen} onClose={acceptOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Send Manual Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={acceptOnClose}>Cancel</Button>
              <Button colorScheme="linkedin" onClick={handleSend} ml={3}>
                Send
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
}
