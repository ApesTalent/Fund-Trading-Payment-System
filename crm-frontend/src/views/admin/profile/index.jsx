
// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import UserManage from "views/admin/profile/components/UserManage";
import PasswordReset from "views/admin/profile/components/PasswordReset";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar11.png";
import React from "react";
import { useState, useEffect } from "react";

export default function Overview() {
  
 const [userObj, setUserObj] = useState({})
  useEffect(() => {
    setUserObj(JSON.parse(localStorage.getItem("user")))
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 2fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name={userObj.name}
          roles={userObj.roles}
          posts="17"
          followers="9.7k"
          following="274"
        />
        <PasswordReset
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
        />
      </Grid>
      {userObj.roles === "admin" && (
        <Grid
          mb="20px"
          templateColumns={{
            base: "1fr",
          }}
          templateRows={{
            base: "1fr",
            lg: "repeat(2, 1fr)",
            "2xl": "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
        >
          <UserManage
            gridArea="2 / 5 / 3 / 2"
            banner={banner}
            avatar={avatar}
            name="Adela Parkson"
            job="Product Designer"
            posts="17"
            followers="9.7k"
            following="274"
          />
        </Grid>
      )}
    </Box>
  );
}
