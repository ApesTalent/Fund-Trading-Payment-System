import {
  Avatar,
  Button,
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import { MdArrowBack } from "react-icons/md";

// Custom components
import { formatter } from "variables/utils";

function Profile(props) {
  const { client, toBack } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const gotoDash = () => {
    toBack(false);
  };

  const removeDuplicatedOrders = (arr) => {
    const seen = new Set();
    const filteredAccounts = arr.filter((el) => {
      const duplicate = seen.has(el?.order?.number);
      seen.add(el?.order?.number);
      return !duplicate;
    });
    return filteredAccounts;
  };

  //http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Icon
        as={MdArrowBack}
        w="30px"
        h="30px"
        color="white"
        onClick={() => gotoDash()}
        cursor="pointer"
      />
      <Avatar
        mx="auto"
        mt="10px"
        name={client.name}
        h="87px"
        w="87px"
        bg="#11047A"
        color="white"
        border="2px solid"
        borderColor={borderColor}
      />

      <Flex Flex direction={{ base: "row" }} justify="center">
        <Image
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
            client.address?.country || client.address?.contry
          }.svg`}
          mt="-30px"
          me="-50px"
          w="40px"
          h="40px"
          zIndex={0}
        />
      </Flex>
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {client.name}
      </Text>
      <Text color={textColorSecondary} fontSize="md">
        {client.id}
      </Text>
      <Flex
        w="max-content"
        mx="auto"
        mt="26px"
        mb="20px"
        direction={{
          base: "row",
          lg: "row",
          md: "row",
          sm: "column",
        }}
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
          {client.accounts?.length > 0
            ? client.accounts.filter(function (item) {
                return item.breached;
              }).length
            : 0}{" "}
          Breached Account(s)
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
          {client.accounts?.length > 0
            ? client.accounts.filter(function (item) {
                return item.passed;
              }).length
            : 0}{" "}
          Passed Account(s)
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
          {formatter.format(
            client.accounts?.length > 0
              ? removeDuplicatedOrders(client.accounts).reduce((acc, val) => {
                  return acc + val?.order?.total;
                }, 0)
              : 0
          )} {" "}
          Spent on Accounts
        </Button>
      </Flex>
    </Card>
  );
}

export default Profile;
