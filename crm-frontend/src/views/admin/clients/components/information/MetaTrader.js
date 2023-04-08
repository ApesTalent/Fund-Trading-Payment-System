import {
    Avatar,
    Box,
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
  
  import Card from "components/card/Card.js";
  import { MdOutlineEmail, MdRemoveRedEye } from "react-icons/md";
  
  // Custom components
  import CollapsibleCard from "components/card/CollapsibleCard.js";
  
  function MetaTrader(props) {  
    // Chakra Color Mode
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "gray.400";
    const borderColor = useColorModeValue(
      "white !important",
      "#111C44 !important"
    );
  
    return (
      <CollapsibleCard title="Associated MetaTrader Accounts">
        <Card mb={{ base: "0px", lg: "20px" }} align="center">
         
        </Card>
      </CollapsibleCard>
    );
  }
  
  export default MetaTrader;
  