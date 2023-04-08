// Chakra imports
import {
  Button,
  Text,
  useColorModeValue,
  Flex,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

import Card from "components/card/Card.js";
import { capitalizeFirstLetter } from "variables/utils";
import { useEffect, useState } from "react";

export default function Variable(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColor = useColorModeValue("navy.700", "white");
  const {
    preStep,
    nextStep,
    prePage,
    accounts,
    templates,
    formData,
    setFormData,
  } = props;
  const toNext = () => {
    nextStep();
  };

  const selectedOne = templates.filter(
    (item) => item.id == formData.templateId
  );

  const fields = selectedOne[0].variables;
  const text = selectedOne[0].text;
  const templateName = selectedOne[0].friendlyName;

  useEffect(() => {
    if (fields.length < 1) {
      if (prePage == "next") nextStep();
      else preStep();
    }
  }, [fields]);

  useEffect(() => {
    setFormData({
      ...formData,
      fields: fields,
      text: text,
      templateName: templateName,
    });
    initName();
  }, []);

  const updateVariable = (key, value) => {
    let values = [...formData.variables];
    values[key] = value;
    setFormData({
      ...formData,
      variables: values,
      fields: fields,
      text: text,
      templateName: templateName,
    });
  };

  const initName = () => {
    const index = fields.indexOf("name");
    if (index < 0) return;
    else updateVariable(index, formData.name);
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
          fontSize="xl"
          align="center"
          mb="30px"
          mt="10px"
          width={{ sm: "auto", md: "500px", lg: "800px" }}
        >
          Please input variables for template.
        </Text>

        {fields?.length > 0 &&
          fields.map((item, key) => {
            return (
              <>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  {capitalizeFirstLetter(item)}
                </FormLabel>
                {item == "account" ? (
                  <Select
                    variant="auth"
                    fontSize="md"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    placeholder="Select the trading Account"
                    onChange={(e) => updateVariable(key, e.target.value)}
                  >
                    {accounts?.length > 0 &&
                      accounts.map((item) => {
                        return <option value={item.login}>{item.login}</option>;
                      })}
                  </Select>
                ) : (
                  <Input
                    disabled={item == "name" || item == "sender" ? true : false}
                    defaultValue={
                      item == "name"
                        ? formData.name
                        : item == "sender"
                        ? formData.email
                        : ""
                    }
                    variant="auth"
                    fontSize="md"
                    ms={{ base: "0px", md: "0px" }}
                    type="text"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    onChange={(e) => updateVariable(key, e.target.value)}
                  />
                )}
              </>
            );
          })}

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
