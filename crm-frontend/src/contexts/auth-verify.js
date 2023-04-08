import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Emitter from "api/emitter";
import { eventTypes } from "views/admin/payouts/constant";

function AuthVerify(props) {
  useEffect(() => {
    const unlisten = props.history.listen(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const expireDate = Date.parse(user.accessToken.expires);
        if (expireDate < Date.now()) {
          Emitter.emit(eventTypes.USER_LOGOUT);
        }
      }
    });
    return () => {
      unlisten();
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const expireDate = Date.parse(user.accessToken.expires);
        if (expireDate < Date.now()) {
          Emitter.emit(eventTypes.USER_LOGOUT);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return <div></div>;
}

export default withRouter(AuthVerify);
