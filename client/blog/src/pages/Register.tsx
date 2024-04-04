import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type registerType = {
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const [register, setRegister] = useState<registerType>({} as registerType);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/blog");
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8080/create", register)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setRegister((prevRegister) => ({
      ...prevRegister,
      [name]: value,
    }));
  }

  return (
    <div className="container-fluid">
      <div className="loginContainer">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            value={register.username}
            onChange={handleChange}
          />
          <br />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={register.email}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={register.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
