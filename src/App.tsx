import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  BookOpenCheck,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock,
  FileText,
  Flame,
  Gavel,
  Gamepad2,
  Gauge,
  GraduationCap,
  Hand,
  Keyboard,
  Landmark,
  Menu,
  MessageCircle,
  Network,
  Play,
  RotateCcw,
  Scale,
  SearchCheck,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Vote,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as THREE from "three";
import { getChatResponse } from "./lib/gemini";

type Message = {
  role: "user" | "model";
  text: string;
};

type LessonBlock = {
  id: string;
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  thesis: string;
  core: string[];
  examHint: string;
};

type CompareRow = {
  label: string;
  democracy: string;
  state: string;
};

type QuizItem = {
  question: string;
  answer: string;
};

const navItems = [
  { href: "#tong-quan", label: "Tổng quan" },
  { href: "#bai-hoc", label: "Bài học" },
  { href: "#so-sanh", label: "So sánh" },
  { href: "#viet-nam", label: "Việt Nam" },
  { href: "#luyen-tap", label: "Luyện tập" },
  { href: "#game", label: "Game" },
];

const images = {
  hero:
    "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Assembly%20Building%20of%20Vietnam.jpg",
  assembly:
    "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Assembly%20of%20Vietnam.JPG",
  hall:
    "https://commons.wikimedia.org/wiki/Special:FilePath/H%E1%BB%99i%20tr%C6%B0%E1%BB%9Dng%20Di%C3%AAn%20H%E1%BB%93ng%2009032019%202.jpg",
  constitution:
    "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Assembly%20Building%20of%20Vietnam%2027-10-2025.jpg",
};

const overview = [
  {
    label: "Chủ đề",
    value: "Dân chủ XHCN",
    text: "Dân chủ là quyền lực thuộc về nhân dân, được tổ chức trong chế độ xã hội chủ nghĩa.",
    icon: Vote,
  },
  {
    label: "Thiết chế",
    value: "Nhà nước XHCN",
    text: "Công cụ tổ chức quyền lực nhân dân, quản lý xã hội và xây dựng đời sống mới.",
    icon: Landmark,
  },
  {
    label: "Trọng tâm Việt Nam",
    value: "Pháp quyền XHCN",
    text: "Nhà nước của nhân dân, do nhân dân, vì nhân dân dưới sự lãnh đạo của Đảng.",
    icon: Scale,
  },
  {
    label: "Cách học",
    value: "Bản chất → chức năng",
    text: "Nắm khái niệm, bản chất, chức năng, rồi liên hệ xây dựng nhà nước ở Việt Nam.",
    icon: Target,
  },
];

const lessonBlocks: LessonBlock[] = [
  {
    id: "dan-chu",
    eyebrow: "Phần I",
    title: "Dân chủ và dân chủ xã hội chủ nghĩa",
    icon: Users,
    image: images.assembly,
    imageAlt: "Tòa nhà Quốc hội Việt Nam",
    thesis:
      "Dân chủ được hiểu là quyền lực thuộc về nhân dân. Trong chủ nghĩa xã hội, dân chủ không chỉ là quyền chính trị mà còn là điều kiện để giải phóng con người, phát triển xã hội và bảo đảm nhân dân làm chủ.",
    core: [
      "Dân chủ là một giá trị xã hội phản ánh quyền cơ bản của con người.",
      "Dân chủ là một hình thức tổ chức nhà nước của giai cấp cầm quyền.",
      "Dân chủ là nguyên tắc tổ chức, quản lý xã hội, gắn với kỷ luật và pháp luật.",
      "Dân chủ xã hội chủ nghĩa mang bản chất của giai cấp công nhân, đồng thời hướng tới lợi ích của nhân dân lao động.",
    ],
    examHint:
      "Khi trả lời câu hỏi về bản chất dân chủ XHCN, hãy triển khai theo ba mặt: chính trị, kinh tế, tư tưởng - văn hóa - xã hội.",
  },
  {
    id: "nha-nuoc",
    eyebrow: "Phần II",
    title: "Nhà nước xã hội chủ nghĩa",
    icon: Building2,
    image: images.hall,
    imageAlt: "Hội trường Diên Hồng",
    thesis:
      "Nhà nước xã hội chủ nghĩa ra đời từ cách mạng của giai cấp công nhân và nhân dân lao động. Đây là thiết chế thể hiện, bảo vệ và tổ chức thực hiện quyền làm chủ của nhân dân.",
    core: [
      "Bản chất chính trị: đặt dưới sự lãnh đạo của giai cấp công nhân thông qua Đảng Cộng sản.",
      "Bản chất xã hội: đại diện cho lợi ích của nhân dân lao động và toàn xã hội.",
      "Chức năng đối nội: tổ chức xây dựng xã hội mới, quản lý kinh tế, văn hóa, xã hội.",
      "Chức năng đối ngoại: bảo vệ Tổ quốc, mở rộng quan hệ hợp tác, giữ hòa bình và phát triển.",
    ],
    examHint:
      "Câu hỏi về nhà nước XHCN thường cần đủ ba ý: sự ra đời, bản chất, chức năng.",
  },
  {
    id: "viet-nam",
    eyebrow: "Phần III",
    title: "Dân chủ và nhà nước pháp quyền XHCN ở Việt Nam",
    icon: Gavel,
    image: images.constitution,
    imageAlt: "Tòa nhà Quốc hội Việt Nam nhìn từ quảng trường",
    thesis:
      "Ở Việt Nam, dân chủ xã hội chủ nghĩa gắn với xây dựng Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân. Quyền lực nhà nước là thống nhất, có phân công, phối hợp và kiểm soát.",
    core: [
      "Mở rộng dân chủ phải đi đôi với kỷ luật, kỷ cương và pháp luật.",
      "Nhà nước quản lý xã hội bằng Hiến pháp, pháp luật và phục vụ nhân dân.",
      "Xây dựng đội ngũ cán bộ, công chức có phẩm chất, năng lực, trách nhiệm.",
      "Phòng, chống tham nhũng, lãng phí là nhiệm vụ cấp bách và lâu dài.",
    ],
    examHint:
      "Liên hệ Việt Nam nên nhấn mạnh: nhân dân là chủ thể quyền lực, Đảng lãnh đạo, Nhà nước quản lý bằng pháp luật.",
  },
];

const principles = [
  {
    title: "Nhân dân là chủ",
    text: "Mọi quyền lực thuộc về nhân dân; nhân dân tham gia xây dựng, kiểm tra và giám sát quyền lực.",
    icon: Hand,
  },
  {
    title: "Pháp luật là khuôn khổ",
    text: "Dân chủ cần được thể chế hóa bằng Hiến pháp, pháp luật, kỷ luật và kỷ cương.",
    icon: FileText,
  },
  {
    title: "Đảng lãnh đạo",
    text: "Sự lãnh đạo của Đảng là điều kiện chính trị để định hướng quá trình xây dựng dân chủ XHCN.",
    icon: ShieldCheck,
  },
  {
    title: "Nhà nước phục vụ",
    text: "Bộ máy nhà nước phải trong sạch, hiệu lực, hiệu quả, gần dân và chịu trách nhiệm trước nhân dân.",
    icon: ClipboardCheck,
  },
];

const compareRows: CompareRow[] = [
  {
    label: "Trọng tâm",
    democracy: "Quyền làm chủ của nhân dân trong đời sống chính trị, kinh tế, văn hóa, xã hội.",
    state: "Thiết chế tổ chức và bảo đảm thực hiện quyền làm chủ đó.",
  },
  {
    label: "Bản chất",
    democracy: "Mang bản chất giai cấp công nhân, hướng tới lợi ích của nhân dân lao động.",
    state: "Là công cụ quyền lực của nhân dân, đặt dưới sự lãnh đạo của Đảng.",
  },
  {
    label: "Cách biểu hiện",
    democracy: "Bầu cử, tham gia quản lý, giám sát, phản biện, thụ hưởng quyền con người.",
    state: "Hiến pháp, pháp luật, bộ máy công quyền, chính sách, quản lý xã hội.",
  },
  {
    label: "Điểm cần nhớ",
    democracy: "Không tách rời kỷ luật, kỷ cương và trách nhiệm công dân.",
    state: "Không được quan liêu, xa dân, tham nhũng, lãng phí.",
  },
];

const vietnamTimeline = [
  {
    year: "1945",
    title: "Xác lập chế độ dân chủ nhân dân",
    text: "Sau Cách mạng Tháng Tám, nhân dân trở thành chủ thể của nhà nước mới.",
  },
  {
    year: "1986",
    title: "Đổi mới và phát huy dân chủ",
    text: "Đại hội VI nhấn mạnh phát huy dân chủ như động lực phát triển đất nước.",
  },
  {
    year: "Hiện nay",
    title: "Xây dựng Nhà nước pháp quyền XHCN",
    text: "Hoàn thiện pháp luật, kiểm soát quyền lực, cải cách hành chính và phòng chống tham nhũng.",
  },
];

const examBlueprint = [
  "Mở bài: nêu dân chủ XHCN và nhà nước XHCN là hai nội dung gắn bó trong thời kỳ quá độ.",
  "Thân bài 1: giải thích dân chủ là quyền lực thuộc về nhân dân và bản chất dân chủ XHCN.",
  "Thân bài 2: trình bày sự ra đời, bản chất, chức năng của nhà nước XHCN.",
  "Thân bài 3: liên hệ Việt Nam với Nhà nước pháp quyền XHCN của nhân dân, do nhân dân, vì nhân dân.",
  "Kết bài: khẳng định trách nhiệm công dân trong xây dựng dân chủ, tôn trọng pháp luật, chống quan liêu, tham nhũng.",
];

const quizItems: QuizItem[] = [
  {
    question: "Dân chủ theo nghĩa khái quát nhất là gì?",
    answer:
      "Là quyền lực thuộc về nhân dân; nhân dân là chủ thể của quyền lực xã hội và quyền lực nhà nước.",
  },
  {
    question: "Vì sao dân chủ XHCN phải gắn với pháp luật?",
    answer:
      "Vì quyền làm chủ chỉ bền vững khi được thể chế hóa, bảo vệ và thực hiện bằng Hiến pháp, pháp luật, kỷ luật và kỷ cương.",
  },
  {
    question: "Nhà nước XHCN có những chức năng cơ bản nào?",
    answer:
      "Có chức năng đối nội như tổ chức xây dựng xã hội mới, quản lý kinh tế - xã hội; và chức năng đối ngoại như bảo vệ Tổ quốc, hợp tác, giữ hòa bình.",
  },
  {
    question: "Một ý liên hệ trách nhiệm cá nhân khi học chương này?",
    answer:
      "Tôn trọng pháp luật, tham gia xây dựng cộng đồng, thực hiện quyền và nghĩa vụ công dân, phê phán quan liêu, tham nhũng, lãng phí.",
  },
];

const suggestedQuestions = [
  "Tóm tắt chương 4 MLN thành 5 ý chính",
  "Phân tích bản chất của dân chủ xã hội chủ nghĩa",
  "So sánh dân chủ XHCN và nhà nước XHCN",
  "Lập dàn ý câu hỏi Nhà nước pháp quyền XHCN ở Việt Nam",
];

const initialMessages: Message[] = [
  {
    role: "model",
    text: "Chào bạn. Mình đang ở chế độ học Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa. Bạn có thể hỏi tóm tắt, lập dàn ý, giải thích khái niệm hoặc luyện câu hỏi ôn tập.",
  },
];

type GameChoice = {
  label: string;
  text: string;
};

type GameQuestion = {
  domain: string;
  prompt: string;
  choices: [GameChoice, GameChoice, GameChoice];
  answer: number;
  explain: string;
  keyword: string;
};

type AnswerState = "idle" | "correct" | "wrong";

const GAME_ROUND_SECONDS = 18;

const gatePositions: [number, number, number][] = [
  [-3.75, 0, -0.55],
  [0, 0, -1.05],
  [3.75, 0, -0.55],
];

const gameQuestions: GameQuestion[] = [
  {
    domain: "Khái niệm",
    prompt: "Dân chủ theo nghĩa khái quát nhất trong Chương 4 là gì?",
    choices: [
      { label: "A", text: "Quyền lực thuộc về nhân dân" },
      { label: "B", text: "Quyền lực chỉ thuộc bộ máy hành chính" },
      { label: "C", text: "Một nghi thức bầu chọn hình thức" },
    ],
    answer: 0,
    explain:
      "Dân chủ được hiểu là quyền lực thuộc về nhân dân; nhân dân là chủ thể của quyền lực xã hội và quyền lực nhà nước.",
    keyword: "Nhân dân làm chủ",
  },
  {
    domain: "Bản chất",
    prompt: "Bản chất chính trị của dân chủ xã hội chủ nghĩa gắn với lực lượng nào?",
    choices: [
      { label: "A", text: "Giai cấp công nhân và nhân dân lao động" },
      { label: "B", text: "Lợi ích riêng của thiểu số đặc quyền" },
      { label: "C", text: "Cơ chế thị trường tự phát" },
    ],
    answer: 0,
    explain:
      "Dân chủ xã hội chủ nghĩa mang bản chất giai cấp công nhân, đồng thời hướng tới lợi ích của nhân dân lao động.",
    keyword: "Bản chất giai cấp công nhân",
  },
  {
    domain: "Pháp luật",
    prompt: "Vì sao dân chủ XHCN phải đi cùng kỷ luật, kỷ cương và pháp luật?",
    choices: [
      { label: "A", text: "Để quyền làm chủ được thể chế hóa và bảo đảm" },
      { label: "B", text: "Để hạn chế mọi quyền của công dân" },
      { label: "C", text: "Để bỏ qua trách nhiệm của nhà nước" },
    ],
    answer: 0,
    explain:
      "Dân chủ chỉ bền vững khi được thể chế hóa bằng Hiến pháp, pháp luật, kỷ luật và kỷ cương.",
    keyword: "Pháp quyền",
  },
  {
    domain: "Nhà nước XHCN",
    prompt: "Nhà nước xã hội chủ nghĩa có vai trò cốt lõi nào?",
    choices: [
      { label: "A", text: "Tổ chức và bảo đảm quyền làm chủ của nhân dân" },
      { label: "B", text: "Đứng ngoài quá trình quản lý xã hội" },
      { label: "C", text: "Chỉ đại diện cho lợi ích cá nhân" },
    ],
    answer: 0,
    explain:
      "Nhà nước XHCN là thiết chế thể hiện, bảo vệ và tổ chức thực hiện quyền làm chủ của nhân dân.",
    keyword: "Thiết chế thực hiện",
  },
  {
    domain: "Chức năng",
    prompt: "Đâu là chức năng đối nội quan trọng của nhà nước XHCN?",
    choices: [
      { label: "A", text: "Tổ chức xây dựng xã hội mới và quản lý đời sống xã hội" },
      { label: "B", text: "Từ bỏ quản lý kinh tế, văn hóa, xã hội" },
      { label: "C", text: "Chỉ thực hiện hoạt động đối ngoại" },
    ],
    answer: 0,
    explain:
      "Chức năng đối nội gồm tổ chức xây dựng xã hội mới, quản lý kinh tế, văn hóa, xã hội và bảo đảm quyền nhân dân.",
    keyword: "Đối nội",
  },
  {
    domain: "Việt Nam",
    prompt: "Nhà nước pháp quyền XHCN ở Việt Nam được diễn đạt đúng nhất là gì?",
    choices: [
      { label: "A", text: "Của nhân dân, do nhân dân, vì nhân dân" },
      { label: "B", text: "Tách khỏi nhân dân và không chịu giám sát" },
      { label: "C", text: "Không cần Hiến pháp và pháp luật" },
    ],
    answer: 0,
    explain:
      "Ở Việt Nam, Nhà nước pháp quyền XHCN là của nhân dân, do nhân dân, vì nhân dân, quản lý xã hội bằng pháp luật.",
    keyword: "Của dân, do dân, vì dân",
  },
];

function clampEnergy(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getGameRank(score: number, energy: number) {
  if (score >= 1050 && energy >= 70) return "Legend pháp quyền";
  if (score >= 820) return "Kiến tạo dân chủ";
  if (score >= 560) return "Chiến binh nghị trường";
  return "Tân binh pháp luật";
}

function playGameTone(type: "start" | "correct" | "wrong" | "finish") {
  if (typeof window === "undefined") return;
  const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;

  const context = new AudioCtor();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
  gain.connect(context.destination);

  const notes =
    type === "correct"
      ? [520, 720, 980]
      : type === "wrong"
        ? [240, 180]
        : type === "finish"
          ? [420, 640, 860, 1100]
          : [360, 540];

  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = type === "wrong" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.07);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.07);
    oscillator.stop(context.currentTime + index * 0.07 + 0.12);
  });

  window.setTimeout(() => void context.close(), 520);
}

function useGameKeyboard(onChoose: (index: number) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "a" || key === "1") onChoose(0);
      if (key === "b" || key === "2") onChoose(1);
      if (key === "c" || key === "3") onChoose(2);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onChoose]);
}

function GameGate({
  index,
  label,
  text,
  selected,
  answerState,
  disabled,
  onChoose,
}: {
  index: number;
  label: string;
  text: string;
  selected: boolean;
  answerState: AnswerState;
  disabled: boolean;
  onChoose: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const glowColor =
    selected && answerState === "correct"
      ? "#55e39c"
      : selected && answerState === "wrong"
        ? "#ff6b5f"
        : selected
          ? "#f1c75b"
          : "#5fc8ff";

  useFrame((state) => {
    if (!group.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.07;
    group.current.position.y = selected ? 0.22 + pulse : pulse;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55 + index) * 0.05;
  });

  return (
    <group ref={group} position={gatePositions[index]} onClick={() => !disabled && onChoose(index)}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.92, 1.08, 0.22, 44]} />
        <meshStandardMaterial color="#1b2a2f" roughness={0.42} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[1.65, 1.22, 0.22]} />
        <meshStandardMaterial
          color="#132225"
          emissive={glowColor}
          emissiveIntensity={selected ? 0.48 : 0.18}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <torusGeometry args={[0.68, 0.045, 12, 72]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.9} />
      </mesh>
      <Text position={[0, 1.54, 0.06]} fontSize={0.54} color="#ffffff" anchorX="center" anchorY="middle">
        {label}
      </Text>
      <Text position={[0, 0.89, 0.14]} fontSize={0.15} maxWidth={1.35} lineHeight={1.08} color="#f6f1e8" anchorX="center" anchorY="middle">
        {text}
      </Text>
      <pointLight position={[0, 1.8, 0.35]} color={glowColor} intensity={selected ? 2.6 : 1.3} distance={4.2} />
    </group>
  );
}

function GameAvatar({ targetIndex, answerState }: { targetIndex: number | null; answerState: AnswerState }) {
  const ref = useRef<THREE.Group>(null);
  const target = useMemo(() => {
    if (targetIndex === null || targetIndex < 0) return new THREE.Vector3(0, 0.45, 2.2);
    const [x, , z] = gatePositions[targetIndex];
    return new THREE.Vector3(x, 0.72, z + 1.25);
  }, [targetIndex]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.lerp(target, Math.min(1, delta * 4.2));
    ref.current.rotation.y += delta * (answerState === "correct" ? 2.8 : 1.2);
    ref.current.position.y += Math.sin(state.clock.elapsedTime * 5) * 0.002;
  });

  const color = answerState === "wrong" ? "#ff6b5f" : answerState === "correct" ? "#55e39c" : "#f1c75b";

  return (
    <group ref={ref} position={[0, 0.45, 2.2]}>
      <mesh>
        <icosahedronGeometry args={[0.32, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.48, 24]} />
        <meshStandardMaterial color="#f6f1e8" roughness={0.32} metalness={0.12} />
      </mesh>
      <pointLight color={color} intensity={2.2} distance={3.5} />
    </group>
  );
}

function GameBuilding() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.015;
  });

  return (
    <group ref={group} position={[0, 0, -4.2]}>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[7.4, 0.56, 1.0]} />
        <meshStandardMaterial color="#26383b" roughness={0.55} metalness={0.18} />
      </mesh>
      <mesh position={[0, 1.38, -0.08]}>
        <boxGeometry args={[6.8, 1.7, 0.75]} />
        <meshStandardMaterial color="#31484c" roughness={0.48} metalness={0.16} />
      </mesh>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={index} position={[-3.05 + index * 0.76, 0.98, 0.38]}>
          <cylinderGeometry args={[0.075, 0.075, 1.45, 18]} />
          <meshStandardMaterial color="#d7d0bf" roughness={0.4} metalness={0.08} />
        </mesh>
      ))}
      <mesh position={[0, 2.38, 0]}>
        <coneGeometry args={[4.1, 1.08, 4]} />
        <meshStandardMaterial color="#b83a2a" emissive="#3a0b06" emissiveIntensity={0.25} roughness={0.5} />
      </mesh>
      <Text position={[0, 1.55, 0.82]} fontSize={0.2} color="#f1c75b" anchorX="center" anchorY="middle">
        PHAP QUYEN
      </Text>
    </group>
  );
}

function GameRelics({ progress }: { progress: number }) {
  return (
    <group position={[0, 0.1, 0]}>
      {Array.from({ length: gameQuestions.length }).map((_, index) => {
        const angle = (index / gameQuestions.length) * Math.PI * 2;
        const active = index < progress;
        return (
          <Float key={index} speed={1.5 + index * 0.08} floatIntensity={0.22} rotationIntensity={0.18}>
            <mesh position={[Math.cos(angle) * 2.65, 1.15, Math.sin(angle) * 2.65]}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshStandardMaterial
                color={active ? "#55e39c" : "#5b6a69"}
                emissive={active ? "#55e39c" : "#152020"}
                emissiveIntensity={active ? 0.85 : 0.16}
                roughness={0.2}
                metalness={0.45}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function GameEnergyTrails({ answerState, combo, timeLeft }: { answerState: AnswerState; combo: number; timeLeft: number }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const beamColor = answerState === "correct" ? "#55e39c" : answerState === "wrong" ? "#ff6b5f" : "#5fc8ff";

  useFrame((_, delta) => {
    const rush = timeLeft <= 5 ? 2.4 : 1 + combo * 0.12;
    if (outer.current) outer.current.rotation.z += delta * 0.28 * rush;
    if (inner.current) inner.current.rotation.z -= delta * 0.42 * rush;
  });

  return (
    <group position={[0, 0.06, -0.35]}>
      <group ref={outer} rotation={[-Math.PI / 2, 0, 0]}>
        {[3.05, 3.42, 3.84].map((radius, index) => (
          <mesh key={radius} rotation={[0, 0, index * 0.82]}>
            <torusGeometry args={[radius, 0.012, 8, 160, Math.PI * 1.38]} />
            <meshStandardMaterial color={beamColor} emissive={beamColor} emissiveIntensity={1.25} transparent opacity={0.68} />
          </mesh>
        ))}
      </group>
      <group ref={inner} rotation={[-Math.PI / 2, 0, 0]}>
        {[1.72, 2.08].map((radius, index) => (
          <mesh key={radius} rotation={[0, 0, index * 1.25]}>
            <torusGeometry args={[radius, 0.018, 8, 128, Math.PI * 1.62]} />
            <meshStandardMaterial color="#f1c75b" emissive="#f1c75b" emissiveIntensity={0.95} transparent opacity={0.78} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function GameImpactBurst({
  answerState,
  selectedIndex,
  burstKey,
}: {
  answerState: AnswerState;
  selectedIndex: number | null;
  burstKey: number;
}) {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => {
        const angle = (index / 18) * Math.PI * 2 + burstKey * 0.17;
        const radius = 0.8 + (index % 5) * 0.16;
        return {
          position: [Math.cos(angle) * radius, 0.45 + (index % 4) * 0.18, Math.sin(angle) * radius] as [number, number, number],
          rotation: [index * 0.4, angle, index * 0.23] as [number, number, number],
        };
      }),
    [burstKey],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 2.8;
    group.current.scale.lerp(new THREE.Vector3(1.38, 1.38, 1.38), delta * 2.2);
  });

  if (answerState === "idle" || selectedIndex === null || selectedIndex < 0) return null;

  const color = answerState === "correct" ? "#55e39c" : "#ff6b5f";
  const [x, , z] = gatePositions[selectedIndex];

  return (
    <group ref={group} position={[x, 0.65, z + 0.45]} key={burstKey}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.28, 0.025, 8, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.82} />
      </mesh>
      {shards.map((shard, index) => (
        <mesh key={index} position={shard.position} rotation={shard.rotation}>
          <tetrahedronGeometry args={[0.09 + (index % 3) * 0.025, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} roughness={0.24} metalness={0.34} />
        </mesh>
      ))}
      <pointLight color={color} intensity={4.2} distance={5} />
    </group>
  );
}

function GameCamera({ answerState, timeLeft }: { answerState: AnswerState; timeLeft: number }) {
  const { camera } = useThree();

  useFrame((state) => {
    const shake = answerState === "wrong" ? 0.09 : timeLeft <= 5 ? 0.045 : 0.018;
    camera.position.set(Math.sin(state.clock.elapsedTime * 2.1) * shake, 3.35, 6.05 + Math.cos(state.clock.elapsedTime * 1.4) * shake);
    camera.lookAt(0, 0.42, -1.35);
  });

  return null;
}

function GameArenaScene({
  question,
  selectedIndex,
  answerState,
  progress,
  combo,
  timeLeft,
  burstKey,
  onChoose,
  locked,
}: {
  question: GameQuestion;
  selectedIndex: number | null;
  answerState: AnswerState;
  progress: number;
  combo: number;
  timeLeft: number;
  burstKey: number;
  onChoose: (index: number) => void;
  locked: boolean;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 3.35, 6.05], fov: 58 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        dpr={[1, 1.6]}
      >
        <GameCamera answerState={answerState} timeLeft={timeLeft} />
        <color attach="background" args={["#071214"]} />
        <fog attach="fog" args={["#071214", 8, 18]} />
        <ambientLight intensity={0.72} />
        <directionalLight position={[3.8, 6.6, 4.3]} intensity={2.2} />
        <pointLight position={[-5.5, 4, 2]} color="#f1c75b" intensity={3.2} distance={12} />
        <pointLight position={[5.5, 3, -1]} color="#5fc8ff" intensity={2.4} distance={10} />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[8.6, 96]} />
          <meshStandardMaterial color="#0f1f21" roughness={0.62} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[2.35, 2.48, 96]} />
          <meshStandardMaterial color="#f1c75b" emissive="#5b4208" emissiveIntensity={0.32} roughness={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[4.55, 4.7, 120]} />
          <meshStandardMaterial color="#2b8c78" emissive="#0d3a31" emissiveIntensity={0.22} roughness={0.38} />
        </mesh>

        <GameBuilding />
        <GameEnergyTrails answerState={answerState} combo={combo} timeLeft={timeLeft} />
        <GameRelics progress={progress} />
        <GameAvatar targetIndex={selectedIndex} answerState={answerState} />
        <GameImpactBurst answerState={answerState} selectedIndex={selectedIndex} burstKey={burstKey} />

        {question.choices.map((choice, index) => (
          <GameGate
            key={choice.label}
            index={index}
            label={choice.label}
            text={choice.text}
            selected={selectedIndex === index}
            answerState={answerState}
            disabled={locked}
            onChoose={onChoose}
          />
        ))}

        <Float speed={1.1} floatIntensity={0.2} rotationIntensity={0.1}>
          <group position={[0, 2.55, 1.65]}>
            <mesh>
              <torusKnotGeometry args={[0.34, 0.045, 84, 10]} />
              <meshStandardMaterial color="#f1c75b" emissive="#f1c75b" emissiveIntensity={0.55} roughness={0.18} />
            </mesh>
            <Text position={[0, -0.58, 0]} fontSize={0.17} color="#f6f1e8" anchorX="center" anchorY="middle">
              DEMOCRACY CORE
            </Text>
          </group>
        </Float>
      </Canvas>
    </div>
  );
}

function GameStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/12 bg-[#071214]/72 px-3 py-2 text-white shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#f1c75b]" />
        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/52">{label}</span>
      </div>
      <p className="mt-1 text-lg font-black leading-none">{value}</p>
    </div>
  );
}

function Chapter4Game() {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(18);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_ROUND_SECONDS);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const question = gameQuestions[questionIndex];
  const locked = selectedIndex !== null || finished || !started;
  const progress = finished ? gameQuestions.length : questionIndex + (answerState === "correct" ? 1 : 0);
  const selectedCorrect = selectedIndex === question.answer;
  const timePercent = Math.max(0, (timeLeft / GAME_ROUND_SECONDS) * 100);
  const isBossRound = started && !finished && questionIndex === gameQuestions.length - 1;
  const rank = getGameRank(score, energy);
  const streakTitle = combo >= 4 ? "Siêu tốc" : combo >= 2 ? "Đang nóng" : "Khởi động";

  const chooseAnswer = useCallback((index: number, timedOut = false) => {
    if (locked) return;
    const correct = !timedOut && index === question.answer;
    const gained = correct ? 140 + combo * 35 + timeLeft * 8 : timedOut ? -35 : -15;
    setSelectedIndex(timedOut ? -1 : index);
    setAnswerState(correct ? "correct" : "wrong");
    setScore((value) => Math.max(0, value + gained));
    setEnergy((value) => clampEnergy(value + (correct ? 12 + Math.ceil(timeLeft / 3) : timedOut ? -24 : -16)));
    setCombo((value) => (correct ? value + 1 : 0));
    setLastDelta(gained);
    setBurstKey((value) => value + 1);
    playGameTone(correct ? "correct" : "wrong");
  }, [combo, locked, question.answer, timeLeft]);

  useGameKeyboard(chooseAnswer, started && !locked);

  useEffect(() => {
    if (!started || finished || selectedIndex !== null) return;
    if (timeLeft <= 0) {
      chooseAnswer(-1, true);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [chooseAnswer, finished, selectedIndex, started, timeLeft]);

  const nextRound = () => {
    if (questionIndex === gameQuestions.length - 1) {
      setFinished(true);
      setEnergy((value) => clampEnergy(value + 10));
      playGameTone("finish");
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelectedIndex(null);
    setAnswerState("idle");
    setTimeLeft(GAME_ROUND_SECONDS);
    setLastDelta(null);
  };

  const resetGame = () => {
    playGameTone("start");
    setStarted(true);
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswerState("idle");
    setScore(0);
    setCombo(0);
    setEnergy(18);
    setFinished(false);
    setTimeLeft(GAME_ROUND_SECONDS);
    setLastDelta(null);
    setBurstKey(0);
  };

  return (
    <div className="overflow-hidden rounded-[8px] border border-white/10 bg-[#071214] shadow-2xl">
      <div className="relative min-h-[780px] md:min-h-[640px] lg:min-h-[560px]">
        <GameArenaScene
          question={question}
          selectedIndex={selectedIndex}
          answerState={answerState}
          progress={progress}
          combo={combo}
          timeLeft={timeLeft}
          burstKey={burstKey}
          onChoose={chooseAnswer}
          locked={locked}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,20,0.92),rgba(7,18,20,0.38),rgba(7,18,20,0.12)),linear-gradient(0deg,rgba(7,18,20,0.82),transparent_32%,rgba(7,18,20,0.48))]" />

        <div className="pointer-events-none absolute inset-0 flex flex-col gap-4 p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/14 bg-white/9 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f1c75b] backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                3D Quiz Arena
              </div>
              <h3 className="mt-4 text-4xl font-black leading-[0.92] tracking-tight text-white md:text-6xl">
                Pháp Quyền Quest
              </h3>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/72 md:text-base">
                Bay qua cổng đáp án, sạc năng lượng dân chủ và mở khóa quảng trường pháp quyền.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <GameStat icon={Trophy} label="Điểm" value={String(score)} />
              <GameStat icon={Clock} label="Thời gian" value={started && !finished ? `${timeLeft}s` : "18s"} />
              <GameStat icon={Gauge} label="Năng lượng" value={`${energy}%`} />
              <GameStat icon={BadgeCheck} label="Combo" value={`x${combo}`} />
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
            <div className="overflow-hidden rounded-full border border-white/12 bg-black/30 p-1 backdrop-blur-md">
              <motion.div
                animate={{ width: `${timePercent}%` }}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                className={`h-3 rounded-full ${
                  timeLeft <= 5 ? "bg-[#ff6b5f]" : combo >= 2 ? "bg-[#55e39c]" : "bg-[#f1c75b]"
                }`}
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em]">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-white/12 bg-[#071214]/70 px-3 py-2 text-[#f1c75b] backdrop-blur-md">
                <Flame className="h-4 w-4" />
                {streakTitle}
              </span>
              {isBossRound && (
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#ff6b5f]/50 bg-[#ff6b5f]/18 px-3 py-2 text-[#ffd4ce] backdrop-blur-md">
                  <Zap className="h-4 w-4" />
                  Boss cuối
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {lastDelta !== null && (
              <motion.div
                key={`${burstKey}-${lastDelta}`}
                initial={{ opacity: 0, y: 18, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                className={`mx-auto mt-3 inline-flex items-center gap-2 rounded-[8px] border px-4 py-2 text-sm font-black uppercase tracking-[0.12em] backdrop-blur-md ${
                  lastDelta > 0
                    ? "border-[#55e39c]/40 bg-[#55e39c]/18 text-[#d9ffee]"
                    : "border-[#ff6b5f]/40 bg-[#ff6b5f]/18 text-[#ffe0dc]"
                }`}
              >
                {lastDelta > 0 ? <Zap className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {lastDelta > 0 ? `+${lastDelta} điểm tốc độ` : "Hết nhịp, mất năng lượng"}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="-mt-16 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_420px] lg:items-center">
            <div className="hidden max-w-xl rounded-[8px] border border-white/12 bg-[#071214]/62 p-4 backdrop-blur-md md:block">
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#f1c75b]">
                <Keyboard className="h-4 w-4" />
                Điều khiển nhanh
              </div>
              <div className="grid gap-2 text-sm font-semibold text-white/72 sm:grid-cols-3">
                <span className="rounded-[8px] bg-white/8 px-3 py-2">A / 1: Cổng A</span>
                <span className="rounded-[8px] bg-white/8 px-3 py-2">B / 2: Cổng B</span>
                <span className="rounded-[8px] bg-white/8 px-3 py-2">C / 3: Cổng C</span>
              </div>
            </div>

            <motion.aside
              key={`${questionIndex}-${started}-${finished}-${selectedIndex}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto rounded-[8px] border border-white/12 bg-[#f6f1e8]/96 p-4 text-[#17211d] shadow-2xl backdrop-blur-md"
            >
              {!started ? (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#17211d] text-[#f1c75b]">
                      <Gamepad2 className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b83a2a]">Nhiệm vụ</p>
                      <h3 className="text-2xl font-black">Cứu lõi dân chủ</h3>
                    </div>
                  </div>
                  <p className="text-sm font-semibold leading-7 text-[#44564e]">
                    Mỗi câu hỏi mở ra 3 cổng. Chọn đúng để tăng năng lượng, giữ combo và làm sáng các tinh thể kiến thức.
                    Chọn sai vẫn học được giải thích, nhưng năng lượng sẽ giảm.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-black uppercase tracking-[0.1em] text-[#617269]">
                    <span className="rounded-[8px] bg-white px-2 py-2">18s/câu</span>
                    <span className="rounded-[8px] bg-white px-2 py-2">Combo xịn</span>
                    <span className="rounded-[8px] bg-white px-2 py-2">Boss cuối</span>
                  </div>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#b83a2a] px-4 py-3 text-sm font-black text-white transition hover:bg-[#972d22]"
                  >
                    <Play className="h-5 w-5" />
                    Bắt đầu chơi
                  </button>
                </div>
              ) : finished ? (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#1f6f5b] text-white">
                      <Trophy className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1f6f5b]">Hoàn thành</p>
                      <h3 className="text-2xl font-black">Quảng trường đã sáng!</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-[8px] bg-white p-3 text-center">
                      <p className="text-xs font-black uppercase text-[#617269]">Điểm</p>
                      <p className="mt-1 text-xl font-black">{score}</p>
                    </div>
                    <div className="rounded-[8px] bg-white p-3 text-center">
                      <p className="text-xs font-black uppercase text-[#617269]">Năng lượng</p>
                      <p className="mt-1 text-xl font-black">{energy}%</p>
                    </div>
                    <div className="rounded-[8px] bg-white p-3 text-center">
                      <p className="text-xs font-black uppercase text-[#617269]">Câu hỏi</p>
                      <p className="mt-1 text-xl font-black">{gameQuestions.length}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-[8px] border border-[#f1c75b]/50 bg-[#17211d] p-3 text-center text-[#f1c75b]">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-white/58">Xếp hạng</p>
                    <p className="mt-1 text-xl font-black">{rank}</p>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-7 text-[#44564e]">
                    Bạn đã ôn đủ mạch: dân chủ, pháp luật, nhà nước XHCN, chức năng và liên hệ Việt Nam.
                  </p>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#17211d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#24352e]"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Chơi lại để phá kỷ lục
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b83a2a]">
                        Câu {questionIndex + 1}/{gameQuestions.length} · {question.domain}
                      </p>
                      <h3 className="mt-2 text-xl font-black leading-tight">{question.prompt}</h3>
                    </div>
                    <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[#17211d] text-[#f1c75b] sm:grid">
                      <Scale className="h-6 w-6" />
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {question.choices.map((choice, index) => {
                      const isSelected = selectedIndex === index;
                      const isCorrectChoice = question.answer === index;
                      const selectedCorrect = selectedIndex === question.answer;
                      const tone =
                        selectedIndex === null
                          ? "border-[#17211d]/10 bg-white hover:border-[#b83a2a]/50"
                          : isSelected && selectedCorrect
                            ? "border-[#1f6f5b] bg-[#e9f8f1]"
                            : isSelected && !selectedCorrect
                              ? "border-[#b83a2a] bg-[#fff0ed]"
                              : isCorrectChoice
                                ? "border-[#1f6f5b]/50 bg-white"
                                : "border-[#17211d]/8 bg-white/70";
                      return (
                        <button
                          key={choice.label}
                          type="button"
                          disabled={locked}
                          onClick={() => chooseAnswer(index)}
                          className={`flex items-center gap-3 rounded-[8px] border p-2.5 text-left transition ${tone}`}
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#17211d] text-sm font-black text-[#f1c75b]">
                            {choice.label}
                          </span>
                          <span className="text-sm font-bold leading-5 text-[#24352e]">{choice.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedIndex !== null && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                      <div
                        className={`rounded-[8px] border p-2.5 ${
                          selectedCorrect
                            ? "border-[#1f6f5b]/30 bg-[#e9f8f1] text-[#164d40]"
                            : "border-[#b83a2a]/30 bg-[#fff0ed] text-[#7e281f]"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2 text-sm font-black">
                          {selectedCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          {selectedCorrect
                            ? "Chuẩn! Cổng pháp quyền mở khóa."
                            : selectedIndex === -1
                              ? "Hết giờ! Cổng đúng đã được bật sáng."
                              : "Chưa đúng, nhưng đã nhặt được kiến thức."}
                        </div>
                        <p className="text-sm font-semibold leading-6">{question.explain}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#617269]">
                          <BookOpenCheck className="h-4 w-4 text-[#1f6f5b]" />
                          {question.keyword}
                        </div>
                        <button
                          type="button"
                          onClick={nextRound}
                          className="inline-flex items-center gap-2 rounded-[8px] bg-[#b83a2a] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#972d22]"
                        >
                          {questionIndex === gameQuestions.length - 1 ? "Hoàn thành" : "Câu tiếp"}
                          <Gavel className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.aside>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 hidden max-w-sm rounded-[8px] border border-white/12 bg-[#071214]/64 p-3 text-xs font-semibold leading-5 text-white/64 backdrop-blur-md 2xl:block">
          <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-[0.14em] text-[#f1c75b]">
            <ShieldCheck className="h-4 w-4" />
            Luật chơi
          </div>
          Trả lời đúng để sạc lõi dân chủ. Nội dung bám Chương 4: dân chủ XHCN, nhà nước XHCN và nhà nước pháp quyền ở Việt Nam.
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto mb-10 max-w-3xl text-center" : "mb-10 max-w-3xl"}>
      <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#B83A2A]">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black leading-tight tracking-tight text-[#17211D] md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-7 text-[#5E6F66]">{subtitle}</p>}
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(lessonBlocks[0].id);
  const [openQuiz, setOpenQuiz] = useState<number | null>(0);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedLesson = lessonBlocks.find((lesson) => lesson.id === activeLesson) ?? lessonBlocks[0];

  const chatHistory = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
    [messages],
  );

  const openChat = () => {
    setIsMenuOpen(false);
    setIsChatOpen(true);
  };

  const handleSend = async (text = inputValue) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const prompt = cleanText.toLowerCase().includes("chương 4")
      ? cleanText
      : `${cleanText}\n\nNgữ cảnh ưu tiên: Chương 4 MLN - Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa.`;

    const nextMessages: Message[] = [...messages, { role: "user", text: cleanText }];

    setMessages(nextMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const answer = await getChatResponse(prompt, chatHistory);
      setMessages([...nextMessages, { role: "model", text: answer }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "model",
          text: "Mình chưa kết nối được hệ thống hỏi đáp. Bạn vẫn có thể học theo các mục Tổng quan, Bài học, So sánh, Việt Nam và Luyện tập trên trang.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSend();
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#17211D] selection:bg-[#B83A2A] selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#17211D]/10 bg-[#F6F1E8]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <a href="#" className="flex items-center gap-3 font-semibold" aria-label="Về đầu trang">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#17211D] text-[#F6F1E8]">
              <Scale className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              Chương 4 MLN
              <span className="block text-xs font-medium text-[#63756B]">
                Dân chủ và Nhà nước
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[#44564E] transition hover:bg-[#17211D]/6"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openChat}
              aria-label="Mở trợ lý AI"
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#B83A2A] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#972D22]"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Hỏi AI</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-[8px] border border-[#17211D]/10 bg-white/70 md:hidden"
              aria-label="Mở menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#17211D]/10 bg-[#F6F1E8] md:hidden"
            >
              <div className="grid gap-1 px-4 py-3">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-[8px] px-3 py-3 text-sm font-semibold text-[#44564E] hover:bg-[#17211D]/6"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative min-h-[92vh] overflow-hidden pt-16">
          <img
            src={images.hero}
            alt="Tòa nhà Quốc hội Việt Nam"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.96),rgba(23,33,29,0.78),rgba(23,33,29,0.18))]" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F6F1E8] to-transparent" />

          <div className="relative mx-auto flex min-h-[calc(92vh-4rem)] max-w-7xl items-center px-4 py-16 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl text-white"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F1C75B] backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Chủ nghĩa xã hội khoa học
              </div>
              <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-tight md:text-7xl lg:text-8xl">
                Dân chủ XHCN
                <span className="block text-[#F1C75B]">và Nhà nước XHCN</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 md:text-xl">
                Một trang học trực quan cho Chương 4: hiểu khái niệm, nắm bản chất,
                phân biệt dân chủ với nhà nước, và biết cách liên hệ Việt Nam khi làm bài.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#bai-hoc"
                  className="inline-flex items-center gap-2 rounded-[8px] bg-[#F1C75B] px-5 py-3 text-sm font-bold text-[#17211D] transition hover:bg-[#FFDA72]"
                >
                  Học theo 3 phần
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#luyen-tap"
                  className="inline-flex items-center gap-2 rounded-[8px] border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/18"
                >
                  Luyện trả lời
                  <CircleHelp className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="tong-quan" className="py-18 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow="Tổng quan"
              title="Nhìn một lần là thấy mạch chương"
              subtitle="Chương 4 xoay quanh một câu hỏi lớn: nhân dân làm chủ bằng cách nào, và nhà nước tổ chức quyền làm chủ đó ra sao?"
            />

            <div className="grid gap-4 md:grid-cols-4">
              {overview.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.article
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-[8px] border border-[#17211D]/10 bg-white p-5 shadow-sm"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#1F6F5B] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#B83A2A]">
                      {card.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-black leading-tight">{card.value}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#617269]">{card.text}</p>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[8px] bg-[#17211D] p-6 text-white md:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[8px] bg-[#F1C75B] text-[#17211D]">
                    <Network className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                      Công thức nhớ
                    </p>
                    <h3 className="mt-2 text-2xl font-black md:text-3xl">
                      Dân chủ là mục tiêu, nhà nước là công cụ tổ chức thực hiện
                    </h3>
                    <p className="mt-4 text-base leading-8 text-white/72">
                      Nếu nhớ được câu này, bạn sẽ dễ xử lý hầu hết câu hỏi của chương:
                      dân chủ nói về quyền làm chủ; nhà nước nói về thiết chế bảo đảm quyền làm chủ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[8px] border border-[#17211D]/10 bg-white p-5">
                {principles.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 border-b border-[#17211D]/8 pb-3 last:border-b-0 last:pb-0">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-[#F6F1E8] text-[#B83A2A]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-black">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#617269]">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="bai-hoc" className="bg-white py-18 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow="Bài học"
              title="Ba phần trọng tâm của Chương 4"
              subtitle="Chọn từng phần để học theo kiểu: luận điểm chính, ý cần ghi nhớ, mẹo triển khai khi đi thi."
            />

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="grid content-start gap-3">
                {lessonBlocks.map((lesson) => {
                  const Icon = lesson.icon;
                  const isActive = lesson.id === activeLesson;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`flex items-center justify-between rounded-[8px] border p-4 text-left transition ${
                        isActive
                          ? "border-[#B83A2A] bg-[#B83A2A] text-white shadow-md"
                          : "border-[#17211D]/10 bg-[#F6F1E8] text-[#17211D] hover:border-[#B83A2A]/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-[8px] ${isActive ? "bg-white/15" : "bg-white"}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-xs font-black uppercase tracking-[0.14em] opacity-70">
                            {lesson.eyebrow}
                          </span>
                          <span className="mt-1 block text-sm font-black leading-5">{lesson.title}</span>
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0" />
                    </button>
                  );
                })}
              </div>

              <motion.article
                key={selectedLesson.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden rounded-[8px] border border-[#17211D]/10 bg-[#F6F1E8]"
              >
                <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative min-h-[320px]">
                    <img
                      src={selectedLesson.image}
                      alt={selectedLesson.imageAlt}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17211D]/80 via-[#17211D]/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                        {selectedLesson.eyebrow}
                      </p>
                      <h3 className="mt-2 text-3xl font-black leading-tight text-white md:text-4xl">
                        {selectedLesson.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <p className="rounded-[8px] bg-white p-5 text-base font-semibold leading-8 text-[#24352E]">
                      {selectedLesson.thesis}
                    </p>
                    <div className="mt-5 grid gap-3">
                      {selectedLesson.core.map((item) => (
                        <div key={item} className="flex gap-3 text-sm leading-6 text-[#44564E]">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1F6F5B]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3 rounded-[8px] border border-[#B83A2A]/20 bg-[#B83A2A]/8 p-4 text-sm font-bold leading-6 text-[#7E281F]">
                      <SearchCheck className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{selectedLesson.examHint}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="so-sanh" className="py-18 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow="So sánh"
              title="Đừng học lẫn: dân chủ và nhà nước khác nhau ở đâu?"
              align="center"
            />

            <div className="overflow-hidden rounded-[8px] border border-[#17211D]/10 bg-white shadow-sm">
              <div className="grid bg-[#17211D] text-white md:grid-cols-[180px_1fr_1fr]">
                <div className="p-4 text-sm font-black uppercase tracking-[0.14em] text-[#F1C75B]">Tiêu chí</div>
                <div className="border-t border-white/10 p-4 font-black md:border-l md:border-t-0">Dân chủ XHCN</div>
                <div className="border-t border-white/10 p-4 font-black md:border-l md:border-t-0">Nhà nước XHCN</div>
              </div>
              {compareRows.map((row) => (
                <div key={row.label} className="grid border-t border-[#17211D]/10 md:grid-cols-[180px_1fr_1fr]">
                  <div className="bg-[#F6F1E8] p-4 text-sm font-black text-[#B83A2A]">{row.label}</div>
                  <div className="border-t border-[#17211D]/8 p-4 text-sm leading-6 text-[#44564E] md:border-l md:border-t-0">
                    {row.democracy}
                  </div>
                  <div className="border-t border-[#17211D]/8 p-4 text-sm leading-6 text-[#44564E] md:border-l md:border-t-0">
                    {row.state}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="viet-nam" className="bg-[#17211D] py-18 text-white md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                  Liên hệ Việt Nam
                </p>
                <h2 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
                  Nhà nước pháp quyền XHCN: học để biết cách liên hệ
                </h2>
                <p className="mt-5 text-base leading-8 text-white/70">
                  Khi làm bài, phần liên hệ Việt Nam nên đi từ lịch sử hình thành dân chủ,
                  đến yêu cầu xây dựng nhà nước pháp quyền, rồi kết bằng trách nhiệm công dân.
                </p>
                <div className="mt-7 flex gap-3 rounded-[8px] border border-white/12 bg-white/[0.06] p-4">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[#F1C75B]" />
                  <p className="text-sm font-semibold leading-7 text-white/78">
                    Câu chốt: Quyền lực nhà nước thuộc về nhân dân, được tổ chức bằng pháp luật,
                    dưới sự lãnh đạo của Đảng, nhằm phục vụ nhân dân.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {vietnamTimeline.map((item, index) => (
                  <motion.article
                    key={item.year}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.06 }}
                    className="grid gap-4 rounded-[8px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur md:grid-cols-[140px_1fr]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#F1C75B] text-[#17211D]">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <p className="text-xl font-black text-[#F1C75B]">{item.year}</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
                    </div>
                  </motion.article>
                ))}

                <div className="rounded-[8px] bg-[#F6F1E8] p-6 text-[#17211D] md:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#1F6F5B] text-white">
                      <Scale className="h-5 w-5" />
                    </span>
                    <h3 className="text-2xl font-black">4 hướng xây dựng cần nhớ</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "Hoàn thiện pháp luật và cơ chế kiểm soát quyền lực.",
                      "Cải cách hành chính, xây dựng bộ máy tinh gọn, hiệu quả.",
                      "Nâng cao chất lượng cán bộ, công chức.",
                      "Phòng, chống tham nhũng, lãng phí, thực hành tiết kiệm.",
                    ].map((item) => (
                      <div key={item} className="flex gap-3 text-sm font-semibold leading-6 text-[#44564E]">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1F6F5B]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="luyen-tap" className="py-18 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow="Luyện tập"
              title="Từ ghi nhớ đến trả lời được câu hỏi"
              subtitle="Phần này gom dàn ý và câu hỏi tự kiểm tra để người học chuyển kiến thức thành bài làm."
            />

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[8px] border border-[#17211D]/10 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#B83A2A] text-white">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-black">Dàn ý trả lời 5 bước</h3>
                </div>
                <div className="grid gap-3">
                  {examBlueprint.map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-[8px] bg-[#F6F1E8] p-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[#17211D] text-sm font-black text-[#F1C75B]">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold leading-6 text-[#44564E]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#17211D]/10 bg-white p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#1F6F5B] text-white">
                    <CircleHelp className="h-5 w-5" />
                  </span>
                  <h3 className="text-2xl font-black">Lật câu hỏi ôn tập</h3>
                </div>
                <div className="grid gap-3">
                  {quizItems.map((item, index) => {
                    const isOpen = openQuiz === index;
                    return (
                      <button
                        key={item.question}
                        type="button"
                        onClick={() => setOpenQuiz(isOpen ? null : index)}
                        className="rounded-[8px] border border-[#17211D]/10 bg-[#F6F1E8] p-4 text-left transition hover:border-[#B83A2A]/40"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-black leading-6">{item.question}</p>
                          <ChevronRight className={`mt-1 h-5 w-5 shrink-0 transition ${isOpen ? "rotate-90 text-[#B83A2A]" : ""}`} />
                        </div>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 overflow-hidden text-sm leading-6 text-[#617269]"
                            >
                              {item.answer}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#17211D] py-18 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-10 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                  Game 3D
                </p>
                <h2 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
                  Pháp Quyền Quest
                </h2>
              </div>
              <p className="text-base font-semibold leading-8 text-white/68">
                Một mini game 3D bám sát Chương 4: người chơi chọn cổng đáp án A/B/C,
                tăng điểm, giữ combo và mở khóa các tinh thể kiến thức về dân chủ, nhà nước và pháp quyền.
              </p>
            </div>
            <div id="game" className="scroll-mt-24">
              <Chapter4Game />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#17211D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                <Landmark className="h-4 w-4" />
                Chương 4 MLN
              </div>
              <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
                Hiểu dân chủ là hiểu cách quyền lực nhân dân được tổ chức.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between rounded-[8px] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white/82 transition hover:border-[#F1C75B]/60 hover:bg-white/[0.1] hover:text-white"
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 text-[#F1C75B] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={openChat}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-[8px] bg-[#17211D] text-white shadow-xl transition hover:bg-[#B83A2A]"
        aria-label="Mở trợ lý AI"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            className="fixed bottom-4 right-4 z-50 flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[440px] flex-col overflow-hidden rounded-[8px] border border-[#17211D]/10 bg-[#F6F1E8] shadow-2xl md:h-[720px]"
          >
            <div className="flex items-center justify-between border-b border-[#17211D]/10 bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#B83A2A] text-white">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-black">Trợ lý Chương 4</h2>
                  <p className="text-xs text-[#617269]">Tóm tắt, phân tích, luyện câu hỏi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-[8px] hover:bg-[#17211D]/6"
                aria-label="Đóng trợ lý AI"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-[#17211D]/10 p-4">
              <div className="grid gap-2">
                {suggestedQuestions.slice(0, 2).map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void handleSend(question)}
                    className="rounded-[8px] border border-[#17211D]/10 bg-white px-3 py-2 text-left text-xs font-semibold leading-5 text-[#44564E] transition hover:border-[#B83A2A]/40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[86%] rounded-[8px] px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "ml-auto bg-[#17211D] text-white"
                        : "mr-auto border border-[#17211D]/10 bg-white text-[#17211D]"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ))}
                {isLoading && (
                  <div className="mr-auto rounded-[8px] border border-[#17211D]/10 bg-white px-4 py-3 text-sm text-[#617269]">
                    Đang tìm câu trả lời...
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[#17211D]/10 bg-white p-4">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Nhập câu hỏi về Chương 4"
                className="min-w-0 flex-1 rounded-[8px] border border-[#17211D]/10 bg-[#F6F1E8] px-4 py-3 text-sm outline-none transition focus:border-[#B83A2A]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#B83A2A] text-white transition hover:bg-[#972D22] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi câu hỏi"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
