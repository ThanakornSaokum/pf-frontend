import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../Service/api"
import type { Event } from "../types"
import "./event.css"

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    maxParticipants: 0,
    eventDate: "",
  })
  const [userId, setUserId] = useState("")
  const [mode, setMode] = useState<"CREATE" | "EDIT">("CREATE")
  const [currentEventId, setCurrentEventId] = useState("")
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  const fetchEvents = async () => {
    const res = await api.get("/events")
    setEvents(res.data.events)
  }

  const fetchUser = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setUserId(payload.id)
      setUserName(payload.name)
    }
  }

  const handleCreate = async () => {
    try {
      await api.post("/events", form)
      resetForm()
      fetchEvents()
    } catch (err) {
      console.log(err)
      alert("Create event failed")
    }
  }

  const handleUpdate = async () => {
    try {
      await api.patch("/events", { id: currentEventId, ...form })
      resetForm()
      fetchEvents()
    } catch (err) {
      console.log(err)
      alert("Update event failed")
    }
  }

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      maxParticipants: 0,
      eventDate: "",
    })
    setMode("CREATE")
    setCurrentEventId("")
  }

  const handleDelete = async (id: string) => {
    await api.delete("/events", { data: { id } })
    fetchEvents()
  }

  const handleEditClick = (ev: Event) => {
    setForm({
      title: ev.title,
      description: ev.description,
      imageUrl: ev.imageUrl || "",
      maxParticipants: ev.maxParticipants,
      eventDate: ev.eventDate.split("T")[0],
    })
    setCurrentEventId(ev.id)
    setMode("EDIT")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleToggleDone = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/events/done`, { id, isDone: !currentStatus })
      fetchEvents()
    } catch (err) {
      console.error(err)
      alert("Failed to update status")
    }
  }

  useEffect(() => {
    fetchUser()
    fetchEvents()
  }, [])

  return (
    <div className="events-container">
      <header className="events-header">
        <div className="header-content">
          <h1 className="page-title">Events</h1>
          <div className="header-right">
            <p className="welcome-text">ยินดีต้อนรับ, {userName}</p>
            <button onClick={handleLogout} className="logout-button">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <section className="form-section">
          <div className="form-card">
            <h2 className="form-title">{mode === "CREATE" ? "สร้างกิจกรรมใหม่" : "แก้ไขกิจกรรม"}</h2>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">ชื่อกิจกรรม</label>
                <input
                  className="form-input"
                  placeholder="กรุณากรอกชื่อกิจกรรม"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">คำอธิบาย</label>
                <input
                  className="form-input"
                  placeholder="กรุณากรอกคำอธิบาย"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL รูปภาพ</label>
                <input
                  className="form-input"
                  placeholder="กรุณากรอก URL รูปภาพ"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">จำนวนผู้เข้าร่วมสูงสุด</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="จำนวนผู้เข้าร่วม"
                  value={form.maxParticipants}
                  onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">วันที่จัดกิจกรรม</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              {mode === "CREATE" ? (
                <button onClick={handleCreate} className="primary-button">
                  สร้างกิจกรรม
                </button>
              ) : (
                <div className="edit-actions">
                  <button onClick={handleUpdate} className="primary-button">
                    อัปเดต
                  </button>
                  <button onClick={resetForm} className="secondary-button">
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="events-section">
          <h2 className="section-title">รายการกิจกรรม</h2>
          <div className="events-grid">
            {events
              .slice()
              .sort((a, b) => {
                if (a.createBy === userId && b.createBy !== userId) return -1
                if (a.createBy !== userId && b.createBy === userId) return 1
                return 0
              })
              .map((ev) => (
                <article key={ev.id} className="event-card">
                  <div className="card-content">
                    {/* Left Column - Image */}
                    <div className="image-column">
                      {ev.imageUrl ? (
                        <img src={ev.imageUrl || "/placeholder.svg"} alt={ev.title} className="event-image" />
                      ) : (
                        <div className="image-placeholder">
                          <span>ไม่มีรูปภาพ</span>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Content */}
                    <div className="content-column">
                      <div className="event-header">
                        <h3 className="event-title">{ev.title}</h3>
                        <div className={`status-badge ${ev.isDone ? "done" : "pending"}`}>
                          {ev.isDone ? "✅ เสร็จแล้ว" : "⏳ ยังไม่เสร็จ"}
                        </div>
                      </div>

                      <p className="event-description">{ev.description}</p>

                      <div className="event-meta">
                        <span className="event-date">📅 {new Date(ev.eventDate).toLocaleDateString("th-TH")}</span>
                        <span className="event-participants">👥 สูงสุด {ev.maxParticipants} คน</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="event-actions">
                        {ev.createBy === userId ? (
                          <>
                            <button className="action-button edit-button" onClick={() => handleEditClick(ev)}>
                              ✏️ แก้ไข
                            </button>
                            <button className="action-button delete-button" onClick={() => handleDelete(ev.id)}>
                              🗑️ ลบ
                            </button>
                            <button
                              className={`action-button status-button ${ev.isDone ? "done" : "pending"}`}
                              onClick={() => handleToggleDone(ev.id, ev.isDone)}
                            >
                              {ev.isDone ? "↩️ ยกเลิกเสร็จ" : "✅ ทำเสร็จ"}
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}