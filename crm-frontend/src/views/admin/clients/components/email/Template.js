// Chakra imports
import {
  Button,
  Select,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import validator from "validator";
import { toast } from "react-toastify";
import { ALERT_MESSAGE } from "variables/message";
import { useEffect, useState } from "react";

export default function Template(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const { preStep, nextStep, setPrePage, templates, formData, setFormData } = props;
  const [filteredTemplates, setFilteredTemplates] = useState({});

  const toNext = () => {
    if (validator.isEmpty(formData.templateId)) {
      toast.error(ALERT_MESSAGE.OPERATION_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      setPrePage("next");
      nextStep();
    }
  };

  useEffect(() => {
    setFilteredTemplates(
      templates.filter((item) => item.group == formData.group)
    );
  }, []);

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
          Template Selector
        </Text>

        <Select
          mt="15px"
          id="user_type"
          placeholder="Please Select Email Template"
          onChange={(e) =>
            setFormData({ ...formData, templateId: e.target.value })
          }
          value={formData.templateId}
        >
          {filteredTemplates?.length > 0 &&
            filteredTemplates.map((item) => {
              return <option value={item.id}>{item.friendlyName}</option>;
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
