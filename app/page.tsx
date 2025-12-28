import Link from "next/link";
import Image from "next/image";
import { CHARACTERS } from "./lib/characters";

const GREEN = "#0B7A3B";
const GREEN_SOFT = "rgba(11, 122, 59, 0.08)";
const BORDER = "rgba(11, 122, 59, 0.18)";

export default function Page() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui", background: "white" }}>
      <header style={{ marginBottom: 18 }}>
        {/* KU-CHAT을 '초록 라운드 버튼'처럼 보이게 */}
       <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: -0.2 }}>
  <span style={{ color: GREEN }}>KU-CHAT</span> 🧩💬
</h1>

        <p style={{ margin: "10px 0 0", color: "#555" }}>
          마스코트를 선택하면 바로 1:1 채팅으로 들어가요 ✨
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {CHARACTERS.map((c) => (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: `1px solid ${BORDER}`,
              borderRadius: 18,
              padding: 16,
              background: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${BORDER}`,
                background: GREEN_SOFT,
                flex: "0 0 auto",
              }}
            >
              <Image
                src={c.img}
                alt={c.name}
                width={92}
                height={92}
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", }}
                priority
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{c.name}</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: "#0B7A3B" }}>{c.title}</div>
              <div style={{ marginTop: 6, color: "#555", fontSize: 13, lineHeight: 1.45 }}>
                {c.subtitle}
              </div>

              {/* '채팅 시작하기'를 초록 라운드 버튼으로 */}
              <div style={{ marginTop: 12 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: GREEN,
                    color: "white",
                    borderRadius: 999,
                    padding: "9px 12px",
                    fontWeight: 900,
                    fontSize: 14,
                    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  채팅 시작하기 ➜
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* 공모전 제출용: 과하지 않게 ‘베타’만 안내 */}
      <p style={{ marginTop: 16, color: "#6b7280", fontSize: 12 }}>
        * 현재 베타 버전으로 일부 기능은 시연용으로 동작할 수 있어요.
      </p>
    </main>
  );
}
