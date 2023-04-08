import { Grid, Flex, Text } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/clients/components/information/Banner";
import { useEffect, useContext } from "react";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";
import EmailForm from "../email/EmailForm";
import AuthContext from "contexts/AuthProvider";


function ClientDashboard(props) {
  const { clients, viewClient, setId, viewEmail } = props;
  const { setAuth } = useContext(AuthContext);
  useEffect(() => {
    setAuth({isSearch : true})
    return () => {
      setAuth({isSearch : false})
    };
  }, []);

  return (
    <div>
      {clients.length > 0 ? (
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "repeat(4, 1fr)",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
        >
          {clients.map((v) => (
            <Banner
              gridArea="1 / 1 / 2 / 2"
              name={v.name}
              id={v.id}
              accounts={v.accounts}
              setId={setId}
              viewClient={viewClient}
              viewEmail={viewEmail}
              posts="17"
              followers="9.7k"
              following="274"
            />
          ))}
        </Grid>
      ) : (
        <Flex direction="column" align="center" mt="50px">
          <Text color="secondaryGray.600" fontSize="2xl" fontWeight="700">
            We couldn't find any matching results.
          </Text>
          <Text
            color="gray.600"
            textAlign="left"
            fontSize="xl"
            fontWeight="400"
            mt="10px"
          >
            Try to enter the email address of a client.
          </Text>
        </Flex>
      )}
    </div>
  );
}

export default ClientDashboard;
