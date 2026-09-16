import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid var(--border)",
    borderRadius: "2px",
    fontSize: "0.88rem",
    color: "var(--text-dark)",
    background: "white",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    marginBottom: "6px",
    color: "var(--text-dark)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--text-dark) 0%, var(--blue-deep) 100%)",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "var(--gold)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Lorem ipsum dolor
        </span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            color: "white",
            marginTop: "0.75rem",
          }}
        >
          Contactez-nous
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1rem",
            maxWidth: 520,
            margin: "1rem auto 0",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </section>

      <section style={{ padding: "80px 24px" }}>
        <div
          className="max-w-7xl mx-auto"
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", alignItems: "start" }}
        >
          {/* Info */}
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Lorem ipsum dolor sit
            </h2>

            {[
              {
                icon: "📍",
                label: "Adresse",
                value: "123 Lorem Ipsum Avenue\nBP1203 Dolor Sit, Bénin",
              },
              {
                icon: "📞",
                label: "Téléphone",
                value: "+229 (0)1 23 45 67 89",
              },
              {
                icon: "✉️",
                label: "Email",
                value: "contact@fmconsultingplus.com",
              },
              {
                icon: "🕐",
                label: "Horaires",
                value: "Lorem – Ipsum\n9h00 – 18h30",
              },
            ].map((info) => (
              <div
                key={info.label}
                style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
              >
                <span style={{ fontSize: "1.2rem", marginTop: "2px" }}>{info.icon}</span>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray-mid)", marginBottom: "4px" }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text-dark)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {info.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "2.5rem",
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    color: "var(--blue-deep)",
                    marginBottom: "1rem",
                  }}
                >
                  Lorem ipsum envoyé !
                </h3>
                <p style={{ color: "var(--gray-mid)", lineHeight: 1.75 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", company: "", subject: "", message: "" });
                  }}
                  style={{
                    marginTop: "1.5rem",
                    background: "var(--blue-deep)",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: "2px",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Lorem ipsum nouveau
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    marginBottom: "2rem",
                    color: "var(--text-dark)",
                  }}
                >
                  Lorem ipsum dolor sit amet
                </h2>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label style={labelStyle}>Nom complet *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Lorem Ipsum"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue-mid)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Adresse email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="lorem@ipsum.fr"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue-mid)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label style={labelStyle}>Entreprise</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Lorem Ipsum SAS"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue-mid)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Sujet *</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      style={{ ...inputStyle, appearance: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--blue-mid)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    >
                      <option value="">Lorem ipsum dolor</option>
                      <option value="s1">Lorem ipsum dolor sit</option>
                      <option value="s2">Consectetur adipiscing elit</option>
                      <option value="s3">Sed do eiusmod tempor</option>
                      <option value="s4">Ut enim ad minim veniam</option>
                      <option value="s5">Quis nostrud exercitation</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--blue-mid)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p style={{ color: "var(--gray-mid)", fontSize: "0.75rem" }}>
                    * Champs obligatoires. Lorem ipsum dolor sit amet.
                  </p>
                  <button
                    type="submit"
                    style={{
                      background: "var(--blue-deep)",
                      color: "white",
                      padding: "14px 36px",
                      borderRadius: "2px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      letterSpacing: "0.06em",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      ((e.target as HTMLElement).style.background = "var(--blue-mid)")
                    }
                    onMouseOut={(e) =>
                      ((e.target as HTMLElement).style.background = "var(--blue-deep)")
                    }
                  >
                    Envoyer le message →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section style={{ background: "var(--blue-deep)", padding: "60px 24px" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: "", title: "Lorem ipsum dolor", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt." },
            { icon: "", title: "Consectetur adipiscing", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea." },
            { icon: "", title: "Sed do eiusmod", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat." },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "white",
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
