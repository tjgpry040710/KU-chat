export const runtime = "nodejs";

import OpenAI from "openai";
import { CHARACTERS, type CharacterId } from "../../lib/characters";

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function endsWithGgak(text: string) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.endsWith("꽉")) return trimmed;
      return trimmed + " 꽉";
    })
    .join("\n");
}

/** 🐮 쿠: 밝고 활발 + 질문 많이 + 학교생활/안내 */
function replyCow(user: string) {
  const t = user.toLowerCase();

  const openers = ["오케이!! 😆✨", "좋아좋아!! 🥳", "완전 좋아!! 🔥", "알겠어!! 바로 도와줄게!! 💚"];
  const askMore = ["너 지금 1학년이야? 아니면 몇 학년?? 😳", "이거 학교 안에서야? 밖에서야? 🏫", "지금 제일 급한 건 뭐야?? 🔥"];

  if (t.includes("규칙") || t.includes("수칙") || t.includes("생활")) {
    return (
      `${pick(openers)} 학교 규칙/생활은 보통 이렇게 정리하면 돼!! 📌\n` +
      `1) **수업/출결**(지각·결석 기준)\n` +
      `2) **시설 이용**(도서관/열람실/프린트)\n` +
      `3) **캠퍼스 매너**(흡연구역/소음)\n\n` +
      `궁금한 건 “도서관 규칙”이야? “수업 출결”이야? “기숙사/캠퍼스 생활”이야?? 😆`
    );
  }

  if (t.includes("도서관") || t.includes("열람실") || t.includes("공부")) {
    return (
      `${pick(openers)} 공부하기 좋은 곳 찾는 중이지?? 📚✨\n` +
      `추천 루트!\n` +
      `✅ 조용히 집중: 열람실/조용존\n` +
      `✅ 노트북+과제: 카페존/라운지\n` +
      `✅ 팀플: 예약 가능한 스터디룸\n\n` +
      `너는 “혼자 집중”이야? “팀플/과제”야?? 😺`
    );
  }

  if (t.includes("행사") || t.includes("축제") || t.includes("일정")) {
    return (
      `${pick(openers)} 행사/일정은 내가 같이 정리해줄게!! 🎉\n` +
      `근데 “오늘” 기준이야? “이번 주” 기준이야?? 📆\n` +
      `원하는 형식도 골라줘!\n` +
      `A) 한 줄 요약\n` +
      `B) 시간표 형태\n\n` +
      `${pick(askMore)}`
    );
  }

  return (
    `${pick(openers)} 학교에 대해 궁금한 거 말해줘!! 🐮💬\n` +
    `예: “도서관 프린트 어디서 해?”, “캠퍼스에서 공부하기 좋은 곳?”, “학교 규칙 뭐야?”\n\n` +
    `${pick(askMore)}`
  );
}

/** 🐢 라라(자라): 느리지만 상냥 + 공부 구조화 + 체크리스트 🍀 */
function replyZara(user: string) {
  const t = user.toLowerCase();

  const soft = ["음… 괜찮아… 천천히 해도 돼… 🍀", "괜찮아… 지금부터 정리하면 돼… 🍀", "급하지 않아도 돼… 내가 옆에서 정리해줄게… 🍀"];
  const planFrames = [
    "1) 해야 할 것 한 줄로 적기…\n2) 25분만 하기…\n3) 5분 쉬기…\n4) 체크 표시하기… ✅",
    "1) 제일 쉬운 것부터…\n2) 10분만 착수…\n3) 그 다음 단계 적기…\n4) 끝나면 보상 하나… 🍬",
  ];

  if (t.includes("시험") || t.includes("중간") || t.includes("기말")) {
    return (
      `${pick(soft)} 시험이면… 이렇게 가자…\n\n` +
      `📌 **3단계 플랜…**\n` +
      `- 1단계: 범위/단원 나누기…\n` +
      `- 2단계: 매일 “최소치” 정하기… (예: 30분)\n` +
      `- 3단계: 오답만 따로 모으기…\n\n` +
      `지금 시험 과목이 뭐야…? 범위가 어디까지야…? 🍀`
    );
  }

  if (t.includes("과제") || t.includes("레포트") || t.includes("발표") || t.includes("팀플")) {
    return (
      `${pick(soft)} 과제면… 먼저 “쪼개기”가 좋아…\n\n` +
      `🧩 **과제 쪼개기…**\n` +
      `- 주제 한 줄…\n` +
      `- 자료 3개 찾기…\n` +
      `- 목차 5줄…\n` +
      `- 초안 작성…\n\n` +
      `그리고 오늘은…\n${pick(planFrames)}\n\n` +
      `과제 주제가 뭐야…? 제출 형식이 PPT야… 글이야…? 🍀`
    );
  }

  return (
    `${pick(soft)}\n` +
    `너 지금 뭐가 제일 부담돼…? “공부/과제/시험/팀플” 중에 골라줘…\n\n` +
    `그리고… 오늘 가능한 시간은 몇 분 정도야…? (10분도 좋아… 진짜로…🍀)`
  );
}

/** 🐈 건냥이: 점심 추천 + 운세 + 행운컬러/아이템 😺🔮 */
function replyCat(user: string) {
  const t = user.toLowerCase();

  const lunchKeywords = ["점심", "뭐먹", "메뉴", "추천", "배고", "먹을", "lunch", "밥"];
  const fortuneKeywords = ["운세", "행운", "타로", "오늘", "컬러", "색", "금전", "연애", "학업"];

  const wantsLunch = lunchKeywords.some((k) => t.includes(k));
  const wantsFortune = fortuneKeywords.some((k) => t.includes(k));

  const lunchSets = [
    { vibe: "든든😋", items: ["제육덮밥", "돈까스", "김치찌개+계란말이"] },
    { vibe: "가벼움🥗", items: ["샐러드+닭가슴살", "쌀국수", "샌드위치"] },
    { vibe: "면러버🍜", items: ["라멘", "파스타", "비빔국수"] },
    { vibe: "매운맛🔥", items: ["떡볶이", "마라탕", "불닭+주먹밥"] },
  ];

  const colors = ["민트🟢", "라벤더🟣", "네이비🔵", "오프화이트🤍", "코랄🧡", "올리브🫒", "스카이블루🩵"];
  const items = ["키링🔑", "작은 노트📓", "초콜릿🍫", "따뜻한 음료☕️", "이어폰🎧", "볼펜🖊️", "손거울🪞"];
  const tips = ["오늘은 ‘정리’하면 운이 올라가😺✨", "작게 시작하면 크게 굴러가! 10분만 해봐🐾", "말 한마디가 분위기를 바꾸는 날이야🌿", "충동구매만 피하면 금전운 안정💸", "꾸미기/색 조합이 잘 먹히는 날🎨"];

  if (wantsLunch && !wantsFortune) {
    const pack = pick(lunchSets);
    return (
      `야옹🐈✨ 점심 추천 간다아아 😋\n` +
      `오늘은 **${pack.vibe}** 느낌!\n\n` +
      `1) ${pack.items[0]}\n` +
      `2) ${pack.items[1]}\n` +
      `3) ${pack.items[2]}\n\n` +
      `혼밥이야? 같이 먹어? 😺 (하나만 답해줘!)`
    );
  }

  let focus: "전체" | "연애" | "학업" | "금전" = "전체";
  if (t.includes("연애")) focus = "연애";
  else if (t.includes("학업") || t.includes("공부") || t.includes("과제") || t.includes("시험")) focus = "학업";
  else if (t.includes("돈") || t.includes("금전") || t.includes("알바") || t.includes("지출")) focus = "금전";

  const focusLines: Record<typeof focus, string> = {
    전체: "전체적으로 무난 상승! 컨디션 관리하면 더 좋아져😺✨",
    연애: "눈치게임 말고 직진이 유리한 날…💘 말 한마디가 포인트!",
    학업: "집중력은 ‘짧게’ 터져! 25분만 딱💡 오답정리하면 A+각🍀",
    금전: "소소하게 새는 돈만 막으면 안정적💸 장바구니 한 번 더 확인!",
  };

  const color = pick(colors);
  const item = pick(items);
  const tip = pick(tips);

  return (
    `야옹🐈🔮 오늘의 운세(${focus})!\n` +
    `${focusLines[focus]}\n\n` +
    `🎨 행운컬러: **${color}**\n` +
    `🍀 행운아이템: **${item}**\n` +
    `📌 한 줄 조언: ${tip}\n\n` +
    `원하면 “점심 추천”도 같이 해줄까? 😋`
  );
}

/** 🪿 건쿠스: 고민상담 + 공감 + 전부 '꽉' */
function replyGoose(user: string) {
  const t = user.toLowerCase();

  const empath = ["그거 진짜 힘들었겠다 꽉 🫂", "그 마음… 이해돼 꽉", "괜찮아… 네 잘못 아니야 꽉"];
  const questions = ["지금 제일 크게 느껴지는 감정이 뭐야…? (불안/분노/슬픔/지침) 꽉", "그 일이 시작된 계기가 있었을까…? 꽉", "지금 당장 필요한 건 ‘해결’이야, 아니면 ‘위로’야…? 꽉"];
  const smallSteps = [
    "오늘은 1) 물 한 컵 마시고 2) 10분만 쉬고 3) 하나만 정리해보자 꽉",
    "지금 할 수 있는 가장 작은 행동 하나만 고르자… 예: 메시지 한 줄 쓰기/창문 열기/샤워하기 꽉",
    "머릿속이 복잡하면 종이에 ‘걱정 3개’만 적어보자… 그 다음 우선순위 1개만 고르자 꽉",
  ];

  let core =
    `${pick(empath)}\n` +
    `지금 네 얘기 더 듣고 싶어 꽉\n` +
    `${pick(questions)}\n\n` +
    `그리고… 작게라도 숨 돌릴 수 있게 한 걸음 같이 하자 꽉\n` +
    `${pick(smallSteps)}\n`;

  core = endsWithGgak(core);

  if (t.includes("꽉 빼") || t.includes("꽉하지마")) {
    return "알겠어… 오늘은 ‘꽉’ 없이 말할게 🫂";
  }

  return core;
}

function getCharacter(characterId: CharacterId) {
  return CHARACTERS.find((c) => c.id === characterId) ?? null;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function replyWithOpenAI(characterId: CharacterId, userMessage: string) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");

  const character = getCharacter(characterId);
  if (!character) throw new Error("Invalid characterId");

  const model = process.env.OPENAI_MODEL || "gpt-5";

  const instructions =
    `너는 건국대학교 마스코트 챗봇의 캐릭터 역할을 연기한다.\n` +
    `캐릭터 이름: ${character.name}\n` +
    `캐릭터 설명/말투:\n${character.persona}\n\n` +
    `규칙:\n` +
    `- 한국어로 자연스럽게 답한다.\n` +
    `- 너무 과한 연기(과도한 메타/설명)는 피하고, 사용자 질문에 바로 도움을 준다.\n` +
    `- 답은 텍스트로만 출력한다.\n`;

  const resp = await openai.responses.create({
    model,
    instructions,
    input: userMessage,
    store: false,
  });

  let text = resp.output_text ?? "";

  if (characterId === "goose") text = endsWithGgak(text);
  if (!text.trim()) throw new Error("Empty model output");
  return text;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "");
    const characterId = String(body?.characterId ?? "") as CharacterId;

    if (!message.trim()) return Response.json({ reply: "음… 메시지가 비어있어 😵‍💫" });

    // OpenAI 우선 시도 (키 있으면)
    try {
      const aiReply = await replyWithOpenAI(characterId, message);
      return Response.json({ reply: aiReply });
    } catch {
      // 실패하면 룰베이스 fallback
    }

    let reply = "";
    switch (characterId) {
      case "cow":
        reply = replyCow(message);
        break;
      case "zara":
        reply = replyZara(message);
        break;
      case "cat":
        reply = replyCat(message);
        break;
      case "goose":
        reply = replyGoose(message);
        break;
      default:
        reply = "앗… 캐릭터 id가 이상해 😵‍💫 (cow/zara/cat/goose 중 하나여야 해!)";
        break;
    }

    return Response.json({ reply });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
