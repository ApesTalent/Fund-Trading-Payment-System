// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Icon,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { MdOutlineEmail, MdRemoveRedEye } from "react-icons/md";
import banner from "assets/img/auth/banner.png";

export default function Banner(props) {
  const { id, name, viewClient, setId, viewEmail, accounts } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const viewClientInformation = () => {
    setId(id)
    viewClient();
  }

  const viewEmailInformation = () => {
    viewEmail(id);
  }

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        name={name}
        h="87px"
        w="87px"
        mt="-43px"
        bg="#11047A"
        color="white"
        border="2px solid"
        borderColor={borderColor}
      />
      
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {id}
      </Text>
      <Flex
        w="max-content"
        mx="auto"
        mt="26px"
        gap={{
          base: "10px",
          md: "10px",
          lg: "10px",
          xl: "10px",
          "2xl": "10px",
        }}
      >
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="10px"
          px={{
            base: "24px",
            md: "24px",
            lg: "18px",
            xl: "18px",
            "2xl": "48px",
          }}
          py="5px"
          onClick={viewClientInformation}
        >
          <Icon as={MdRemoveRedEye} color="white" w={4} h={7} me="5px"/>
          View
        </Button>

        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="10px"
          px={{
            base: "24px",
            md: "24px",
            lg: "18px",
            xl: "18px",
            "2xl": "48px",
          }}
          py="5px"
          onClick={viewEmailInformation}
        >
          <Icon as={MdOutlineEmail} color="white" w={4} h={7} me="5px" />
          Email
        </Button>
      </Flex>
    </Card>
  );
}
