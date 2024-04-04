import { useEffect, useRef, useState } from "react";
import Note from "../components/Note";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export type postType = {
  _id: string;
  title: string;
  content: string;
  __v: number;
};

export type newPostType = {
  title: string;
  content: string;
};

const BlogPage = () => {
  const [posts, setPosts] = useState<postType[]>([{} as postType]);
  const [post, setPost] = useState<newPostType>({} as newPostType);
  const [updating, setUpdating] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: AxiosResponse) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  }

  function handleUndoUpdate() {
    setUpdating(null);
    setPost({
      title: "",
      content: "",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (updating) {
      axios
        .put(`http://127.0.0.1:8080/${updating}`, post, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res: AxiosResponse) => {
          setPosts(res.data);
          setUpdating(null);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post("http://127.0.0.1:8080/", post, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res: AxiosResponse) => {
          setPosts(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    ref.current?.focus();
    setPost({
      title: "",
      content: "",
    });
  }

  return (
    <div className="blogContainer">
      <div className="inputAreaContainer">
        <form className="inputContainer" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={post.title}
            onChange={handleChange}
            ref={ref}
          />
          <textarea
            name="content"
            placeholder="Take a note..."
            rows={3}
            value={post.content}
            onChange={handleChange}
          />
          <button type="submit" className="updateBtn"> {updating ? "update" : "add"}</button>
          {updating && (
            <button className="undoBtn" onClick={handleUndoUpdate}>
              Undo
            </button>
          )}
        </form>
      </div>
      {posts.map((post) => (
        <Note
          key={post._id}
          id={post._id}
          title={post.title}
          content={post.content}
          setPosts={setPosts}
          setPost={setPost}
          setUpdating={setUpdating}
        />
      ))}
    </div>
  );
};

export default BlogPage;
