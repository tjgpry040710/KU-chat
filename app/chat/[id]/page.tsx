"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CHARACTERS } from "../../lib/characters";

type ChatMsg = { role: "user" | "assistant"; content: string };

const GREEN = "#0B7A3B";
const GREEN_SOFT_BG = "rgba(11, 122, 59, 0.06)"; // 말풍선 올라오는 영역(배경)
const GREEN_BUBBLE = "rgba(11, 122, 59, 0.10)"; // 어시스턴트 말풍선
const BORDER = "rgba(11, 122, 59, 0.18)";

export default function ChatPage() {
  const params = useParams();

  // useParams()가 string|string[]|undefined 일 수 있어서 안전 처리
  const id = useMemo(() => {
    const raw = (params as any)?.id;
    if (Array.isArray(raw)) return raw[0];
    if (typeof raw === "string") return raw;
    return undefined;
  }, [params]);

  const character = useMemo(() => {
    if (!id) return undefined;
    return CHARACTERS.find((c) => c.id === id);
  }, [id]);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // 첫 진입/캐릭터 변경 시 인사 세팅
  useEffect(() => {
    if (!character) return;
    setMessages([{ role: "assistant", content: character.greeting }]);
    setInput("");
  }, [character?.id]);

  // 스크롤 맨 아래로
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !character) return;

    setIsSending(true);
    setInput("");

    // 유저 메시지 먼저 추가
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, characterId: character.id }),
      });

      const data = await res.json();
      const reply = String(data?.reply ?? "음… 잠깐 오류난 것 같아 🥲");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "네트워크가 잠깐 불안정한가 봐… 🥲 다시 한 번만 보내줘!" },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  if (!id) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <p style={{ color: "#666" }}>라우트 파라미터 읽는 중…</p>
        <Link href="/" style={{ color: GREEN, fontWeight: 900 }}>
          메인으로
        </Link>
      </main>
    );
  }

  if (!character) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2 style={{ margin: 0 }}>캐릭터를 찾을 수 없어… 🥲</h2>
        <p style={{ marginTop: 10, color: "#666" }}>
          available ids = {CHARACTERS.map((c) => c.id).join(", ")}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: GREEN,
            color: "white",
            borderRadius: 999,
            padding: "10px 14px",
            fontWeight: 900,
            textDecoration: "none",
            marginTop: 12,
          }}
        >
          ← 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui", background: "white" }}>
      {/* 상단 헤더 */}
      <header
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 18,
          padding: 16,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* 목록으로: 초록 라운드 버튼 */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: GREEN,
            color: "white",
            borderRadius: 999,
            padding: "10px 14px",
            fontWeight: 900,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          ← 목록으로
        </Link>

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${BORDER}`,
            background: "rgba(11,122,59,0.06)",
            flex: "0 0 auto",
          }}
        >
          <Image
            src={character.img}
            alt={character.name}
            width={56}
            height={56}
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", }}
            priority
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 2 }}>
            {character.name}
          </div>
          <div style={{ color: GREEN, fontWeight: 700 }}>{character.title}</div>
          <div style={{ marginTop: 4, color: "#666", fontSize: 13 }}>{character.subtitle}</div>
        </div>
      </header>

      {/* 빠른 질문 버튼 */}
      {character.quick?.length ? (
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {character.quick.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              disabled={isSending}
              style={{
                cursor: isSending ? "not-allowed" : "pointer",
                border: `1px solid ${BORDER}`,
                background: "white",
                borderRadius: 999,
                padding: "10px 12px",
                fontWeight: 700,
                color: "#111",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      {/* 채팅 영역: 은은한 초록 배경(white 유지) */}
      <section
        style={{
          marginTop: 14,
          border: `1px solid ${BORDER}`,
          borderRadius: 18,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          ref={listRef}
          style={{
            height: 520,
            overflow: "auto",
            padding: 16,
            background: GREEN_SOFT_BG,
          }}
        >
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.55,
                    borderRadius: 16,
                    padding: "12px 12px",
                    border: isUser ? "none" : `1px solid ${BORDER}`,
                    background: isUser ? GREEN : GREEN_BUBBLE,
                    color: isUser ? "white" : "#111",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력 영역 */}
        <div style={{ display: "flex", gap: 12, padding: 14, background: "white", borderTop: `1px solid ${BORDER}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(input);
            }}
            placeholder="메시지를 입력하세요"
            style={{
              flex: 1,
              borderRadius: 14,
              border: `1px solid ${BORDER}`,
              padding: "12px 12px",
              outline: "none",
              fontSize: 14,
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={isSending}
            style={{
              background: isSending ? "rgba(11,122,59,0.55)" : GREEN,
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "12px 16px",
              fontWeight: 900,
              cursor: isSending ? "not-allowed" : "pointer",
              minWidth: 92,
            }}
          >
            {isSending ? "전송중…" : "보내기"}
          </button>
        </div>
      </section>
    </main>
  );
}
