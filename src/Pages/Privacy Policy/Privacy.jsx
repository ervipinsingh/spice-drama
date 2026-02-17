import { useState, useEffect, useRef } from "react";

/* ─── Google Fonts ─── */
const FontLoader = () => {
  useEffect(() => {
    if (document.getElementById("spice-fonts")) return;
    const link = document.createElement("link");
    link.id = "spice-fonts";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
};

/* ─── Tokens ─── */
const C = {
  saffron: "#E8632A",
  turmeric: "#F5A623",
  dark: "#1A1008",
  cream: "#FDF6EE",
  highlight: "#FFF3E0",
  border: "rgba(232,99,42,0.18)",
  body: "#3D2B1F",
  muted: "#7A5C4E",
  slate: "#2C3E50",
};
const grad = `linear-gradient(135deg,${C.saffron},${C.turmeric})`;

/* ─── Fade-in on scroll ─── */
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return {
    ref,
    style: {
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
    },
  };
}

/* ─── Data ─── */
const TOC = [
  { id: "s1", label: "Information We Collect" },
  { id: "s2", label: "How We Use Your Data" },
  { id: "s3", label: "Sharing & Disclosure" },
  { id: "s4", label: "Cookies & Tracking" },
  { id: "s5", label: "Data Security" },
  { id: "s6", label: "Your Rights" },
  { id: "s7", label: "Data Retention" },
  { id: "s8", label: "Children's Privacy" },
  { id: "s9", label: "Policy Updates" },
  { id: "s10", label: "Contact Us" },
];

const COLLECTED = [
  {
    icon: "👤",
    title: "Personal Details",
    desc: "Name, email, phone & delivery address when you register or order.",
  },
  {
    icon: "📦",
    title: "Order Information",
    desc: "Items ordered, history, dietary preferences & customisations.",
  },
  {
    icon: "💳",
    title: "Payment Data",
    desc: "Transaction details via secure gateways. We never store raw card numbers.",
  },
  {
    icon: "📍",
    title: "Location Data",
    desc: "Delivery address & approximate location for accurate delivery.",
  },
  {
    icon: "📱",
    title: "Device & Usage Info",
    desc: "Browser type, IP address, OS & pages visited on our site or app.",
  },
  {
    icon: "💬",
    title: "Communications",
    desc: "Feedback, reviews or messages sent through our support channels.",
  },
];

const COOKIES_DATA = [
  {
    icon: "⚙️",
    title: "Essential",
    desc: "Required for login, cart & checkout. Cannot be disabled.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Help us understand usage to improve navigation & performance.",
  },
  {
    icon: "🎯",
    title: "Preferences",
    desc: "Remember your language, location & saved addresses.",
  },
  {
    icon: "📣",
    title: "Marketing",
    desc: "Used (with consent) to show relevant offers on partner platforms.",
  },
];

const RIGHTS = [
  { e: "👁️", l: "Access Your Data" },
  { e: "✏️", l: "Correct Inaccuracies" },
  { e: "🗑️", l: "Request Deletion" },
  { e: "📤", l: "Data Portability" },
  { e: "🚫", l: "Object to Processing" },
  { e: "🔕", l: "Withdraw Consent" },
  { e: "⏸️", l: "Restrict Processing" },
  { e: "📩", l: "Lodge a Complaint" },
];

/* ─── Reusable pieces ─── */
function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: grad,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "2px",
        padding: "4px 14px",
        borderRadius: 100,
        textTransform: "uppercase",
        marginBottom: 14,
      }}
    >
      {children}
    </span>
  );
}

function SectionNum({ n }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: C.saffron,
        marginBottom: 4,
      }}
    >
      Section {String(n).padStart(2, "0")}
    </div>
  );
}

function SectionIcon({ emoji }) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        background: grad,
        boxShadow: "0 4px 14px rgba(232,99,42,.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}

function CardGrid({ items }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
        gap: 12,
        margin: "20px 0",
      }}
    >
      {items.map((c, i) => {
        const [h, setH] = useState(false);
        return (
          <div
            key={i}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 13,
              padding: "15px 17px",
              display: "flex",
              gap: 11,
              alignItems: "flex-start",
              transition: "box-shadow .2s,transform .2s",
              boxShadow: h ? "0 5px 22px rgba(232,99,42,.13)" : "none",
              transform: h ? "translateY(-2px)" : "none",
            }}
          >
            <span style={{ fontSize: 21, flexShrink: 0, marginTop: 1 }}>
              {c.icon}
            </span>
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: C.slate,
                  marginBottom: 4,
                }}
              >
                {c.title}
              </strong>
              <span style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
                {c.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Bullets({ items }) {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: "14px 0",
        display: "flex",
        flexDirection: "column",
        gap: 9,
      }}
    >
      {items.map((t, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            fontSize: 15,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              color: C.saffron,
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            →
          </span>
          <span dangerouslySetInnerHTML={{ __html: t }} />
        </li>
      ))}
    </ul>
  );
}

function Note({ emoji, label, children }) {
  return (
    <div
      style={{
        background: C.highlight,
        border: "1px solid rgba(232,99,42,.22)",
        borderRadius: 13,
        padding: "18px 22px",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: C.saffron,
          fontSize: 11.5,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: 7,
        }}
      >
        {emoji} {label}
      </div>
      <p style={{ fontSize: 14.5, color: C.body }}>{children}</p>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "48px 0",
        color: "rgba(232,99,42,.35)",
        fontSize: 12,
        letterSpacing: "4px",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(232,99,42,.2),transparent)",
        }}
      />
      ❋
      <div
        style={{
          flex: 1,
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(232,99,42,.2),transparent)",
        }}
      />
    </div>
  );
}

function Section({ id, n, icon, title, children }) {
  const { ref, style } = useFadeIn(0);
  return (
    <section
      id={id}
      ref={ref}
      style={{ ...style, marginBottom: 50, scrollMarginTop: 28 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 15,
          marginBottom: 22,
        }}
      >
        <SectionIcon emoji={icon} />
        <div style={{ paddingTop: 4 }}>
          <SectionNum n={n} />
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(19px,2.8vw,25px)",
              fontWeight: 700,
              color: C.slate,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
        </div>
      </div>
      <div style={{ fontSize: 15, color: C.body, lineHeight: 1.78 }}>
        {children}
      </div>
    </section>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <header
      style={{
        position: "relative",
        background: C.dark,
        padding: "56px 24px 54px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%,rgba(245,166,35,.18) 0%,transparent 60%),radial-gradient(ellipse 55% 75% at 85% 30%,rgba(232,99,42,.22) 0%,transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 13,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 10,
          letterSpacing: 13,
          color: "rgba(245,166,35,.22)",
          pointerEvents: "none",
        }}
      >
        ✦ ❋ ✦ ❋ ✦ ❋ ✦ ❋ ✦
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "inline-block",
            background: grad,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            padding: "6px 18px",
            borderRadius: 100,
            marginBottom: 20,
            boxShadow: "0 4px 16px rgba(232,99,42,.4)",
          }}
        >
          Cloud Kitchen
        </div>
        <div
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(36px,8vw,66px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-1px",
          }}
        >
          Spice Drama
          <div
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "0.6em",
              letterSpacing: "2px",
              background: `linear-gradient(90deg,${C.turmeric},${C.saffron})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Restaurant &amp; Cloud Kitchen
          </div>
        </div>
        <p
          style={{
            marginTop: 16,
            color: "rgba(255,255,255,.5)",
            fontSize: 14,
            letterSpacing: "1px",
            fontWeight: 300,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,.78)", fontWeight: 400 }}>
            Privacy Policy
          </strong>
          &nbsp;·&nbsp; Protecting Your Data, Flavoring Your Trust
        </p>
      </div>
    </header>
  );
}

/* ─── TOC ─── */
function TableOfContents() {
  const [hov, setHov] = useState(null);
  const { ref, style } = useFadeIn(300);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        maxWidth: 840,
        margin: "-24px auto 0",
        padding: "0 18px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "28px 30px",
          boxShadow:
            "0 8px 38px rgba(28,16,8,.11),0 2px 8px rgba(232,99,42,.05)",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "'Playfair Display',serif",
            fontSize: 16,
            fontWeight: 700,
            color: C.saffron,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: 16,
          }}
        >
          Quick Navigation{" "}
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 8,
          }}
        >
          {TOC.map((t, i) => (
            <button
              key={t.id}
              onClick={() =>
                document
                  .getElementById(t.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 9,
                border: `1px solid ${hov === i ? "rgba(232,99,42,.2)" : "transparent"}`,
                background: hov === i ? C.highlight : "transparent",
                color: hov === i ? C.saffron : C.body,
                fontSize: 13.5,
                cursor: "pointer",
                transition: "all .18s",
                textAlign: "left",
                fontFamily: "'Lato',sans-serif",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: grad,
                  color: "#fff",
                  fontSize: 10.5,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Contact Card ─── */
function ContactCard() {
  const { ref, style } = useFadeIn(0);
  const [hov, setHov] = useState(null);
  const btns = [
    { i: "📧", t: "order@spicedrama.com", h: "mailto:order@spicedrama.com" },
    { i: "📞", t: "+91 9716159710", h: "tel:+919716159710" },
  ];
  return (
    <div ref={ref} style={{ ...style, scrollMarginTop: 28 }} id="s10">
      <div
        style={{
          background: C.dark,
          borderRadius: 20,
          padding: "38px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 25% 40%,rgba(245,166,35,.14) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 80% 70%,rgba(232,99,42,.18) 0%,transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 26,
              color: "#fff",
              marginBottom: 10,
            }}
          >
            Questions? Let's Talk
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: 14.5,
              marginBottom: 26,
            }}
          >
            Our Privacy Team is here to help. We respond within 2 business days.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {btns.map((b, i) => (
              <a
                key={i}
                href={b.h}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: hov === i ? grad : "rgba(255,255,255,.08)",
                  border: `1px solid ${hov === i ? "transparent" : "rgba(255,255,255,.15)"}`,
                  borderRadius: 100,
                  padding: "11px 20px",
                  color: "#fff",
                  fontSize: 13.5,
                  textDecoration: "none",
                  transition: "all .2s",
                  transform: hov === i ? "translateY(-2px)" : "none",
                  boxShadow:
                    hov === i ? "0 5px 18px rgba(232,99,42,.35)" : "none",
                }}
              >
                {b.i} &nbsp;{b.t}
              </a>
            ))}
          </div>
          <p style={{ marginTop: 22, fontSize: 13 }}>
            <strong style={{ color: "rgba(255,255,255,.75)" }}>
              Spice Drama Cloud Kitchen
            </strong>
            <br />
            <span style={{ color: "rgba(255,255,255,.38)" }}>
              Akash Nagar, Ghaziabad, Uttar Pradesh — 201015, India
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   ROOT
══════════════════════════════════════ */
export default function App() {
  return (
    <div
      style={{
        fontFamily: "'Lato',sans-serif",
        background: C.cream,
        minHeight: "100vh",
      }}
    >
      <FontLoader />
      <style>{`
        .privacy-wrapper *,
        .privacy-wrapper *::before,
        .privacy-wrapper *::after {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }
`}</style>

      <Hero />
      <TableOfContents />

      <main
        style={{ maxWidth: 840, margin: "44px auto", padding: "0 18px 80px" }}
      >
        {/* Intro */}
        {(() => {
          const { ref, style } = useFadeIn(100);
          return (
            <div
              ref={ref}
              style={{
                ...style,
                background: "linear-gradient(135deg,#fff8f0,#fff3e4)",
                borderLeft: `4px solid ${C.saffron}`,
                borderRadius: "0 13px 13px 0",
                padding: "20px 26px",
                marginBottom: 48,
                fontSize: 15,
                lineHeight: 1.76,
              }}
            >
              <Pill>Last Updated: February 2026</Pill>
              <p>
                Welcome to <strong>Spice Drama Cloud Kitchen</strong>. We
                believe great food starts with great trust — and that includes
                how we handle your personal information. This Privacy Policy
                explains clearly and simply what data we collect, why we collect
                it, and how we protect it.
              </p>
              <p style={{ marginTop: 10 }}>
                By placing an order, visiting our website, or using our app, you
                agree to the practices described here. If you have any
                questions, we're always just a message away.
              </p>
            </div>
          );
        })()}

        {/* S1 */}
        <Section id="s1" n={1} icon="🧾" title="Information We Collect">
          <p>
            We collect only what's necessary to serve you the best possible
            experience — from the first click to the final bite.
          </p>
          <CardGrid items={COLLECTED} />
        </Section>
        <Divider />

        {/* S2 */}
        <Section id="s2" n={2} icon="🍛" title="How We Use Your Data">
          <p>
            Your information helps us cook up the best experience for you. We
            use it to:
          </p>
          <Bullets
            items={[
              "Process and deliver your orders accurately and on time.",
              "Send order confirmations, delivery updates, and receipts.",
              "Personalise your experience — remembering favourite dishes and past orders.",
              "Improve our menu, service, and app based on usage patterns and feedback.",
              "Communicate promotional offers and seasonal specials (only if opted in).",
              "Comply with legal and regulatory obligations for food businesses.",
              "Detect, investigate, and prevent fraudulent transactions and abuse.",
            ]}
          />
          <Note emoji="🔒" label="Our Promise">
            We will never sell your personal data to third parties for their own
            marketing purposes. Your information is used solely to serve and
            improve your experience with Spice Drama.
          </Note>
        </Section>
        <Divider />

        {/* S3 */}
        <Section id="s3" n={3} icon="🤝" title="Sharing & Disclosure">
          <p>
            We share your data only when necessary and only with trusted
            partners bound by strict confidentiality agreements:
          </p>
          <Bullets
            items={[
              "<strong>Delivery Partners</strong> — Name, address & contact shared with riders or platforms (Zomato, Swiggy, Dunzo) solely to fulfil your order.",
              "<strong>Payment Processors</strong> — Secure gateways (Razorpay / Stripe) operate under their own privacy policies and comply with PCI-DSS standards.",
              "<strong>Technology Providers</strong> — Cloud, analytics, and communication tools we use are bound by data-processing agreements.",
              "<strong>Legal Authorities</strong> — We may disclose information when required by law, court order, or to protect safety.",
            ]}
          />
        </Section>
        <Divider />

        {/* S4 */}
        <Section id="s4" n={4} icon="🍪" title="Cookies & Tracking">
          <p>
            Our website and app use cookies to make your experience smoother and
            more personal:
          </p>
          <CardGrid items={COOKIES_DATA} />
          <p>
            You can manage preferences via your browser settings or our cookie
            consent banner. Disabling essential cookies may affect site
            functionality.
          </p>
        </Section>
        <Divider />

        {/* S5 */}
        <Section id="s5" n={5} icon="🛡️" title="Data Security">
          <p>
            We take the security of your personal information seriously. Spice
            Drama employs industry-standard safeguards including:
          </p>
          <Bullets
            items={[
              "<strong>SSL / TLS Encryption</strong> across all data transmissions on our site and app.",
              "<strong>Secure Payment Processing</strong> via PCI-DSS compliant gateways — no raw card storage.",
              "<strong>Access Controls</strong> ensuring only authorised personnel can view sensitive data.",
              "<strong>Regular Security Audits</strong> and vulnerability assessments of our platforms.",
              "<strong>Data Minimisation</strong> — we only collect what is truly necessary.",
            ]}
          />
          <Note emoji="⚠️" label="Important Note">
            While we do everything reasonably possible to protect your data, no
            internet transmission is 100% secure. Use strong passwords and never
            share your account credentials. If you suspect unauthorised
            activity, contact us immediately.
          </Note>
        </Section>
        <Divider />

        {/* S6 */}
        <Section id="s6" n={6} icon="⚖️" title="Your Rights">
          <p>
            You are in control of your personal data. Under applicable privacy
            laws, you have the following rights:
          </p>
          {/* Rights grid */}
          {(() => {
            const [hov, setHov] = useState(null);
            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
                  gap: 10,
                  margin: "18px 0",
                }}
              >
                {RIGHTS.map((r, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHov(i)}
                    onMouseLeave={() => setHov(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "12px 15px",
                      background: hov === i ? C.highlight : "#fff",
                      border: `1.5px solid ${hov === i ? C.saffron : C.border}`,
                      borderRadius: 11,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: hov === i ? C.saffron : C.slate,
                      transition: "all .18s",
                      cursor: "default",
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{r.e}</span> {r.l}
                  </div>
                ))}
              </div>
            );
          })()}
          <p>
            To exercise any of these rights, email{" "}
            <strong>order@spicedrama.com</strong>. We'll respond within{" "}
            <strong>30 days</strong>. Some rights may be limited where we have a
            legal obligation to retain data.
          </p>
        </Section>
        <Divider />

        {/* S7 */}
        <Section id="s7" n={7} icon="🗓️" title="Data Retention">
          <p>
            We retain your data only for as long as necessary or as required by
            law:
          </p>
          <Bullets
            items={[
              "<strong>Account Data</strong> — retained for the duration of your active account, plus 2 years after closure.",
              "<strong>Order Records</strong> — kept for up to 7 years to comply with financial and tax regulations.",
              "<strong>Marketing Preferences</strong> — retained until you unsubscribe or withdraw consent.",
              "<strong>Device & Analytics Data</strong> — anonymised and aggregated after 13 months.",
            ]}
          />
          <p style={{ marginTop: 12 }}>
            Once your data is no longer needed, we securely delete or anonymise
            it in line with our internal disposal policy.
          </p>
        </Section>
        <Divider />

        {/* S8 */}
        <Section id="s8" n={8} icon="👶" title="Children's Privacy">
          <p>
            Our services are not directed to children under the age of{" "}
            <strong>13 years</strong>. We do not knowingly collect personal
            information from children. If we become aware that a child has
            provided us with data without verifiable parental consent, we will
            delete it promptly.
          </p>
          <p style={{ marginTop: 12 }}>
            If you are a parent or guardian and believe your child has shared
            personal information with us, please contact{" "}
            <strong>privacy@spicedrama.in</strong> and we'll take immediate
            action.
          </p>
        </Section>
        <Divider />

        {/* S9 */}
        <Section id="s9" n={9} icon="🔄" title="Policy Updates">
          <p>
            We may update this Privacy Policy to reflect changes in our
            services, legal requirements, or industry best practices. When we
            make significant changes, we will:
          </p>
          <Bullets
            items={[
              "Post the updated policy with a revised 17-02-2026 date.",
              "Send an email notification (for account holders) for material changes.",
              "Display a prominent notice on our site or app for 30 days following the update.",
            ]}
          />
          <p style={{ marginTop: 12 }}>
            Continuing to use Spice Drama's services after an update constitutes
            acceptance of the revised policy.
          </p>
        </Section>
        <Divider />

        {/* S10 */}
        <ContactCard />
      </main>

      {/* Footer */}
      <footer
        style={{
          background: C.dark,
          padding: "22px 24px",
          textAlign: "center",
          color: "rgba(255,255,255,.33)",
          fontSize: 13,
        }}
      >
        © 2026 &nbsp;
        <span style={{ color: C.saffron, fontStyle: "italic" }}>
          Spice Drama Cloud Kitchen
        </span>
        &nbsp; · &nbsp;Privacy Policy &nbsp;·&nbsp; Terms of Service
        &nbsp;·&nbsp; Refund Policy
      </footer>
    </div>
  );
}
