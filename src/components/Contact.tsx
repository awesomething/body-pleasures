import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError("");
  
    try {
      const now = new Date();
  
      const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = now.toTimeString().split(" ")[0]; // HH:mm:ss
  
      const res = await fetch(
        "https://thebrain02.app.n8n.cloud/webhook/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            source: "msv-body-pleasures-react-app",
            sentAt: now.toISOString(),
            date,
            time,
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("Webhook returned an error");
      }
  
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  
    setSending(false);
  }  

  return (
    <section id="contact">
      <div className="section-header">
        <h2>Contact Us</h2>
        <p>
          We'd love to hear from you! Reach out for inquiries, custom orders,
          or feedback about our artisan body pleasures.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message..."
            required
          ></textarea>
        </div>

        <button type="submit" className="cta-button" disabled={sending}>
          {sending ? "Sending..." : "Send Message"}
        </button>

        {success && (
          <div className="success-message show">Message sent successfully!</div>
        )}

        {error && (
          <div className="success-message" style={{ background: "red" }}>
            {error}
          </div>
        )}
      </form>
    </section>
  );
}
