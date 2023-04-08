import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Text, Image } from "@chakra-ui/react";
import logoWhite from "assets/img/profile/logoWhite.webp";
// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Flex align="center" direction="column">
      <Image src={logoWhite} mb="10px" />

      <HSeparator mb="10px" />
    </Flex>
  );
}

export default SidebarBrand;
