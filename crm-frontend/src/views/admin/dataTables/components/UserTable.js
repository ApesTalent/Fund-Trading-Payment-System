import {
  Flex,
  Table,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  FormControl,
  Input,
  Select
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

import { toast } from "react-toastify";

// Custom components
import Card from "components/card/Card";
import { MdEdit, MdDelete, MdPersonAddAlt1 } from "react-icons/md";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'

// Assets

import { Client, API_URL } from "api/axios";
import Emitter from "api/emitter";
import {ALERT_MESSAGE} from "variables/message"

export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: delIsOpen, onOpen: delOnOpen, onClose: delOnClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [eName, setEname] = useState();
  const [eEmail, setEemail] = useState();
  const [eRole, setErole] = useState();
  const [ePassword, setEpassword] = useState();
  const [id, setId] = useState();
  const cancelRef = React.useRef()

  const registerUser = async () => {
    try {
      const client = Client(true);
      const response = await client.post(
        `${API_URL}/users`,
        JSON.stringify({
          name: eName,
          email: eEmail,
          password: ePassword,
          role: eRole,
        })
      );
      if (response.status === 201) {
        toast.success(ALERT_MESSAGE.USER_REGISTER_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit('Users_Update');
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.USER_REGISTER_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    onClose();
  };

  const updateUser = async () => {
    try {
      const client = Client(true);
      const response = await client.patch(
        `${API_URL}/users/${id}`,
        JSON.stringify({
          name: eName,
          email: eEmail,
          password: ePassword,
        })
      );
      if (response.status === 200) {
        toast.success(ALERT_MESSAGE.USER_UPDATE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit('Users_Update');
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.USER_UPDATE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    onClose();
  };

  const deleteUser = async () => {
    try {
      const client = Client(true);
      const response = await client.delete(
        `${API_URL}/users/${id}`)
        ;
      if (response.status === 204) {
        toast.success(ALERT_MESSAGE.USER_DELETE_SUCCESS, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Emitter.emit('Users_Update');
      }
    } catch (err) {
      toast.error(ALERT_MESSAGE.USER_DELETE_FAIL, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    delOnClose();
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


  const initDelete = (cell) => {
    setEname(cell[0].value);
    setEemail(cell[1].value);
    setErole(cell[2].value);
    setEpassword(cell[3].value);
    setId(cell[0].row.original.id);
  };

  const initEdit = (cell) => {
    setIsEdit(true);
    setEname(cell[0].value);
    setEemail(cell[1].value);
    setErole(cell[2].value);
    setEpassword(cell[3].value);
    setId(cell[0].row.original.id);
  };

  const initRegister = () => {
    setIsEdit(false);
    setEname("");
    setEemail("");
    setErole("");
    setEpassword("");
  };

  const columns = useMemo(() => columnsData, [columnsData]);
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
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          User management
        </Text>

        <Icon
          as={MdPersonAddAlt1}
          color="white"
          h="30px"
          w="30px"
          onClick={() => {
            initRegister();
            onOpen();
          }}
        />
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
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
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "Name") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "Email") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "Role") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "Password") {
                    data = (
                      <Flex align="center">
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          **********
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "Action") {
                    data = (
                      <Flex align="center" gap="6px">
                        <Icon
                          as={MdEdit}
                          color="secondaryGray.500"
                          h="24px"
                          w="24px"
                          onClick={() => {
                            initEdit(row.cells);
                            onOpen();
                          }}
                        />
                        <Icon
                          as={MdDelete}
                          color="secondaryGray.500"
                          h="24px"
                          w="24px"
                          onClick={() => {
                            initDelete(row.cells);
                            delOnOpen();
                          }}
                        />
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
      </Table>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Register/Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="text"
                placeholder="Name"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setEname(e.target.value)}
                value={eName}
              />
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="Email"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setEemail(e.target.value)}
                value={eEmail}
              />

              <Select placeholder='Select role'
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="text"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setErole(e.target.value)}
                value={eRole}
                defaultValue='user'>
                <option value='user'>User</option>
                <option value='manager'>Manager</option>
                <option value='admin'>Admin</option>
              </Select>

              <Input
                isRequired={true}
                type="password"
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                placeholder="Password"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setEpassword(e.target.value)}
                value={ePassword}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={() => { isEdit ? updateUser() : registerUser() }}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={delIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={delOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={delOnClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={deleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

    </Card>
  );
}
