import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type UpdateType = {
  username: string;
  email: string;
};

type ResetType = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const Settings = () => {
  const [update, setUpdate] = useState<UpdateType>({} as UpdateType);
  const [reset, setReset] = useState<ResetType>({} as ResetType);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: AxiosResponse) => {
        setUpdate({
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUpdate((prevUpdate) => ({
      ...prevUpdate,
      [name]: value,
    }));
  }

  function handleReset(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setReset((prevReset) => ({
      ...prevReset,
      [name]: value,
    }));
  }

  function handleSubmitUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .patch("http://127.0.0.1:8080/update", update, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => {
        setUpdate({
          username: res.data.username,
          email: res.data.email,
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Updating failed!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }

  function handleSubmitReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .patch("http://127.0.0.1:8080/reset", reset, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res: AxiosResponse) => {
        setReset({
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.data,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }

  return (
    <div className="settingsContainer">
      <div className="container-fluid">
        <div className="loginContainer">
          <h1>Update</h1>
          <form onSubmit={handleSubmitUpdate}>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              required
              value={update.username}
              onChange={handleChange}
            />
            <br />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={update.email}
              onChange={handleChange}
            />
            <br />
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
      <div className="container-fluid">
        <div className="loginContainer">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmitReset}>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter your current password"
              required
              value={reset.currentPassword}
              onChange={handleReset}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={reset.password}
              onChange={handleReset}
            />
            <br />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              required
              value={reset.confirmPassword}
              onChange={handleReset}
            />
            <br />
            <button type="submit">Reset</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
