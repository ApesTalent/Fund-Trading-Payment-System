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

import { MdOutlineEmail, MdCardTravel, MdAttachMoney } from "react-icons/md";

export default function StartForm(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const IconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const { nextStep, formData } = props;

  const toNext = () => {
    if (
      validator.isEmpty(formData.name) ||
      validator.isEmpty(formData.email) ||
      validator.isEmpty(formData.amount)
    ) {
      console.log("Invalid Payout information");
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
            disabled
            variant="search"
            fontSize="sm"
            type="text"
            bg={inputBg}
            color={inputText}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"10px"}
            placeholder={"Payee's Legal Name"}
            value={formData.name}
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
            disabled
            variant="search"
            fontSize="sm"
            type="email"
            bg={inputBg}
            color={inputText}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"10px"}
            placeholder={"Payee's Email Address"}
            value={formData.email}
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
            disabled
            variant="search"
            fontSize="sm"
            type="text"
            bg={inputBg}
            color={inputText}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"10px"}
            placeholder={"0.00"}
            value={formData.amount}
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
      </Card>
    </Flex>
  );
}
