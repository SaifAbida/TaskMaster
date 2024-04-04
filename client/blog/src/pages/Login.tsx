import axios, { AxiosResponse } from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

type LoginType = {
  username: string;
  password: string;
};

const Login = () => {
  const [login, setLogin] = useState<LoginType>({} as LoginType);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token")

  useEffect(()=>{
    if(token){
      navigate("/blog")
    }
  },[])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8080/login", login)
      .then((res: AxiosResponse) => {
        setMessage(res.data.message);
        localStorage.setItem("token", res.data.token);
          navigate("/blog");
      })
      .catch((error) => {
        console.error(error);
        setMessage(error.response.data);
      });
  }
  

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  }

  return (
    <div className="container-fluid">
      <div className="loginContainer">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={login.username}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={login.password}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
        <h1>{message}</h1>
      </div>
    </div>
  );
};

export default Login;
