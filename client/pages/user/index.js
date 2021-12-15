import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import axios from "axios";

import UserRoute from "../../component/routes/UserRoute";

const UserIndex = () => {
  const { state: user } = useContext(Context);

  return (
    <UserRoute>
      <h1
        className="jumbotron text-center bg-primary square"
        style={{ display: "grid", height: "100vh" }}
      >
        <pre>{JSON.stringify(user, null, 4)}</pre>
      </h1>
    </UserRoute>
  );
};

export default UserIndex;
