import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setSuccess(false);
  
    try {
      const now = new Date();
  
      const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = now.toTimeString().split(" ")[0]; // HH:mm:ss
  
      const res = await fetch(
        "https://thebrain02.app.n8n.cloud/webhook/newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            source: "msv-body-pleasures-react-app",
            subscribedAt: now.toISOString(),
            date,
            time,
          }),
        }
      );
  
      if (!res.ok) {
        throw new Error("Webhook returned an error");
      }
  
      setSuccess(true);
      setEmail("");
  
      // Hide popup message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  
    setSending(false);
  }
  

  return (
    <section id="newsletter">
      <div className="newsletter">
        <h2>Stay Updated</h2>
        <p>Join our newsletter for exclusive updates and offers.</p>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Subscribe"}
          </button>
        </form>

        {success && (
          <div className="success-message show">
            Successfully subscribed!
          </div>
        )}

        {error && (
          <div className="success-message" style={{ background: "red" }}>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
