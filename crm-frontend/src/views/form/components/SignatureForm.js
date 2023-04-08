// Chakra imports
import {
  Button,
  Text,
  InputGroup,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import validator from "validator";
import { toast } from "react-toastify";
import { accountTypes, bankTypes } from "../constant";
import { Client, API_URL } from "api/axios";
import { ALERT_MESSAGE } from "variables/message";
import short from 'short-uuid';

export default function SignatureForm(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  const { preStep, pre2Step, nextStep, formData, setFormData } = props;
  const [isloading, SetIsLoading] = useState(false)
  const translator = short(); 

  var sigPad = {};
  var trimmedDataURL

  const toBack = () => {
    if (
      validator.equals(formData.accountType, accountTypes.CRYPTOCURRENCY_WALLET)
    ) {
      pre2Step();
    } else {
      preStep();
    }
  };

  const toNext = () => {
    SetIsLoading(true)
    trimmedDataURL = sigPad.getTrimmedCanvas().toDataURL("image/png");
    if (sigPad.isEmpty()) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUIRE_SIGN, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setFormData({
        ...formData,
        signature: trimmedDataURL,
      });
      updatePayout();
    }
  };

  const updatePayout = async () => {
    try {
      const bankInf = bankTypes.find((obj) => {
        return obj.code === formData.country;
      });

      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/form/?token=${localStorage.getItem('pToken')}`,
        JSON.stringify({
          invoice: translator.generate(),
          payoutMethod: formData.accountType === accountTypes.CRYPTOCURRENCY_WALLET ? "cryptocurrency" : "bank",
          payoutDetails: [{type: bankInf?.requirements[0], value: formData?.routingNumber}, {type: bankInf?.requirements[1], value: formData?.accountNumber}],
          paidDate: new Date().toLocaleDateString("en-US"),
          // New Fields...
          accountType: formData.accountType,
          personalDetails: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: {
              street: formData.street,
              city: formData.city,
              region: formData.region,
              country: formData.country,
              zip: formData.zipCode
            },
            signature: trimmedDataURL
          },

        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_INFORMATION_FILLING_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        nextStep();
      }
    } catch (err) {
      console.log(err)
      toast.error(ALERT_MESSAGE.PAYOUT_FILLLING_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <Flex
      maxW={{ base: "100%", md: "max-content" }}
      w="100%"
      mx={{ base: "auto" }}
      me="auto"
      h="100%"
      alignItems="start"
      justifyContent="center"
      mb={{ base: "30px", md: "60px" }}
      px={{ base: "25px", md: "0px" }}
      mt={{ base: "30px", md: "10vh" }}
      flexDirection="column"
    >
      <Card mb={{ base: "0px", lg: "20px" }} align="center">
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="lg"
          align="center"
          width={{ sm: "auto", md: "500px", lg: "800px" }}
        >
          Payout Information Form
        </Text>
        <Text
          mt="20px"
          mb="20px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
          width={{ sm: "auto", md: "500px", lg: "800px" }}
        >
          By signing below, you agree that the information here is correct and
          any typographical errors may result in your payout being delayed or
          lost.
        </Text>

        <InputGroup w={{ base: "100%" }} mt="10px">
          <SignatureCanvas
            penColor="white"
            canvasProps={{ className: "sigCanvas" }}
            ref={(ref) => {
              sigPad = ref;
            }}
          />
        </InputGroup>

        <Button
          fontSize="md"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={toNext}
          disabled={isloading}
        >
          Submit
        </Button>
        <Button
          fontSize="md"
          variant="ghost"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={toBack}
        >
          Back
        </Button>
      </Card>
    </Flex>
  );
}
