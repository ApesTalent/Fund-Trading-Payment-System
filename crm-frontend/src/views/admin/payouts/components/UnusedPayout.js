// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  useDisclosure,
} from "@chakra-ui/react"; // Assets
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import { columnsDataUnused } from "views/admin/dataTables/variables/columnsData";
import CollapsibleCard from "components/card/CollapsibleCard.js";
import { strDivider } from "../constant";

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
import Emitter from "api/emitter";
import { eventTypes, statusTypes } from "../constant";
import { ALERT_MESSAGE } from "variables/message";
import { formatter } from "variables/utils";

function UnusedPayout(props) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const { tableData } = props;
  const columns = useMemo(() => columnsDataUnused, [columnsDataUnused]);
  const data = useMemo(() => tableData, [tableData]);
  const [pid, setPid] = useState();

  const {
    isOpen: deleteIsOpen,
    onOpen: deleteOnOpen,
    onClose: deleteOnClose,
  } = useDisclosure();

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 100 },
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
  } = tableInstance;

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
        toast.success(ALERT_MESSAGE.PAYOUT_UNUSED_DELETE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit(eventTypes.UNUSED_PAYOUT_UPDATE);
      }
    } catch (err) {
      console.log(err);
      toast.error(ALERT_MESSAGE.PAYOUT_UNUSED_DELETE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    deleteOnClose();
  };

  return (
    <CollapsibleCard title="Unused Payout Forms">
      <Table
        {...getTableProps()}
        variant="simple"
        color="gray.500"
        mt="20px"
        defaultPageSize={100}
        pageSize={100}
      >
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
                            {formatter.format(cell.value)}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Date Sent") {
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
              Delete unused Payout Forms
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
    </CollapsibleCard>
  );
}

export default UnusedPayout;
