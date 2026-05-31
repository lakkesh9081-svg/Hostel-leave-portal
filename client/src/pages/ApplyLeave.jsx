import { useState } from "react";

export default function ApplyLeave() {

  const [form, setForm] = useState({
    studentName: "",
    reason: "",
    fromDate: "",
    toDate: "",
    parentPhone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.studentName || !form.parentPhone) {
      setError("Student name and parent phone are required.");
      return;
    }

    let normalizedPhone = form.parentPhone.trim();
    const digits = normalizedPhone.replace(/[^0-9]/g, "");
    if (/^[0-9]{10}$/.test(digits)) {
      normalizedPhone = `+91${digits}`;
    } else if (/^0[0-9]{10}$/.test(digits)) {
      normalizedPhone = `+91${digits.slice(1)}`;
    }

    if (!/^\+[0-9]{10,15}$/.test(normalizedPhone)) {
      setError("Parent phone must be a valid number, e.g. 8667419081 or +919876543210.");
      return;
    }

    try {
      const payload = { ...form, parentPhone: normalizedPhone };
      const response = await fetch(
        "http://localhost:5000/api/leave/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Something went wrong while applying leave.");
        return;
      }

      setSuccess(data.message);
      setForm({ studentName: "", reason: "", fromDate: "", toDate: "", parentPhone: "" });
    } catch (err) {
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: "#d63031", marginBottom: "1rem" }}>{error}</div>}
      {success && <div style={{ color: "#00b894", marginBottom: "1rem" }}>{success}</div>}

      <input
        placeholder="Student Name"
        value={form.studentName}
        onChange={(e)=>
          setForm({...form, studentName:e.target.value})
        }
      />

      <input
        placeholder="Reason"
        value={form.reason}
        onChange={(e)=>
          setForm({...form, reason:e.target.value})
        }
      />

      <input
        type="date"
        value={form.fromDate}
        onChange={(e)=>
          setForm({...form, fromDate:e.target.value})
        }
      />

      <input
        type="date"
        value={form.toDate}
        onChange={(e)=>
          setForm({...form, toDate:e.target.value})
        }
      />

      <input
        placeholder="Parent Phone (8667419081 or +919867412345)"
        value={form.parentPhone}
        onChange={(e)=>
          setForm({...form, parentPhone:e.target.value})
        }
      />

      <button type="submit">
        Apply Leave
      </button>

    </form>
  );
}