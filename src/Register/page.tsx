import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../Service/api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // กัน refresh หน้า
    try {
      await api.post("/auth/register", form);
      alert("Register successful!");
      nav("/login");
    } catch (err) {
      console.log(err);
      alert("Register failed");
    }
  };

  return (
    <main className="container " style={{padding: "50px"}}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
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
        <button type="submit">Register</button>
      </form>

      <p>
        มีบัญชีแล้ว?{" "}
        <Link to="/login">
          เข้าสู่ระบบ
        </Link>
      </p>
    </main>
  );
}
