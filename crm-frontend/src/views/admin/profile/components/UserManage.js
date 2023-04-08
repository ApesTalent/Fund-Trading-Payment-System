// Chakra imports
import UserTable from "views/admin/dataTables/components/UserTable";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import {
  columnsDataUser
} from "views/admin/dataTables/variables/columnsData";
import { useEffect, useState } from "react";
import { Client, API_URL } from "../../../../api/axios";
import Emitter from "api/emitter";


export default function Projects(props) {

  const [users, setUsers] = useState([])

  const getUsers = async () => {
    try {
      const client = Client(true);
      const response = await client.get(
        `${API_URL}/users`);
      setUsers(response.data.results)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    Emitter.on('Users_Update', () => getUsers());
  },[])

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <UserTable
        columnsData={columnsDataUser}
        tableData={users}
      />
    </Card>
  );
}
