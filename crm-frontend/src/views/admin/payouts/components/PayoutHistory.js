// Chakra imports
import { Button, Flex, useDisclosure } from "@chakra-ui/react"; // Assets
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";

import MaterialTable from "material-table";

import CollapsibleCard from "components/card/CollapsibleCard.js";
import { forwardRef } from "react";
import { formatter } from "variables/utils";

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
import ViewColumn from "@material-ui/icons/ViewColumn";
import { strDivider, statusTypes } from "../constant";
import { bankTypes } from "views/form/constant";
import easyinvoice from "easyinvoice";

function PayoutHistory(props) {
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

  const { tableData } = props;
  const [invoice, setInVoice] = useState();

  const {
    isOpen: invoiceIsOpen,
    onOpen: invoiceOnOpen,
    onClose: invoiceOnClose,
  } = useDisclosure();

  const handleViewInvoice = async (form) => {
    const bankInf = bankTypes.find((obj) => {
      return obj.code === form.personalDetails.address.country;
    });
    var data = {
      images: {
        // The logo on top of your invoice
        logo: "https://i.postimg.cc/26DcMN2b/logo.png",
        // The invoice background
        // background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
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
      // Settings to customize your invoice
      settings: {
        currency: "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
      },
    };
    const result = await easyinvoice.createInvoice(data);
    setInVoice(result.pdf);
    invoiceOnOpen();
  };

  const columns = [
    {
      field: "payee",
      title: "Payee",
      render: (rowData) => (
        <>
          {rowData.payee.split(strDivider)[0]} <br />{" "}
          {rowData.payee.split(strDivider)[1]}
        </>
      ),
    },
    {
      field: "amount",
      title: "Amount",
      render: (rowData) => (
        <>
          {formatter.format(rowData.amount)} <br />{" "}
          {rowData.status === statusTypes.PAID
            ? "Via " + rowData.payoutMethod
            : "Request marked finalized"}
        </>
      ),
    },
    {
      title: "Date Paid",
      field: "paidDate",
      render: (rowData) => <>{rowData.paidDate}</>,
    },
  ];

  return (
    <CollapsibleCard title="Payout History">
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: "No records to display.",
          },
        }}
        columns={columns}
        data={tableData}
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
        actions={[
          {
            icon: "save",
            tooltip: "View Invoice",
            onClick: (event, rowData) => handleViewInvoice(rowData),
          },
        ]}
        components={{
          Action: (props) => (
            <Flex align="center" gap="6px" justifyContent="end" width="100%">
              <Button
                disabled={props.data.status === statusTypes.PAID ? false : true}
                fontSize="md"
                variant="brand"
                fontWeight="500"
                h="50"
                onClick={(event) => props.action.onClick(event, props.data)}
              >
                View Invoice
              </Button>
            </Flex>
          ),
        }}
      />
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
    </CollapsibleCard>
  );
}

export default PayoutHistory;
