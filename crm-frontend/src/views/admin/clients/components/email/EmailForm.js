import Group from "./Group";
import Template from "./Template";
import Variable from "./Variable";
import Preview from "./Preview";
import { Box } from "@chakra-ui/react";
import { Client, API_URL } from "api/axios";
import { toast } from "react-toastify";
import { ALERT_MESSAGE } from "variables/message";
import { useEffect, useState } from "react";

export default function EmailForm(props) {
  const { name, accounts, email } = props;

  const [formData, setFormData] = useState({
    name: name,
    email: email,
    group: "",
    templateId: "",
    templateName: "",
    text: "",
    fields: [],
    variables: [],
  });

  const [templates, setTemplates] = useState([]);
  const [groups, setGroups] = useState([]);

  const [page, setPage] = useState(0);
  const [prePage, setPrePage] = useState(0);

  const getTemplateInformation = async () => {
    try {
      const client = Client(true);
      const response = await client.get(`${API_URL}/template`);
      if (response.status === 200) {
        setTemplates(response.data.results);
        setGroups(
          response.data.results
            .map((v) => v.group)
            .filter((item, i, ar) => ar.indexOf(item) === i)
        );
      } else {
        toast.error(ALERT_MESSAGE.OPERATION_FAIL, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.OPERATION_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    getTemplateInformation();
  }, []);

  const preStep = () => {
    setPage(page - 1);
  };

  const nextStep = () => {
    setPage(page + 1);
  };

  const conditionalComponent = () => {
    switch (page) {
      case 0:
        return (
          <Group
            nextStep={nextStep}
            groups={groups}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 1:
        return (
          <Template
            nextStep={nextStep}
            preStep={preStep}
            setPrePage={setPrePage}
            templates={templates}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <Variable
            nextStep={nextStep}
            preStep={preStep}
            prePage={prePage}
            accounts={accounts}
            templates={templates}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <Preview
            nextStep={nextStep}
            preStep={preStep}
            setPrePage={setPrePage}
            templates={templates}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return (
          <GroupForm
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        );
    }
  };

  return (
    <Box>
      {conditionalComponent()}
    </Box>
  );
}
