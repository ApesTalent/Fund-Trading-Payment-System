import {
  Button,
  Flex, Text,
  useColorModeValue
} from "@chakra-ui/react";

import Card from "components/card/Card.js";

// Custom components
import CollapsibleCard from "components/card/CollapsibleCard.js";

function PersonInf(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const { client } = props;

  return (
    <CollapsibleCard title="Personal Information">
      <Card mb={{ base: "0px", lg: "20px" }} ml="5px" align="left">
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="md"
          mt="10px"
        >
          Email
        </Text>
        <Text color={textColorSecondary} fontSize="md">
          {client.email}
        </Text>

        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="md"
          mt="10px"
        >
          Address
        </Text>
        <Text color={textColorSecondary} fontSize="md">
          {client?.address?.one}, {client?.address?.city},{" "}
          {client?.address?.region}, {client.address?.country || client.address?.contry} {client?.address?.code}
        </Text>

        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="md"
          mt="10px"
        >
          Tags
        </Text>

        <Flex
          w="max-content"
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
          >
            {!client?.flags?.kyc ? '"KYC" Not Found' : '"KYC" Found'}
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
          >
            {!client?.flags?.contracted
              ? "Contract Not Found"
              : "Contract Found"}
          </Button>
        </Flex>
      </Card>
    </CollapsibleCard>
  );
}

export default PersonInf;
