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
import { ALERT_MESSAGE } from "variables/message";

export default function Group(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const { groups, nextStep, formData, setFormData } = props;
  const toNext = () => {
    if (validator.isEmpty(formData.group)) {
      toast.error(ALERT_MESSAGE.OPERATION_FAIL, {
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
          Group Selector
        </Text>

        <Select
          mt="15px"
          id="user_type"
          placeholder="Please Select Group Type"
          onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          value={formData.group}
        >
          {groups.map((item, key) => {
            return <option value={item} key={key}>{item}</option>;
          })}
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
      </Card>
    </Flex>
  );
}
