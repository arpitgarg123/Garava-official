import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAppointment } from "../../features/appointment/api.js";
import BackButton from "../../components/BackButton.jsx";

const serviceOptions = [
  { value: "fragrance_consultation", label: "Fragrance consultation" },
  { value: "jewellery_consultation", label: "jewellery consultation" },
  { value: "custom_order", label: "Custom order" },
  { value: "general", label: "General inquiry" },
];

function toMinDateTimeLocal() {
  // Round up to next 15 minutes for a nicer UX
  const d = new Date();
  d.setMinutes(d.getMinutes() + 15 - (d.getMinutes() % 15), 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

const BookAnAppointment = () => {
  const navigate = useNavigate();
  const authUser = useSelector((s) => s.auth?.user);
  const [form, setForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: "",
    serviceType: "",
    appointmentAtLocal: "",
    description: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [message, setMessage] = useState("");

  const minLocal = useMemo(() => toMinDateTimeLocal(), []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // Basic validations
      if (!form.name || !form.email || !form.phone || !form.serviceType || !form.appointmentAtLocal) {
        throw new Error("Please fill all required fields.");
      }
      const when = new Date(form.appointmentAtLocal);
      if (Number.isNaN(when.getTime()) || when < new Date()) {
        throw new Error("Please select a future date and time.");
      }

      // Send ISO time, and map description -> notes
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        serviceType: form.serviceType,
        appointmentAt: when.toISOString(),
        notes: form.description.trim(),
      };

      await createAppointment(payload);

      setStatus("succeeded");
      setMessage("Appointment booked successfully. Redirecting…");
      // optional: clear or redirect
      setTimeout(() => navigate("/", { replace: true }), 1200);
    } catch (err) {
      setStatus("failed");
      setMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to book appointment. Please try again."
      );
    }
  };

  return (
    <>
     <div className="sticky top-30 z-10 mb-3 max-md:mb-0 max-md:top-10">
        <BackButton />
      </div>
   
    <div className="max-w-xl mx-auto mt-30 max-md:mt-0 max-md:px-4 p-6">
      
      <h1 className="text-2xl font-semibold mb-4">Book an appointment</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            className="w-full border p-2 rounded"
            placeholder="Full name"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            className="w-full border p-2 rounded"
            placeholder="Phone"
            pattern="^[0-9+\-\s()]{7,}$"
            title="Enter a valid phone number"
            required
          />
          <select
            name="serviceType"
            value={form.serviceType}
            onChange={onChange}
            className="w-full border p-2 rounded bg-white"
            required
          >
            <option value="" disabled>
              Select service type
            </option>
            {serviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-700">Preferred date & time</label>
          <input
            name="appointmentAtLocal"
            type="datetime-local"
            value={form.appointmentAtLocal}
            onChange={onChange}
            className="w-full border p-2 rounded"
            min={minLocal}
            required
          />
        </div>

        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full border p-2 resize-none rounded min-h-[120px]"
            placeholder="Describe what you’re looking for (optional)"
          />
          <p className="mt-1 text-xs text-gray-500">Note: This will be sent as “notes” to our team.</p>
        </div>

        <button
          type="submit"
          className="btn-black w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Booking..." : "Book appointment"}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm ${status === "failed" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}
    </div>
     </>
  );
}

export default BookAnAppointment