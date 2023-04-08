import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdPerson, MdHome, MdOutlinePaid, MdPeople } from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Clients from "views/admin/clients";
import Payout from "views/admin/payouts";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
    isShow: true,
  },
  {
    name: "Payouts",
    layout: "/admin",
    path: "/payouts",
    icon: (
      <Icon as={MdOutlinePaid} width="20px" height="20px" color="inherit" />
    ),
    component: Payout,
    isShow: true,
  },
  {
    name: "Clients",
    layout: "/admin",
    path: "/clients",
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: Clients,
    isShow: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
    isShow: true,
  },
];

export default routes;
