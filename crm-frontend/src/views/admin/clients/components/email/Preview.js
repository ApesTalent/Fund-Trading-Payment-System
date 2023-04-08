// Chakra imports
import { Button, Text, useColorModeValue, Flex } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { useEffect, useState } from "react";
import HTMLParser from "node-html-parser";
import { Client, API_URL } from "api/axios";
import { toast } from "react-toastify";
import { ALERT_MESSAGE } from "variables/message";

export default function Preview(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const { preStep, nextStep, formData, setPrePage } = props;
  const [previewContent, setPreviewContent] = useState("");
  const toPrev = () => {
    setPrePage("prev");
    preStep();
  };

  useEffect(() => {
    console.log(formData);
    var emailTemplate = HTMLParser.parse(formData.text);
    try {
      formData.fields?.length > 0 &&
        formData.fields.map((item, key) => {
          emailTemplate
            .querySelector(`#${item}`)
            .set_content(formData.variables[key]);
        });
    } catch (err) {
      console.log(err);
    }
    setPreviewContent(emailTemplate.toString());
  }, []);

  const sendEmail = async () => {
    try {
      const client = Client(true);
      const response = await client.post(
        `${API_URL}/client/sendEmail`,
        JSON.stringify({
          to: formData.email,
          templateId: formData.templateId,
          variables:
            formData.fields.length > 0 ? formData.variables.join(",") : "",
        })
      );
      if (response.status == 200) {
        toast.success(ALERT_MESSAGE.OPERATION_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(ALERT_MESSAGE.OPERATION_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
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
          fontSize="3xl"
          align="center"
          mb="20px"
          width={{ sm: "auto", md: "500px", lg: "800px" }}
        >
          {formData.templateName} Preview
        </Text>

        <div
          dangerouslySetInnerHTML={{ __html: previewContent }}
          style={{ width: "300px", marginBottom: "10px", marginLeft: "100px" }}
        />

        <Button
          fontSize="md"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={sendEmail}
        >
          Send Now
        </Button>
        <Button
          fontSize="md"
          variant="ghost"
          fontWeight="500"
          w="100%"
          h="50"
          mt="15px"
          onClick={toPrev}
        >
          Back
        </Button>
      </Card>
    </Flex>
  );
}
