import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Profile from "views/admin/clients/components/information/Profile";
import PersonInf from "views/admin/clients/components/information/PersonInf";
import MetaTrader from "views/admin/clients/components/information/MetaTrader";
import Orders from "views/admin/clients/components/information/Orders";
import StaffActions from "views/admin/clients/components/information/StaffActions";

import banner from "assets/img/auth/banner.png";
import { useState, useEffect, useRef } from "react";
import { Client, API_URL } from "api/axios";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";

function ClientDetail(props) {
  const { id, toBack } = props;
  const [clientObj, setClientObj] = useState({});
  const [notes, setNotes] = useState([]);

  const getClient = async () => {
    try {
      const client = Client(true);
      const response = await client.get(`${API_URL}/client/${id}`);
      setClientObj(response.data);
      setNotes(response.data?.notes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getClient();
  }, []);

  useEffect(() => {
    Emitter.on(eventTypes.CLIENT_NOTES_UPDATE, () => getClient());
  }, []);

  return (
    <Box>
      {/* Main Fields */}
      <Grid templateColumns="repeat(1, 1fr)" gap={{ base: "20px", xl: "20px" }}>
        <Profile banner={banner} client={clientObj} toBack={toBack} />
        <PersonInf client={clientObj} />
        <MetaTrader />
        <Orders client={clientObj} />
        <StaffActions flags={clientObj?.flags} id={id} data={notes} />
      </Grid>
    </Box>
  );
}

export default ClientDetail;
