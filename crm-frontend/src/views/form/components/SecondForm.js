// Chakra imports
import {
  Button,
  Select,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import validator from "validator";
import { toast } from "react-toastify";
import { accountTypes, purposeTypes } from "../constant";
import { ALERT_MESSAGE } from "variables/message";

export default function SecondForm(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const { preStep, nextStep, formData, setFormData } = props;
  const toNext = () => {
    if (validator.isEmpty(formData.accountType)) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUIRE_ACCOUNT_TYPE, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      nextStep();
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

        <Select
          mt="15px"
          id="user_type"
          placeholder="Account Type"
          onChange={(e) =>
            setFormData({ ...formData, accountType: e.target.value })
          }
          value={formData.accountType}
        >
          {purposeTypes.TRADER !== formData.purpose && (
            <option value={accountTypes.BANK_INDIVIDUAL}>
              Bank Owned by Individual
            </option>
          )}

          {purposeTypes.TRADER !== formData.purpose && (
            <option value={accountTypes.BANK_COMPANY}>
              Bank Owned by Company
            </option>
          )}

          <option value={accountTypes.CRYPTOCURRENCY_WALLET}>
            Cryptocurrency Wallet
          </option>
        </Select>

        <Button
          fontSize="md"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={toNext}
        >
          Next
        </Button>
        <Button
          fontSize="md"
          variant="ghost"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={preStep}
        >
          Back
        </Button>
      </Card>
    </Flex>
  );
}
