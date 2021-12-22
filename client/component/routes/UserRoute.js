import { useState, useEffect } from "react";
import fetch from "isomorphic-fetch";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import UserNav from "../nav/UserNav";

const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  // router
  const router = useRouter();

  const fetchUser = () => {
    const data = fetch(`${process.env.NEXT_PUBLIC_API}/currentUser`, {
      method: "GET",
    });
    if (data) {
      setOk(true);
      return console.log("SUCCESS", data);
    } else {
      console.log(error);
      setOk(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <UserNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRoute;
