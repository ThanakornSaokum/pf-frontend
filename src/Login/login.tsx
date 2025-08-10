import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../Service/api"
import "./login.css"

export default function Login() {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault() // กัน refresh หน้า
    try {
      const res = await api.post("/auth/login", form)
      localStorage.setItem("token", res.data.token)
      alert("Login success")
      nav("/events")
    } catch (err) {
      console.log(err)
      alert("Login failed User OR Password incorrect")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">ยินดีต้อนรับ</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              placeholder="กรุณากรอกอีเมลของคุณ"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="กรุณากรอกรหัสผ่านของคุณ"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="login-button">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="login-footer">
          <p className="register-text">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="register-link">
              สมัครที่นี่
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
