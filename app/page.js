"use client";
import { useState } from "react";

const DEFAULT_CATEGORIES = [
  { id: "emotion-regulation", label: "Emotion Regulation", emoji: "🌊", color: "#4A90D9" },
  { id: "anxiety", label: "Anxiety", emoji: "🌀", color: "#7B68EE" },
  { id: "anger", label: "Anger", emoji: "🔥", color: "#E05C2A" },
  { id: "time-management", label: "Time Management", emoji: "⏰", color: "#2ECC71" },
  { id: "poor-focus", label: "Poor Focus", emoji: "🎯", color: "#F39C12" },
  { id: "impulse-control", label: "Low Impulse Control", emoji: "⚡", color: "#E91E8C" },
  { id: "excessive-crying", label: "Excessive Crying / Whining", emoji: "💧", color: "#00BCD4" },
  { id: "attachment-anxiety", label: "Attachment Anxiety", emoji: "🤝", color: "#9C27B0" },
  { id: "somatic-complaints", label: "Somatic Complaints", emoji: "🧠", color: "#FF7043" },
  { id: "things-unfair", label: "Things Are Unfair", emoji: "⚖️", color: "#26A69A" },
  { id: "sibling-issues", label: "Sibling Issues", emoji: "👫", color: "#EC407A" },
];

const MATERIAL_TYPES = [
  { id: "worksheet", label: "Worksheet / Activity", icon: "📝" },
  { id: "coping", label: "Coping Strategies", icon: "🛠️" },
  { id: "game", label: "Game / Intervention", icon: "🎮" },
];

function LoadingDots({ color }) {
  return (
    <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 9, height: 9, borderRadius: "50%",
          background: color || "#4A90D9",
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

export default function TherapyBinder() {
  const [categories] = useState(DEFAULT_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);

  const cat = categories.find((c) => c.id === selectedCat);
  const type = MATERIAL_TYPES.find((t) => t.id === selectedType);

  async function generate() {
    if (!selectedCat || !selectedType) return;
    setLoading(true); setError(null); setMaterial(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryLabel: cat.label, materialType: selectedType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMaterial(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)", fontFamily: "'Nunito', sans-serif", paddingBottom: 48 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #2c3e6b, #3d5a9e)", padding: "20px", color: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 30 }}>📚</span>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>Therapy Binder</div>
            <div style={{ fontSize: 12, opacity: 0.75 }}>AI-generated materials · Ages 6–11</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Step 1 */}
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#8a9bb0", marginBottom: 12 }}>
          Step 1 — Presenting Problem
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {categories.map((c, i) => (
            <div key={c.id} onClick={() => { setSelectedCat(c.id); setSelectedType(null); setMaterial(null); }}
              style={{ background: selectedCat === c.id ? c.color : "#fff", color: selectedCat === c.id ? "#fff" : "#2c3e6b", borderRadius: 16, padding: "16px 12px 14px", cursor: "pointer", textAlign: "center", border: selectedCat === c.id ? `2px solid ${c.color}` : "2px solid #e4e9f0", boxShadow: selectedCat === c.id ? `0 6px 20px ${c.color}44` : "0 2px 8px rgba(0,0,0,0.06)", animation: `fadeIn 0.35s ease ${i * 0.025}s both`, userSelect: "none" }}>
              <div style={{ fontSize: 28, marginBottom: 7 }}>{c.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Step 2 */}
        {selectedCat && (
          <div style={{ animation: "fadeIn 0.3s ease", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#8a9bb0", marginBottom: 12 }}>
              Step 2 — Material Type
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MATERIAL_TYPES.map((t) => (
                <div key={t.id} onClick={() => { setSelectedType(t.id); setMaterial(null); }}
                  style={{ padding: "15px 20px", borderRadius: 14, border: selectedType === t.id ? `2px solid ${cat?.color}` : "2px solid #e4e9f0", background: selectedType === t.id ? cat?.color : "#fff", color: selectedType === t.id ? "#fff" : "#2c3e6b", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: selectedType === t.id ? `0 6px 18px ${cat?.color}44` : "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{t.icon}</span> {t.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate */}
        {selectedCat && selectedType && !loading && !material && (
          <button onClick={generate} style={{ width: "100%", padding: "18px", background: cat?.color, color: "#fff", border: "none", borderRadius: 16, fontWeight: 800, fontSize: 17, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 28px ${cat?.color}55`, animation: "fadeIn 0.3s ease" }}>
            ✨ Generate Material
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "40px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 34, marginBottom: 12 }}>✨</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#2c3e6b", marginBottom: 12 }}>Generating your material…</div>
            <LoadingDots color={cat?.color} />
          </div>
        )}

        {/* Error */}
        {error && <div style={{ background: "#fff0f0", border: "2px solid #f5c6c6", borderRadius: 16, padding: 20, color: "#c0392b", fontWeight: 600 }}>⚠️ {error}</div>}

        {/* Material */}
        {material && !loading && (
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", overflow: "hidden", animation: "fadeIn 0.4s ease" }}>
            <div style={{ background: cat?.color, padding: "18px 20px", color: "#fff" }}>
              <div style={{ fontSize: 11, opacity: 0.8, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{cat?.label} · {type?.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{material.title}</div>
            </div>

            {material.therapistNote && (
              <div style={{ background: "#f8f9fc", padding: "12px 20px", borderBottom: "1px solid #edf0f5", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                <strong style={{ color: "#2c3e6b" }}>🩺 Therapist Note: </strong>{material.therapistNote}
              </div>
            )}

            <div style={{ padding: "20px" }}>
              {material.sections?.map((section, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  {section.heading && (
                    <div style={{ fontSize: 11.5, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 800, color: cat?.color, marginBottom: 10, borderBottom: `2px solid ${cat?.color}22`, paddingBottom: 5 }}>
                      {section.heading}
                    </div>
                  )}
                  {Array.isArray(section.content)
                    ? <ul style={{ margin: 0, paddingLeft: 20 }}>{section.content.map((item, j) => <li key={j} style={{ marginBottom: 8, lineHeight: 1.7, color: "#333", fontSize: 14 }}>{item}</li>)}</ul>
                    : <div style={{ lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap", fontSize: 14 }}>{section.content}</div>}
                </div>
              ))}

              {selectedType === "worksheet" && (
                <div style={{ marginTop: 8 }}>
                  {[1,2,3,4].map(n => <div key={n} style={{ borderBottom: "1.5px solid #d0d8e4", height: 38, marginBottom: 4 }} />)}
                </div>
              )}

              {material.printFooter && (
                <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: cat?.color, fontStyle: "italic", borderTop: "1px solid #edf0f5", paddingTop: 16 }}>
                  ✨ {material.printFooter}
                </div>
              )}
            </div>

            <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
              <button onClick={generate} style={{ flex: 1, padding: "13px", background: "#f0f4ff", color: "#2c3e6b", border: "2px solid #d0d8f0", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                🔄 Regenerate
              </button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: "13px", background: cat?.color, color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                🖨️ Print
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
