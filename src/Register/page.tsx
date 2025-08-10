import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../Service/api"
import "./register.css"


export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault() // กัน refresh หน้า
    try {
      await api.post("/auth/register", form)
      alert("Register successful!")
      nav("/login")
    } catch (err) {
      console.log(err)
      alert("Register failed")
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">เริ่มต้นการใช้งานของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              ชื่อ
            </label>
            <input
              id="name"
              name="name"
              placeholder="กรุณากรอกชื่อของคุณ"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

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

          <button type="submit" className="register-button">
            สมัครสมาชิก
          </button>
        </form>

        <div className="register-footer">
          <p className="login-text">
            มีบัญชีแล้ว?{" "}
            <Link to="/login" className="login-link">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}