// Chakra imports
import { Text, Flex } from "@chakra-ui/react";
import Card from "components/card/Card.js";

export default function SignatureForm(props) {
  // Chakra Color Mode

  const textColorSecondary = "gray.400";
  
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
          mt="20px"
          mb="20px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
          width={{ sm: "auto", md: "500px", lg: "800px" }}
        >
          We have received all the information needed at this time. Please
          monitor your email for updates.
        </Text>
      </Card>
    </Flex>
  );
}
