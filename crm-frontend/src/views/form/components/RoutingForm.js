// Chakra imports
import {
  Button, Text,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Flex
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import validator from "validator";
import { toast } from "react-toastify";
import { MdTag } from "react-icons/md";
import { bankTypes } from "../constant";
import { ALERT_MESSAGE } from "variables/message";

export default function RoutingForm(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const IconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  const textColorSecondary = "gray.400";

  const {preStep, nextStep, formData, setFormData} = props
  const toNext = () => {
    if (validator.isEmpty(formData.routingNumber) || validator.isEmpty(formData.accountNumber))  {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUIRE_INFORMATION, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      nextStep();
    }
  }

  const bankInf = bankTypes.find(obj => {
    return obj.code === formData.country
  })

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
          These details are provided by your bank and can  usually be found on
          your monthly statement. If you are unable to locate them, please reach
          out to your bank as we can not help. Ensure that they are accurately
          entered.
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
                icon={<MdTag color={IconColor} w="15px" h="15px" />}
              ></IconButton>
            }
          />
          <Input
            variant="text"
            fontSize="sm"
            type="text"
            bg={inputBg}
            color={inputText}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"10px"}
            placeholder={bankInf.requirements[0]}
            onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
            value={formData.routingNumber}
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
                icon={<MdTag color={IconColor} w="15px" h="15px" />}
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
            placeholder={bankInf.requirements[1]}
            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
            value={formData.accountNumber}
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
