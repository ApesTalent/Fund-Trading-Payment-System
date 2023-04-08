// Chakra imports
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
  Icon,
} from "@chakra-ui/react"; // Assets
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import { columnsDataClient } from "views/admin/dataTables/variables/columnsData";
import { strDivider } from "../constant";
import CollapsibleCard from "components/card/CollapsibleCard.js";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

import { Client, API_URL } from "api/axios";
import { toast } from "react-toastify";
import { statusTypes, eventTypes } from "../constant";
import Emitter from "api/emitter";
import validator from "validator";
import { ALERT_MESSAGE } from "variables/message";
import { MdFlag } from "react-icons/md";
import { formatMoney } from "variables/utils";

import MaterialTable from "material-table";

import { forwardRef } from "react";

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

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function ClientPayout(props) {
  const {
    isOpen: acceptIsOpen,
    onOpen: acceptOnOpen,
    onClose: acceptOnClose,
  } = useDisclosure();
  const {
    isOpen: rejectIsOpen,
    onOpen: rejectOnOpen,
    onClose: rejectOnClose,
  } = useDisclosure();
  const {
    isOpen: finalizeIsOpen,
    onOpen: finalizeOnOpen,
    onClose: finalizeOnClose,
  } = useDisclosure();
  const {
    isOpen: updateIsOpen,
    onOpen: updateOnOpen,
    onClose: updateOnClose,
  } = useDisclosure();
  const {
    isOpen: reportIsOpen,
    onOpen: reportOnOpen,
    onClose: reportOnClose,
  } = useDisclosure();

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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const { tableData } = props;
  const columns = useMemo(() => columnsDataClient, [columnsDataClient]);

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

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

  const [pid, setPid] = useState();
  const [tradingAccount, setTradingAccount] = useState();
  const [reports, setReports] = useState([]);
  const payeeRefs = React.useRef([]);

  const handleAccept = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.UNUSED,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_REQUEST_ACCEPT_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setData([]);
        Emitter.emit(eventTypes.CLIENT_PAYOUT_UPDATE);
        Emitter.emit(eventTypes.UNUSED_PAYOUT_UPDATE);
        sendInformationNeedEmail(response.data.email, pid);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUEST_ACCEPT_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    acceptOnClose();
  };

  const sendInformationNeedEmail = async (email, id) => {
    try {
      const client = Client(true);
      await client.post(
        `${API_URL}/payouts/sendEmail`,
        JSON.stringify({
          to: email,
          pId: id,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.REJECTED,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_REQUEST_REJECT_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setData([]);
        Emitter.emit(eventTypes.CLIENT_PAYOUT_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUEST_REJECT_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    rejectOnClose();
  };

  const handleFinalize = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.FINALIZED,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_REQUEST_FINALIZED_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setData([]);
        Emitter.emit(eventTypes.CLIENT_PAYOUT_UPDATE);
        Emitter.emit(eventTypes.PAYOUT_HISTORY_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUEST_FINALIZED_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    finalizeOnClose();
  };

  const validatePayee = (payeeSplit) => {
    if (typeof payeeSplit === "undefined" || payeeSplit === null) return false;

    const amount = payeeSplit?.value.replace(/,/g, "");

    if (!validator.isFloat(amount) || parseFloat(amount) < 0) {
      toast.error(ALERT_MESSAGE.PAYOUT_INVAILIDATE_WARNING, {
        position: toast.POSITION.TOP_RIGHT,
      });
      payeeRefs.current[pid].value = payeeRefs.current[pid].defaultValue;
      return false;
    } else {
      return true;
    }
  };

  const onUpdatePayee = async () => {
    const payeeSplit = payeeRefs.current[pid].value.replace(/,/g, "");
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/payouts/${pid}`,
        JSON.stringify({
          status: statusTypes.REQUEST,
          amount: payeeSplit,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.PAYOUT_REQUEST_UPDATE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setData([]);
        Emitter.emit(eventTypes.CLIENT_PAYOUT_UPDATE);
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUEST_UPDATE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    updateOnClose();
  };

  const onUpdatePayeeClose = async () => {
    if (
      payeeRefs.current[pid] != null &&
      typeof payeeRefs.current[pid] != "undefined"
    )
      payeeRefs.current[pid].value = payeeRefs.current[pid].defaultValue;
    updateOnClose();
  };

  const getReportsById = async (id) => {
    try {
      const client = Client(true);
      const response = await client.get(`${API_URL}/payouts/getFlag/${id}`);
      setReports(response.data?.reports);
    } catch (err) {
      toast.error(ALERT_MESSAGE.PAYOUT_REQUEST_UPDATE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleViewReport = async (id) => {
    await getReportsById(id);
    reportOnOpen();
  };

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  const getExcel = async (partner, data) => {
    urltoFile(
      data,
      `${tradingAccount}-${partner}.xlsx`,
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ).then((file) => {
      saveAs(file);
    });
  };

  return (
    <CollapsibleCard title="Client Payout Requests">
      <Table {...getTableProps()} variant="simple" color="gray.500" mt="20px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index} style={{pointerEvents: "none"}}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <div fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
                    {column.render("Header")}
                  </div>
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
                    } else if (cell.column.Header === "Trading Account") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                          {row.cells[0].row.original.flag && (
                            <Icon
                              as={MdFlag}
                              width="20px"
                              height="20px"
                              color="inherit"
                              cursor="pointer"
                              onClick={() => {
                                setTradingAccount(
                                  row.cells[0].row.original.tradingAccount
                                );
                                handleViewReport(
                                  row.cells[0].row.original.tradingAccount
                                );
                              }}
                            />
                          )}
                        </Flex>
                      );
                    } else if (cell.column.Header === "Payee's Split") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            $&nbsp;
                          </Text>
                          <input
                            type="text"
                            defaultValue={formatMoney(cell.value)}
                            onChange={(e) => {
                              setPid(row.cells[0].row.original._id);
                            }}
                            ref={(el) =>
                              (payeeRefs.current[
                                row.cells[0].row.original._id
                              ] = el)
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                              backgroundColor: "#111C44",
                              fontSize: "sm",
                              fontWeight: "700",
                              width: "80%",
                              height: "35px",
                            }}
                            onBlur={() => {
                              if (
                                pid &&
                                validatePayee(payeeRefs.current[pid])
                              ) {
                                payeeRefs.current[pid].value = formatMoney(
                                  payeeRefs.current[pid].value
                                );
                                updateOnOpen();
                              }
                            }}
                          />
                        </Flex>
                      );
                    } else if (cell.column.Header === "Date Requested") {
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
                            w="100px"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original._id);
                              acceptOnOpen();
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            fontSize="md"
                            variant="brand"
                            fontWeight="500"
                            w="100px"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original._id);
                              rejectOnOpen();
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            fontSize="md"
                            variant="brand"
                            fontWeight="500"
                            w="100px"
                            h="50"
                            onClick={() => {
                              setPid(row.cells[0].row.original._id);
                              finalizeOnOpen();
                            }}
                          >
                            Finalize
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
      <AlertDialog isOpen={acceptIsOpen} onClose={acceptOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Accept Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={acceptOnClose}>Cancel</Button>
              <Button colorScheme="linkedin" onClick={handleAccept} ml={3}>
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={rejectIsOpen} onClose={rejectOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reject Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={rejectOnClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleReject} ml={3}>
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={finalizeIsOpen} onClose={finalizeOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Finalize Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={finalizeOnClose}>Cancel</Button>
              <Button colorScheme="green" onClick={handleFinalize} ml={3}>
                Finalize
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={updateIsOpen} onClose={updateOnClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Payee Update Request
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onUpdatePayeeClose}>Cancel</Button>
              <Button colorScheme="green" onClick={onUpdatePayee} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={reportIsOpen} onClose={reportOnClose}>
        <ModalOverlay />
        <ModalContent maxW="600px" style={{ backgroundColor: "#111C44" }}>
          <ModalHeader>Flag Reports</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="invoice-modal">
            <MaterialTable
              columns={[
                {
                  field: "partner",
                  title: "Partner",
                },
                {
                  field: "report",
                  title: "Report",
                  render: (rowData) => (
                    <Button
                    style={{width : "80%"}}
                    variant="brand"
                      onClick={() => {
                        getExcel(rowData.partner, rowData.report);
                      }}
                    >
                      Download
                    </Button>
                  ),
                },
              ]}    
              data={reports}
              title=""
              icons={tableIcons}
              options={{
                paging:true,
                pageSize:10,       // make initial page size
                emptyRowsWhenPaging: false,   // To avoid of having empty rows
                pageSizeOptions:[10],    // rows selection options
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
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </CollapsibleCard>
  );
}

export default ClientPayout;
