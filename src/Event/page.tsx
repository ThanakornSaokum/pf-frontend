import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ใช้ navigate เพื่อเด้งกลับหน้า login
import { api } from "../Service/api";
import type { Event } from "../types";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    maxParticipants: 0,
    eventDate: "",
  });
  const [userId, setUserId] = useState("");
  const [mode, setMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [currentEventId, setCurrentEventId] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  

  const fetchEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data.events);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
      setUserName(payload.name);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/events", form );
      resetForm();
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Create event failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.patch("/events", { id: currentEventId, ...form });
      resetForm();
      fetchEvents();
    } catch (err) {
      console.log(err);
      alert("Update event failed");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      maxParticipants: 0,
      eventDate: "",
    });
    setMode("CREATE");
    setCurrentEventId("");
  };

  // const handleJoin = async (id: string) => {
  //   await api.post("/events/join", { eventId: id, userId });
  //   console.log(userId)
  //   fetchEvents();
  // };

  // const handleCancel = async (id: string) => {
  //   await api.post("/events/cancel", { eventId: id, userId });
  //   fetchEvents();
  // };

  const handleDelete = async (id: string) => {
    await api.delete("/events", { data: { id } });
    fetchEvents();
  };

  const handleEditClick = (ev: Event) => {
    setForm({
      title: ev.title,
      description: ev.description,
      imageUrl: ev.imageUrl || "",
      maxParticipants: ev.maxParticipants,
      eventDate: ev.eventDate.split("T")[0], // ตัดเวลาออกสำหรับ input date
    });
    setCurrentEventId(ev.id);
    setMode("EDIT");
  };

    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // กลับไปหน้า login
  };

    const handleToggleDone = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/events/done`, { id, isDone: !currentStatus });
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  return (
    <main className="container">

       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>All Events</h2>
        <p>Welcome, {userName}</p>
        <button onClick={handleLogout} style={{ background: "red", color: "white", margin: "40px"}}>
          Logout
        </button>
      </header>

      <section>
        <h3>{mode === "CREATE" ? "Create Event" : "Edit Event"}</h3>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Participants"
          value={form.maxParticipants}
          onChange={(e) =>
            setForm({ ...form, maxParticipants: Number(e.target.value) })
          }
        />
        <input
          type="date"
          value={form.eventDate}
          onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
        />

        {mode === "CREATE" ? (
          <button onClick={handleCreate}>Create</button>
        ) : (
          <>
            <button onClick={handleUpdate} style={{marginRight: "20px"}}>Update</button>
            <button onClick={resetForm} className="secondary">
              Cancel
            </button>
          </>
        )}
      </section>

      <section>
  {events
    .slice()
    .sort((a, b) => {
      if (a.createBy === userId && b.createBy !== userId) return -1;
      if (a.createBy !== userId && b.createBy === userId) return 1;
      return 0;
    })
    .map((ev) => (
      <article
        key={ev.id}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "16px",
          //backgroundColor: "#fff",
        }}
      >
        {/* รูปภาพด้านซ้าย */}
        {ev.imageUrl && (
          <img
            src={ev.imageUrl}
            alt={ev.title}
            style={{
              width: "200px",
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        )}

        {/* ข้อมูลด้านขวา */}
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: "0 0 8px" }}>{ev.title}</h4>
          <p style={{ margin: "0 0 8px" }}>{ev.description}</p>
          <p style={{ margin: "0 0 8px" }}>
            {new Date(ev.eventDate).toLocaleDateString()}
          </p>

          {/* ปุ่มเฉพาะเจ้าของ */}
          {ev.createBy === userId ? (
            <>
              <button
                style={{ marginRight: "10px" }}
                onClick={() => handleEditClick(ev)}
              >
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(ev.id)}>🗑️ Delete</button>
              <button
                style={{
                  background: ev.isDone ? "green" : "orange",
                  color: "white",
                  marginLeft: "10px",
                }}
                onClick={() => handleToggleDone(ev.id, ev.isDone)}
              >
                {ev.isDone ? "✅ Done" : "⏳ Not Done"}
              </button>
            </>
          ) : (
            <>{ev.isDone ? "✅ Done" : "⏳ Not Done"}</>
          )}
        </div>
      </article>
    ))}
</section>

    </main>
 );
}