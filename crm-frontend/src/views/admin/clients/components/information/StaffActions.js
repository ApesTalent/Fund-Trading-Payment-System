import {
  Flex,
  useColorModeValue,
  Switch,
  FormLabel,
  Text,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import MaterialTable from "material-table";

import Card from "components/card/Card.js";
import { useState, useEffect } from "react";
import { Client, API_URL } from "api/axios";
import { ALERT_MESSAGE } from "variables/message";
import { forwardRef } from "react";
import { alpha } from "@material-ui/core/styles";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";

// Custom components
import CollapsibleCard from "components/card/CollapsibleCard.js";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

function StaffActions(props) {
  const { flags, id, data } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <></>),
  };

  const columns = [
    {
      field: "user",
      title: "User",
      editComponent: (props) => (
        <Text disabled={true} type="text" value={props.value} />
      ),
    },
    {
      field: "message",
      title: "Message",
    },
  ];

  const {
    isOpen: toogleIsOpen,
    onOpen: toogleOnOpen,
    onClose: toogleOnClose,
  } = useDisclosure();

  const [kycFound, setKycFound] = useState(false);
  const [contactFound, setContractFound] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setKycFound(flags?.kyc);
    setContractFound(flags?.contracted);
    setNotes(data.filter((item) => item.hidden == false));
  }, [flags, data]);

  const updateNotes = async (uNotes) => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/client/${id}`,
        JSON.stringify({
          notes: uNotes,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.CLIENT_FLAGS_UPDATE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.CLIENT_NOTES_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.CLIENT_FLAGS_UPDATE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const updateFlags = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/client/${id}`,
        JSON.stringify({
          flags: {
            kyc: kycFound,
            contracted: contactFound,
          },
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.CLIENT_FLAGS_UPDATE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.CLIENT_NOTES_UPDATE);
      }
    } catch (err) {
      console.log(err);
      toast.error(ALERT_MESSAGE.CLIENT_FLAGS_UPDATE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    toogleOnClose();
  };

  return (
    <CollapsibleCard title="Staff Actions">
      <Card mb={{ base: "0px", lg: "20px" }} ml="5px" align="center">
        <Flex
          w="100%"
          justify="left"
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
          <Switch
            isChecked={kycFound}
            variant="main"
            id="kycFound"
            colorScheme="brandScheme"
            size="md"
            onChange={async () => {
              setKycFound((preKyc) => !preKyc);
              toogleOnOpen();
            }}
          />

          <FormLabel
            htmlFor="kycFound"
            _hover={{ cursor: "pointer" }}
            direction="column"
            mt="-2px"
            maxW="100%"
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              "KYC" Found
            </Text>
          </FormLabel>

          <Switch
            isChecked={contactFound}
            variant="main"
            id="contactFound"
            ms="20px"
            colorScheme="brandScheme"
            size="md"
            onChange={async () => {
              setContractFound((preContract) => !preContract);
              toogleOnOpen();
            }}
          />

          <FormLabel
            htmlFor="contactFound"
            _hover={{ cursor: "pointer" }}
            direction="column"
            mt="-2px"
            maxW="100%"
          >
            <Text color={textColorPrimary} fontSize="md" fontWeight="500">
              Contract Found
            </Text>
          </FormLabel>
        </Flex>

        <MaterialTable
          columns={columns}
          data={notes}
          title=""
          icons={tableIcons}
          options={{
            headerStyle: {
              backgroundColor: "#111C44",
              color: "#A0AEC0",
            },
            rowStyle: {
              backgroundColor: "#111C44",
              color: "#FFF",
            },
            searchFieldStyle: {
              backgroundColor: "#111C44",
              color: "#FFF",
            },
            actionsColumnIndex: -1,
          }}
          editable={{
            isEditable: (rowData) => rowData.name === "User",
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  newData.timeAdded = Math.floor(Date.now() / 1000);
                  newData.hidden = false;
                  newData.user = JSON.parse(localStorage.getItem("user"))?.name;
                  const addedData = [...data, newData];
                  updateNotes(addedData);
                  resolve();
                }, 500);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...data];
                  const timeAdded = oldData.timeAdded;
                  const index = data.findIndex(
                    (item) => item.timeAdded === timeAdded
                  );
                  dataDelete[index].hidden = true;
                  updateNotes(dataDelete);
                  resolve();
                }, 500);
              }),
          }}
        />

        <AlertDialog isOpen={toogleIsOpen} onClose={toogleOnClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Toogle Staff Actions
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={toogleOnClose}>Cancel</Button>
                <Button colorScheme="linkedin" onClick={updateFlags} ml={3}>
                  Ok
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Card>
    </CollapsibleCard>
  );
}

export default StaffActions;
