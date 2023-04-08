import Card from "components/card/Card.js";
import useCollapse from "react-collapsed";
import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

function CollapsibleCard(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const { title, variant, children, ...rest } = props;
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <Card {...rest}>
      <Flex px="25px" justify="space-between" align="center"  {...getToggleProps()}>
        <Text
          color={textColor}
          fontSize="18px"
          fontWeight="700"
          lineHeight="100%"
        >
          {title}
        </Text>

        <Icon
          as={isExpanded ? MdOutlineExpandLess : MdOutlineExpandMore}
          color="white"
          h="30px"
          w="30px"
         
        ></Icon>
      </Flex>

      <div {...getCollapseProps()}>{children}</div>
    </Card>
  );
}

export default CollapsibleCard;
