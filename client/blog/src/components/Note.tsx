import axios, { AxiosResponse } from "axios";
import { postType, newPostType } from "../pages/BlogPage";

type PostProps = {
  title: string;
  content: string;
  id: string;
  setPosts: React.Dispatch<React.SetStateAction<postType[]>>;
  setPost: React.Dispatch<React.SetStateAction<newPostType>>;
  setUpdating : React.Dispatch<React.SetStateAction<string | null>>;
};

const Note = ({ title, content, id, setPosts, setPost , setUpdating}: PostProps) => {
  const token = localStorage.getItem("token");

  function handleDelete() {
    axios
      .delete(`http://127.0.0.1:8080/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: AxiosResponse) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function handleUpdate() {
    axios
      .get(`http://127.0.0.1:8080/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: AxiosResponse) => {
        setPost({
          title: res.data.title,
          content: res.data.content,
        });
        setUpdating(id)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="note">
      <h1>{title}</h1>
      <p>{content}</p>
      <button onClick={handleDelete}>DELETE</button>
      <button onClick={handleUpdate}>UPDATE</button>
    </div>
  );
};

export default Note;
