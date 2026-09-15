import { useState } from "react";
import { ArrowLeftRight, Copy, Check, Volume2, Loader2, Send } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", speech: "en-US" },
  { code: "ur", label: "Urdu", speech: "ur-PK" },
  { code: "es", label: "Spanish", speech: "es-ES" },
  { code: "fr", label: "French", speech: "fr-FR" },
  { code: "de", label: "German", speech: "de-DE" },
  { code: "ar", label: "Arabic", speech: "ar-SA" },
  { code: "hi", label: "Hindi", speech: "hi-IN" },
  { code: "zh-CN", label: "Chinese (Mandarin)", speech: "zh-CN" },
  { code: "ja", label: "Japanese", speech: "ja-JP" },
  { code: "ko", label: "Korean", speech: "ko-KR" },
  { code: "ru", label: "Russian", speech: "ru-RU" },
  { code: "pt", label: "Portuguese", speech: "pt-PT" },
  { code: "it", label: "Italian", speech: "it-IT" },
  { code: "tr", label: "Turkish", speech: "tr-TR" },
];

const speechFor = (code) => LANGUAGES.find((l) => l.code === code)?.speech || "en-US";

const MAX_CHARS = 480; // MyMemory's free anonymous tier caps requests around 500 chars

export default function App() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ur");
  const [sourceText, setSourceText] = useState("");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(null); // 'source' | 'target' | null

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  const handleTranslate = async () => {
    const text = sourceText.trim();
    if (!text) {
      setError("Enter some text first.");
      return;
    }
    if (sourceLang === targetLang) {
      setError("Source and target languages are the same.");
      return;
    }
    setError("");
    setLoading(true);
    setTranslated("");

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const data = await response.json();

      if (data?.responseData?.translatedText) {
        setTranslated(data.responseData.translatedText);
      } else {
        throw new Error("No translation returned");
      }
    } catch (err) {
      setError("Couldn't translate that. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleTranslate();
  };

  const handleCopy = async () => {
    if (!translated) return;
    await navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const speak = (text, langCode, which) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = speechFor(langCode);
    utter.onend = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);
    setSpeaking(which);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        background: "#F2F1EA",
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .tt-select {
          appearance: none;
          background: transparent;
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.02em;
          color: #1B2A4A;
          padding: 4px 22px 4px 0;
          cursor: pointer;
        }
        .tt-select:focus { outline: none; }
        .tt-textarea {
          width: 100%;
          border: none;
          background: transparent;
          resize: none;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1B2A4A;
        }
        .tt-textarea:focus { outline: none; }
        .tt-textarea::placeholder { color: #9C9A8E; }
        .tt-icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 6px;
          color: #6B6A60;
          transition: background 0.15s, color 0.15s;
        }
        .tt-icon-btn:hover { background: #E6E3D8; color: #1B2A4A; }
        .tt-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .tt-icon-btn:disabled:hover { background: transparent; color: #6B6A60; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 40px" }}>
        <div style={{ marginBottom: 22 }}>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              fontSize: 30,
              color: "#1B2A4A",
              margin: "0 0 4px",
              letterSpacing: "-0.01em",
            }}
          >
            Par Avion
          </h1>
          <p style={{ fontSize: 14, color: "#6B6A60", margin: 0 }}>
            Write in one language, send it out in another.
          </p>
        </div>

        <div
          style={{
            height: 6,
            marginBottom: 20,
            backgroundImage:
              "repeating-linear-gradient(45deg, #C0392B 0 14px, #F2F1EA 14px 20px, #2C5F8A 20px 34px, #F2F1EA 34px 40px)",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            background: "#FBFAF6",
            border: "1px solid #D8D3C7",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px dashed #D8D3C7",
              padding: "10px 18px",
            }}
          >
            <div style={{ flex: 1 }}>
              <select
                className="tt-select"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="tt-icon-btn" onClick={swapLanguages} aria-label="Swap languages" title="Swap languages">
              <ArrowLeftRight size={16} />
            </button>

            <div style={{ flex: 1, textAlign: "right" }}>
              <select
                className="tt-select"
                style={{ textAlign: "right", paddingRight: 0, paddingLeft: 22 }}
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 280px",
                padding: "18px 18px 14px",
                borderRight: "1px dashed #D8D3C7",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <textarea
                className="tt-textarea"
                style={{ flex: 1, minHeight: 150 }}
                placeholder="Type or paste text to translate…"
                value={sourceText}
                maxLength={MAX_CHARS}
                onChange={(e) => setSourceText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "#9C9A8E" }}>
                  {sourceText.length}/{MAX_CHARS}
                </span>
                <button
                  className="tt-icon-btn"
                  onClick={() => speak(sourceText, sourceLang, "source")}
                  disabled={!sourceText.trim()}
                  aria-label="Listen to source text"
                  title="Listen"
                >
                  <Volume2 size={16} color={speaking === "source" ? "#C0392B" : undefined} />
                </button>
              </div>
            </div>

            <div
              style={{
                flex: "1 1 280px",
                padding: "18px 18px 14px",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                background: "#F6F4EC",
              }}
            >
              <div style={{ flex: 1, minHeight: 150 }}>
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9C9A8E", fontSize: 14 }}>
                    <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
                    Translating…
                  </div>
                ) : translated ? (
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "#1B2A4A", whiteSpace: "pre-wrap" }}>
                    {translated}
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: 15, color: "#B3B0A3" }}>Translation will appear here.</p>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 8 }}>
                <button
                  className="tt-icon-btn"
                  onClick={() => speak(translated, targetLang, "target")}
                  disabled={!translated}
                  aria-label="Listen to translation"
                  title="Listen"
                >
                  <Volume2 size={16} color={speaking === "target" ? "#C0392B" : undefined} />
                </button>
                <button
                  className="tt-icon-btn"
                  onClick={handleCopy}
                  disabled={!translated}
                  aria-label="Copy translation"
                  title="Copy"
                >
                  {copied ? <Check size={16} color="#3B6D11" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px dashed #D8D3C7",
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: error ? "#A32D2D" : "#9C9A8E" }}>
              {error || "⌘/Ctrl + Enter to send"}
            </span>
            <button
              onClick={handleTranslate}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#1B2A4A",
                color: "#F2F1EA",
                border: "none",
                borderRadius: 3,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Send size={14} />}
              Translate
            </button>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "#9C9A8E", marginTop: 14, textAlign: "center" }}>
          Translations powered by the free MyMemory Translation API.
        </p>
      </div>
    </div>
  );
}
