import { useContext, useState } from "react";
import { Context } from "../../context";
import fetch from "isomorphic-fetch";
import { Button } from "antd";
import axios from "axios";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from "../../component/routes/UserRoute";

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const { state: user } = useContext(Context);

  const becomeInstructor = async (e) => {
    e.preventDefault();
    console.log("Become Instructor");
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API}/make-instructor`)
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed");
      });
    // if (data) {
    //   window.location.href = data;
    //   return console.log("SUCCESS", data);
    // } else {
    //   setLoading(false);
    // }

    // .then((res) => {
    //   console.log(res);
    //   window.location.href = res.data;
    // })
    // .catch((error) => {
    //   console.log(error.response.status);
    //   toast.error("Failed to pay. Try again");
    //   setLoading(false);
    // });
  };

  return (
    <>
      <h1
        className="jumbotron text-center bg-primary square"
        style={{ display: "grid" }}
      >
        Become Instructor
      </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Edemy</h2>
              <p className="lead text-warning">
                Edemy Partners with Stripe to transfer earnings to your bank
                account
              </p>
              {/* Show Button */}
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
              >
                {loading ? "Processsing..." : "Payout Setup"}
              </Button>
              <p className="lead">
                You will be redirected to stripe to complete onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
