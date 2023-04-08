// Chakra Imports
import {
  Avatar,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
// Custom Components
import { SearchIcon } from "@chakra-ui/icons";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";
// Assets
import { ALERT_MESSAGE } from "variables/message";
import { FaEthereum } from "react-icons/fa";
import routes from "routes.js";
import { Client, API_URL } from "../../api/axios";
import { toast } from "react-toastify";
import AuthContext from "contexts/AuthProvider";



export default function HeaderLinks(props) {
  const { secondary } = props;
  const { auth } = useContext(AuthContext);

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const borderButton = useColorModeValue("secondaryGray.500", "whiteAlpha.200");
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  // logout
  const [errMsg, setErrMsg] = useState("");
  const [searchStr, setSearchStr] = useState("");
  const history = useHistory();
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    Emitter.on(eventTypes.USER_LOGOUT, () => handleLogout());
  }, []);

  const handleLogout = async (e) => {
    try {
      const client = Client();
      await client.post(
        `${API_URL}/auth/logout`,
        JSON.stringify({
          refreshToken: JSON.parse(localStorage.getItem("user"))?.refreshToken
            ?.token,
        })
      );
      toast.success(ALERT_MESSAGE.USER_LOGOUT_SUCCESS, {
        position: toast.POSITION.TOP_RIGHT,
      });

      localStorage.removeItem("user");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Logout Failed");
        toast.error(ALERT_MESSAGE.USER_LOGOUT_FAIL, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    history.push("/auth/sign-in");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      Emitter.emit(eventTypes.SEARCH_QUERY_UPDATE, searchStr);
    }
  };

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {auth.isSearch === true && (
        <InputGroup
          w={{ base: "100%", md: "200px" }}
          mb={secondary ? { base: "10px", md: "unset" } : "unset"}
          me="10px"
          borderRadius="30px"
        >
          <InputLeftElement
            children={
              <IconButton
                bg="inherit"
                borderRadius="inherit"
                _hover="none"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
                icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
              ></IconButton>
            }
          />
          <Input
            variant="search"
            fontSize="sm"
            bg={inputBg}
            color={inputText}
            fontWeight="500"
            _placeholder={{ color: "gray.400", fontSize: "14px" }}
            borderRadius={"30px"}
            placeholder={"Search..."}
            onChange={(e) => setSearchStr(e.target.value)}
            value={searchStr}
            onKeyDown={handleKeyDown}
          />
        </InputGroup>
      )}

      <Flex
        bg={ethBg}
        display={secondary ? "flex" : "none"}
        borderRadius="30px"
        ms="auto"
        p="6px"
        align="center"
        me="6px"
      >
        <Flex
          align="center"
          justify="center"
          bg={ethBox}
          h="29px"
          w="29px"
          borderRadius="30px"
          me="7px"
        >
          <Icon color={ethColor} w="9px" h="14px" as={FaEthereum} />
        </Flex>
        <Text
          w="max-content"
          color={ethColor}
          fontSize="sm"
          fontWeight="700"
          me="6px"
        >
          1,924
          <Text as="span" display={{ base: "none", md: "unset" }}>
            {" "}
            ETH
          </Text>
        </Text>
      </Flex>
      <SidebarResponsive routes={routes} />

      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={JSON.parse(localStorage.getItem("user"))?.name}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {JSON.parse(localStorage.getItem("user"))?.name}!
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={() => handleLogout()}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
