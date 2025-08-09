import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../Service/api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // กัน refresh หน้า
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);

      alert("Login success");
      nav("/events");
    } catch (err) {
      console.log(err);
      alert("Login failed User OR Password incorrect");
    }
  }; 

  return (
    <main className="container" style={{padding: "50px"}}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>

      <p>
        ยังไม่มีบัญชี?{" "}
        <Link to="/register">
          สมัครที่นี่
        </Link>
      </p>
    </main>
  );
}
