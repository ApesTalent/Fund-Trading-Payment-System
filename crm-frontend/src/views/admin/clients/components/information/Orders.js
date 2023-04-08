import { useColorModeValue } from "@chakra-ui/react";
import MaterialTable from "material-table";

import Card from "components/card/Card.js";
import { forwardRef } from "react";
import { useState, useEffect } from "react";

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
import { formatter } from "variables/utils";

// Custom components
import CollapsibleCard from "components/card/CollapsibleCard.js";

function Orders(props) {
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
      field: "number",
      title: "Number",
    },
    {
      field: "timeAdded",
      title: "Date",
      render: (rowData) => (
        <>{new Date(rowData.timeAdded * 1000).toLocaleDateString("en-US")}</>
      ),
    },
    {
      field: "type",
      title: "Type",
    },

    {
      field: "total",
      title: "Total",
      render: (rowData) => <>{formatter.format(rowData.total)}</>,
    },
  ];

  const { client } = props;
  const [orders, setOrders] = useState([]);

  const removeDuplicatedOrders = (arr) => {
    const seen = new Set();
    const filteredAccounts = arr.filter((el) => {
      const duplicate = seen.has(el?.order?.number);
      seen.add(el?.order?.number);
      return !duplicate;
    });
    const filteredOrders = filteredAccounts.map((v) => {
      const item = {};
      item.timeAdded = v.timeAdded;
      item.number = v.order.number;
      item.total = v.order.total;
      item.type = v.order.type;
      return item;
    });

    console.log(filteredOrders);
    return filteredOrders;
  };

  useEffect(() => {
    if (client?.accounts?.length > 0)
      setOrders(removeDuplicatedOrders(client.accounts));
  }, [client]);

  return (
    <CollapsibleCard title="Associated Orders">
      <Card mb={{ base: "0px", lg: "20px" }} align="center">
        <MaterialTable
          columns={columns}
          data={orders}
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
          }}
        />
      </Card>
    </CollapsibleCard>
  );
}

export default Orders;
