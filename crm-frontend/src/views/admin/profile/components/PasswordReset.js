// Chakra imports
import {
    Button,
    FormControl,
    FormLabel,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
// Custom components
import React from "react";
// Assets
import { Client, API_URL } from "../../../../api/axios";
import { toast } from "react-toastify";
import { useState, useContext } from "react";
import { ALERT_MESSAGE } from "variables/message";

export default function PasswordRest(props) {
    // Chakra color mode
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const [show, setShow] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const handleClick = () => setShow(!show);

    const [pwd, setPwd] = useState("");

    const handlePwdChange = async (e) => {
        try {
            const client = Client();
            await client.post(
                `${API_URL}/auth/change-password`,
                JSON.stringify({ token: JSON.parse(localStorage.getItem('user'))?.refreshToken?.token, password: pwd })
            );
            toast.success(ALERT_MESSAGE.USER_PASSWORD_RESET_SUCCESS, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
        }
    };

    return (
        <FormControl>
            <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
            >
                Change Your Password
            </FormLabel>
            <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="password"
                placeholder="New password"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
            />
            <InputGroup size="md">
                <Input
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Confirm New Password"
                    mb="24px"
                    size="lg"
                    type={show ? "text" : "password"}
                    variant="auth"
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                    <Icon
                        color={textColorSecondary}
                        _hover={{ cursor: "pointer" }}
                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={handleClick}
                    />
                </InputRightElement>
            </InputGroup>
            <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                onClick={() => handlePwdChange()}>
                Change password
            </Button>
        </FormControl>
    );
}
