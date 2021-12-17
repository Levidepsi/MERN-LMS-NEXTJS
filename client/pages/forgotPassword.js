import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const forgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter;

  useEffect(() => {
    if (user !== null) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/forgot-password`,
        { email }
      );
      setSuccess(true);
      toast.success("Check your email for the secret code");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // console.log(email, code, newPassword);
    // return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/reset-password`,
        { email, code, newPassword }
      );
      setEmail("");
      setCode("");
      setNewPassword("");
      setLoading(false);
      toast.success("Login with your new password");
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <h1
        style={{ display: "grid" }}
        className="jumbotron  text-center bg-primary square"
      >
        Forgot Password
      </h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
          {success && (
            <>
              {" "}
              <input
                type="text"
                className="form-control mb-4 p-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              />
              <input
                type="password"
                className="form-control mb-4 p-4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                required
              />
            </>
          )}
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-block btn-primary p-2"
              disabled={!email || loading}
            >
              {loading ? <SyncOutlined /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default forgotPassword;
