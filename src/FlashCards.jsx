import { useState, useEffect } from "react";
// นำเข้าข้อมูล 3,000 คำจากไฟล์ JSON ที่เราแยกไว้
import words from "./oxford3000.json"; 

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.75;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
  }
}

export default function FlashCards() {
  const [shuffledWords, setShuffledWords] = useState([]); // เก็บคำที่สลับลำดับแล้ว
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [speakAnim, setSpeakAnim] = useState(false);

  // 1. สุ่มลำดับคำศัพท์ใหม่ทั้งหมด "ครั้งเดียว" ตอนเปิดแอป
  useEffect(() => {
    const shuffle = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffle);
  }, []);

  // 2. ปรับตัวแปร current ให้ดึงจากสำรับที่สุ่มแล้ว
  const current = shuffledWords.length > 0 
    ? shuffledWords[index] 
    : { word: "Loading", emoji: "⏳", ipa: "" };

  function go(dir) {
    if (shuffledWords.length === 0) return;
    setIndex((prev) => {
      if (dir === "next") return (prev + 1) % shuffledWords.length;
      return (prev - 1 + shuffledWords.length) % shuffledWords.length;
    });
    setRevealed(false);
    setAnimKey((k) => k + 1);
  }

  // ฟังก์ชันสุ่มใหม่ทั้งสำรับ (ถ้าต้องการล้างไพ่ใหม่)
  function reshuffleAll() {
    const shuffle = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffle);
    setIndex(0);
    setRevealed(false);
    setAnimKey((k) => k + 1);
  }

  function handleSpeak() {
    speak(current.word);
    setSpeakAnim(true);
    setTimeout(() => setSpeakAnim(false), 700);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === " ") { // กด Spacebar เพื่อเปิดคำศัพท์
        e.preventDefault();
        setRevealed(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff8f0 0%, #ffe8d0 60%, #ffd0b0 100%)",
      fontFamily: "'Nunito', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      userSelect: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

        .fc-title {
          font-size: 20px;
          font-weight: 900;
          color: #d96a40;
          margin-bottom: 18px;
          letter-spacing: 0.3px;
        }

        .fc-card {
          background: white;
          border-radius: 30px;
          box-shadow: 0 16px 50px rgba(217,106,64,0.22), 0 2px 12px rgba(0,0,0,0.06);
          width: min(85vw, 340px);
          aspect-ratio: 3/4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
          gap: 12px;
        }

        .fc-emoji {
          font-size: clamp(88px, 24vw, 136px);
          line-height: 1;
          animation: ePop 0.4s cubic-bezier(.175,.885,.32,1.28) both;
        }
        @keyframes ePop {
          from { transform: scale(0.55) rotate(-5deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .fc-speak {
          background: linear-gradient(135deg, #ff8c55, #ff5f5f);
          border: none;
          border-radius: 50px;
          color: white;
          font-family: 'Nunito', sans-serif;
          font-size: 17px;
          font-weight: 900;
          padding: 13px 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(255,95,95,0.38);
          transition: transform 0.12s;
        }
        .fc-speak:active { transform: scale(0.93); }
        .fc-speak.bounce { animation: sBounce 0.55s ease; }
        @keyframes sBounce {
          0%,100% { transform: scale(1); }
          30% { transform: scale(1.14); }
          65% { transform: scale(0.94); }
        }

        .fc-reveal-btn {
          background: transparent;
          border: 2.5px dashed #ffb08a;
          border-radius: 50px;
          color: #d96a40;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 24px;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s;
        }
        .fc-reveal-btn:hover { background: #fff0e6; }
        .fc-reveal-btn:active { transform: scale(0.95); }

        .fc-word {
          font-size: clamp(30px, 10vw, 52px);
          font-weight: 900;
          color: #1e1e1e;
          text-align: center;
          animation: wPop 0.32s cubic-bezier(.175,.885,.32,1.28) both;
        }
        .fc-ipa {
          font-size: 15px;
          color: #bbb;
          font-weight: 400;
          margin-top: -6px;
          animation: wPop 0.36s 0.05s cubic-bezier(.175,.885,.32,1.28) both;
        }
        @keyframes wPop {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }

        .fc-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 24px;
        }
        .fc-nav-btn {
          background: white;
          border: none;
          border-radius: 50%;
          width: 52px;
          height: 52px;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .fc-nav-btn:hover { transform: scale(1.1); box-shadow: 0 6px 18px rgba(0,0,0,0.14); }
        .fc-nav-btn:active { transform: scale(0.91); }

        .fc-counter {
          font-size: 14px;
          font-weight: 800;
          color: #d96a40;
          min-width: 70px;
          text-align: center;
        }

        .fc-random {
          margin-top: 20px;
          background: none;
          border: none;
          color: #d96a40;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .fc-random:active { color: #ff5f5f; }
      `}</style>

      <div className="fc-title">🌟 Oxford 3000 Words 🌟</div>

      <div className="fc-card">
        <div className="fc-emoji" key={`emoji-${animKey}`}>{current.emoji}</div>

        <button
          className={`fc-speak${speakAnim ? " bounce" : ""}`}
          onClick={handleSpeak}
        >
          🔊 Listen
        </button>

        {revealed ? (
          <div style={{ textAlign: "center" }} key={`word-${animKey}`}>
            <div className="fc-word">{current.word}</div>
            <div className="fc-ipa">{current.ipa}</div>
          </div>
        ) : (
          <button className="fc-reveal-btn" onClick={() => setRevealed(true)}>
            👀 What is this?
          </button>
        )}
      </div>

      <div className="fc-nav">
        <button className="fc-nav-btn" onClick={() => go("prev")}>◀</button>
        <span className="fc-counter">{index + 1} / {words.length}</span>
        <button className="fc-nav-btn" onClick={() => go("next")}>▶</button>
      </div>

      {/* ปุ่มสุ่มคำศัพท์ แทนที่จุดไข่ปลาเดิม */}
      <button className="fc-random" onClick={randomWord}>
        🔀 สุ่มคำศัพท์
      </button>
    </div>
  );
}
