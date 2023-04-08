import {
  Flex,
  Table,
  Button,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"; // Assets
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import { strDivider } from "../constant";

import { columnsDataFormAwaiting } from "views/admin/dataTables/variables/columnsData";
import CollapsibleCard from "components/card/CollapsibleCard.js";
import easyinvoice from "easyinvoice";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Client, API_URL } from "api/axios";
import { bankTypes } from "views/form/constant";
import { toast } from "react-toastify";
import Emitter from "api/emitter";
import { eventTypes, statusTypes } from "../constant";
import { ALERT_MESSAGE } from "variables/message";
import { formatter } from "variables/utils";

function FormsAwaiting(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [pid, setPid] = useState();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [region, setRegion] = useState();
  const [country, setCountry] = useState();
  const [zipCode, setZipCode] = useState();
  const [bankRouting, setBankRouting] = useState({});
  const [bankAccouting, setBankAccouting] = useState({});
  const [invoice, setInVoice] = useState();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

  const {
    isOpen: cryptoIsOpen,
    onOpen: cryptoOnOpen,
    onClose: cryptoOnClose,
  } = useDisclosure();

  const {
    isOpen: bankIsOpen,
    onOpen: bankOnOpen,
    onClose: bankOnClose,
  } = useDisclosure();

  const {
    isOpen: invoiceIsOpen,
    onOpen: invoiceOnOpen,
    onClose: invoiceOnClose,
  } = useDisclosure();

  const { tableData } = props;
  const columns = useMemo(
    () => columnsDataFormAwaiting,
    [columnsDataFormAwaiting]
  );
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 100;

  const sendOnOpen = async (payout) => {
    setBankRouting(payout.payoutDetails[0]);
    setBankAccouting(payout.payoutDetails[1]);

    setName(payout.name);
    setAddress(payout.personalDetails.address.street);
    setCity(payout.personalDetails.address.city);
    setRegion(payout.personalDetails.address.region);
    setCountry(payout.personalDetails.address.country);
    setZipCode(payout.personalDetails.address.zip);

    if (payout.payoutMethod === "cryptocurrency") {
      cryptoOnOpen();
    } else {
      bankOnOpen();
    }
  };

  const handleSendByCrypto = async () => {
    try {
      const client = Client(true);
      const response = await client.post(`${API_URL}/payouts/${pid}`);
      if (response.status === 204) {
        toast.success(ALERT_MESSAGE.PAYOUT_AWAITING_SEND_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.AWAITING_PAYMENT_UPDATE);
        Emitter.emit(eventTypes.PAYOUT_HISTORY_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_AWAITING_SEND_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    cryptoOnClose();
  };

  const handleSendByBank = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.PAID,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_AWAITING_SEND_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.AWAITING_PAYMENT_UPDATE);
        Emitter.emit(eventTypes.PAYOUT_HISTORY_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_AWAITING_SEND_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    bankOnClose();
  };

  const handleViewInvoice = async (form) => {
    const bankInf = bankTypes.find((obj) => {
      return obj.code === form.personalDetails.address.country;
    });
    var data = {
      images: {
        // The logo on top of your invoice
        logo: "https://i.postimg.cc/26DcMN2b/logo.png",
      },
      // Your own data
      client: {
        company: "Funded Trading Plus (FTP London Ltd.)",
        address: "7 Bell Yard",
        zip: "London WC2A 2JR",
        city: "UK",
      },

      // Your recipient
      sender: {
        company: form.name,
        address: form.personalDetails.address.street,
        zip:
          form.personalDetails.address.city +
          ", " +
          form.personalDetails.address.region +
          " " +
          form.personalDetails.address.zip,
        city: form.personalDetails.address.country,
      },
      information: {
        // Invoice number
        number: form.invoice,
        // Invoice data
        date: form.paidDate,
        // Invoice due date
        "due-date": form.paidDate,
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [
        {
          quantity: 1,
          description: form.purpose,
          "tax-rate": 0,
          price: form.amount.split(strDivider)[0],
        },
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice":
        form.payoutMethod === "cryptocurrency"
          ? "Please send a form to collect my cryptocurrency wallet details."
          : bankInf.requirements[0] +
            ": " +
            form.payoutDetails[0].value +
            " | " +
            bankInf.requirements[1] +
            ": " +
            form.payoutDetails[1].value,
      // Settings to customize your invoice
      settings: {
        currency: "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      },
    };
    const result = await easyinvoice.createInvoice(data);
    setInVoice(result.pdf);
    invoiceOnOpen();
  };

  const handleDelete = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.REJECTED,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_AWAITING_DELETE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.AWAITING_PAYMENT_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_AWAITING_DELETE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    deleteOnClose();
  };

  return (
    <CollapsibleCard title="Forms Awaiting Payment">
      <Table {...getTableProps()} variant="simple" color="gray.500" mt="20px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        {rows.length > 0 ? (
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Payee") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value.split(strDivider)[0]}
                          <br />
                          {cell.value.split(strDivider)[1]}
                        </Text>
                      );
                    } else if (cell.column.Header === "Amount") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {formatter.format(cell.value.split(strDivider)[0])}
                            <br />
                            Via {cell.value.split(strDivider)[1]}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Date Filled") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Actions") {
                      data = (
                        <Flex align="center" gap="6px" justifyContent="end">
                          <Button
                            fontSize="md"
                            variant="brand"
                            fontWeight="500"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original.id);
                              sendOnOpen(row.cells[0].row.original);
                            }}
                          >
                            Send Funds Now
                          </Button>
                          <Button
                            fontSize="md"
                            variant="brand"
                            fontWeight="500"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original.id);
                              handleViewInvoice(row.cells[0].row.original);
                            }}
                          >
                            View Invoice
                          </Button>
                          <Button
                            fontSize="md"
                            variant="brand"
                            fontWeight="500"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original.id);
                              deleteOnOpen();
                            }}
                          >
                            Delete
                          </Button>
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        ) : (
          <Tr mt="10px">
            <Td
              colSpan="5"
              textAlign="center"
              border="unset"
              color="white"
              fontSize={{ sm: "14px", lg: "14px" }}
            >
              No records to display.
            </Td>
          </Tr>
        )}
      </Table>
      <AlertDialog isOpen={deleteIsOpen} onClose={deleteOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Forms Awaiting Payment
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={deleteOnClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={invoiceIsOpen} onClose={invoiceOnClose}>
        <ModalOverlay />
        <ModalContent maxH="800px" maxW="1050px">
          <ModalHeader>Invoice Viewer</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="invoice-modal">
            <iframe
              src={`data:application/pdf;base64, ${invoice}`}
              style={{ width: "1024px", height: "720px" }}
              frameborder="0"
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={cryptoIsOpen} onClose={cryptoOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Send Funds Via Cryptocurrency
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={cryptoOnClose}>Cancel</Button>
              <Button colorScheme="green" onClick={handleSendByCrypto} ml={3}>
                Send
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={bankIsOpen} onClose={bankOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Send Funds Via Bank
            </AlertDialogHeader>
            <AlertDialogBody>
              <p>{name}</p>
              <p>{address}</p>
              <p>{`${city}, ${region}, ${country} ${zipCode}`}</p>
              <br />
              <p>{`${bankRouting.type}: ${bankRouting.value}`}</p>
              <p>{`${bankAccouting.type}: ${bankAccouting.value}`}</p>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={bankOnClose}>Cancel</Button>
              <Button colorScheme="green" onClick={handleSendByBank} ml={3}>
                Send
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </CollapsibleCard>
  );
}

export default FormsAwaiting;
