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
  ClipboardCheck,
  Clock,
  FileText,
  Flame,
  Gavel,
  Gamepad2,
  Gauge,
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
import { NavLink, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import EscapeRoomApp from "../components/EscapeRoomApp.jsx";
import { getChatResponse } from "./lib/gemini";

type Message = {
  role: "user" | "model";
  text: string;
};

type LessonSubSection = {
  id: string;
  title: string;
  detail: string;
  points: string[];
};

type LessonSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
  subSections: LessonSubSection[];
};

type CompareRow = {
  label: string;
  democracy: string;
  state: string;
};

const navItems = [
  { id: "tong-quan", label: "Tổng quan", path: "/tong-quan" },
  { id: "bai-hoc", label: "Bài học", path: "/bai-hoc" },
  { id: "viet-nam", label: "Việt Nam", path: "/viet-nam" },
  { id: "game", label: "Game", path: "/game" },
];

const images = {
  hero:
    "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Assembly%20Building%20of%20Vietnam.jpg",
  assembly: "/images/lesson-assembly.jpg",
  hall: "/images/lesson-hall.jpg",
  constitution:
    "https://commons.wikimedia.org/wiki/Special:FilePath/National%20Assembly%20Building%20of%20Vietnam%2027-10-2025.jpg",
};

const overview = [
  {
    label: "Trọng tâm 1",
    value: "Sự ra đời",
    text: "Nhà nước XHCN ra đời từ cách mạng XHCN, đáp ứng khát vọng công bằng và bình đẳng.",
    icon: Landmark,
  },
  {
    label: "Trọng tâm 2",
    value: "Bản chất 3 phương diện",
    text: "Chính trị, kinh tế, văn hóa - xã hội tạo nên bản chất nhà nước kiểu mới.",
    icon: Scale,
  },
  {
    label: "Trọng tâm 3",
    value: "Chức năng",
    text: "Đối nội, đối ngoại và chức năng giai cấp, xã hội trong quản lý đất nước.",
    icon: Gavel,
  },
  {
    label: "Trọng tâm 4",
    value: "Quan hệ dân chủ - nhà nước",
    text: "Dân chủ là nền tảng, nhà nước là công cụ thể chế hóa và bảo vệ quyền làm chủ.",
    icon: Vote,
  },
];

const lessonSections: LessonSection[] = [
  {
    id: "phan-1",
    eyebrow: "Phần 1",
    title: "Sự ra đời, bản chất, chức năng của nhà nước XHCN",
    description:
      "Tập trung vào nguồn gốc - hình thức ra đời, bản chất 3 phương diện và hệ chức năng đối nội/đối ngoại, giai cấp/xã hội.",
    image: images.assembly,
    imageAlt: "Tòa nhà Quốc hội Việt Nam",
    icon: Landmark,
    subSections: [
      {
        id: "phan-1-a",
        title: "a) Sự ra đời của nhà nước XHCN",
        detail:
          "Khát vọng về một xã hội công bằng, bình đẳng, không có áp bức bóc lột đã có từ lâu. Nhà nước XHCN ra đời là kết quả tất yếu của cách mạng XHCN do giai cấp công nhân và nhân dân lao động tiến hành dưới sự lãnh đạo của Đảng Cộng sản; đồng thời là kết quả của đấu tranh giai cấp gay gắt giữa giai cấp công nhân và giai cấp tư sản khi chủ nghĩa tư bản phát triển đến trình độ nhất định.",
        points: [
          "Nguồn gốc và nguyên nhân: khát vọng xã hội công bằng, bình đẳng, không có áp bức bóc lột.",
          "Sự ra đời gắn với cách mạng XHCN và cuộc đấu tranh giai cấp giữa công nhân và tư sản.",
          "Hình thức ra đời: bạo lực cách mạng hoặc hòa bình, tùy điều kiện lịch sử cụ thể.",
          "Khái niệm: nhà nước kiểu mới mang bản chất giai cấp công nhân, đại diện lợi ích nhân dân lao động và toàn thể nhân dân, có sứ mệnh xây dựng thành công CNXH, đưa nhân dân lao động lên địa vị làm chủ trên mọi mặt đời sống.",
          "Nhà nước XHCN đầu tiên được thiết lập sau Cách mạng Tháng Mười Nga (1917).",
          "Ví dụ Việt Nam: Nhà nước Việt Nam Dân chủ Cộng hòa ra đời từ Cách mạng Tháng Tám 1945, đập tan ách thống trị thực dân, phát xít và phong kiến, thiết lập chính quyền của nhân dân, do nhân dân, vì nhân dân.",
        ],
      },
      {
        id: "phan-1-b",
        title: "b) Bản chất của nhà nước XHCN",
        detail:
          "Nhà nước XHCN là nhà nước kiểu mới, có bản chất khác hẳn các kiểu nhà nước bóc lột trước đây, thể hiện sâu sắc ở ba phương diện: chính trị, kinh tế, văn hóa - xã hội.",
        points: [
          "Về chính trị: mang bản chất giai cấp công nhân, thực hiện quyền lực của nhân dân, dựa trên liên minh công - nông - trí thức; nhân dân là chủ thể quyền lực thông qua dân chủ trực tiếp và đại diện.",
          "Vận dụng thực tế: quyền lực nhà nước thống nhất, thuộc về nhân dân; người dân bầu cử Quốc hội, HĐND và thực hiện phương châm 'Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng'.",
          "Về kinh tế: cơ sở là chế độ sở hữu xã hội (công hữu) về tư liệu sản xuất chủ yếu; nhà nước tổ chức, thiết lập và phát triển quan hệ sản xuất mới, xóa bỏ áp bức bóc lột, hướng tới công bằng và nâng cao đời sống.",
          "Vận dụng thực tế: nhà nước giữ vai trò chủ đạo ở các ngành then chốt, điều tiết vĩ mô, bảo đảm an ninh kinh tế và an sinh xã hội.",
          "Về văn hóa - xã hội: xây dựng trên nền tảng lý luận Mac - Lenin và giá trị văn hoá tiên tiến; thu thập giá trị văn hoá tiên tiến; thu hẹp bất bình đẳng, hướng tới xã hội hòa hợp, phát triển con người toàn diện.",
          "Vận dụng thực tế: chương trình xóa đói giảm nghèo, hỗ trợ vùng dân tộc thiểu số, bảo hiểm y tế cho trẻ em dưới 6 tuổi và người nghèo.",
        ],
      },
      {
        id: "phan-1-c",
        title: "c) Chức năng của nhà nước XHCN",
        detail:
          "Chức năng của nhà nước XHCN rất rộng lớn, được phân loại theo phạm vi tác động và theo tính chất quyền lực nhà nước.",
        points: [
          "Căn cứ phạm vi tác động: đối nội (quản lý kinh tế, chính trị, văn hóa, giáo dục, y tế, an ninh quốc phòng) và đối ngoại (bảo vệ độc lập, chủ quyền, toàn vẹn lãnh thổ; hợp tác quốc tế, hữu nghị, cùng phát triển).",
          "Vận dụng thực tế: đối nội ban hành Luật Đất đai, Luật Đầu tư; đối ngoại tham gia LHQ, ASEAN, ký FTA và thực hiện chính sách quốc phòng '4 không'.",
          "Căn cứ tính chất quyền lực: chức năng giai cấp (trấn áp thế lực phản động, tội phạm xâm phạm an ninh quốc gia, trật tự xã hội).",
          "Chức năng xã hội (tổ chức và xây dựng): trọng tâm quản lý kinh tế, phát triển văn hóa, giáo dục, y tế, chăm lo đời sống nhân dân; V.I. Lenin nhấn mạnh vai trò quản lý kinh tế, tổ chức xã hội mới.",
          "Vận dụng thực tế: xử lý các đại án tham nhũng, buôn lậu; đầu tư hạ tầng, sân bay, bệnh viện, trường học; triển khai tiêm chủng mở rộng.",
        ],
      },
    ],
  },
  {
    id: "phan-2",
    eyebrow: "Phần 2",
    title: "Mối quan hệ giữa dân chủ XHCN và nhà nước XHCN",
    description:
      "Dân chủ là nền tảng để xây dựng nhà nước; nhà nước là công cụ thể chế hóa và bảo vệ quyền làm chủ.",
    image: images.hall,
    imageAlt: "Hội trường Diên Hồng",
    icon: Users,
    subSections: [
      {
        id: "phan-2-a",
        title: "a) Dân chủ là cơ sở, nền tảng",
        detail:
          "Dân chủ XHCN là cơ sở, nền tảng cho việc xây dựng và hoạt động của nhà nước XHCN; bảo đảm quyền lực thuộc về nhân dân và tạo điều kiện để nhân dân thực hiện quyền làm chủ trên mọi lĩnh vực của đời sống xã hội.",
        points: [
          "Dân chủ XHCN bảo đảm quyền lực thuộc về nhân dân; người dân tham gia quản lý nhà nước và xã hội trực tiếp hoặc gián tiếp qua bầu cử, ứng cử công bằng, bình đẳng.",
          "Thể hiện bản chất tiến bộ của nền dân chủ xã hội chủ nghĩa: mọi quyền lực thuộc về nhân dân.",
          "Ví dụ: người dân bầu cử Quốc hội và HĐND các cấp; góp ý sửa đổi Hiến pháp, luật pháp qua cổng thông tin, mạng xã hội, tiếp xúc cử tri.",
          "Dân chủ là nền tảng để xây dựng nhà nước của dân, do dân, vì dân; nhà nước phát huy trí tuệ, sức mạnh và sự sáng tạo của toàn dân.",
          "Thông qua dân chủ, nhà nước lắng nghe ý kiến nhân dân, điều chỉnh chính sách phù hợp thực tiễn, tăng đồng thuận xã hội.",
          "Dân chủ giúp kiểm soát quyền lực nhà nước thông qua giám sát và phản biện xã hội; ngăn tham nhũng, lạm quyền, quan liêu, tha hóa quyền lực.",
          "Nếu vi phạm dân chủ thì quyền lực của nhân dân dễ bị biến thành quyền lực của một nhóm người, dẫn đến chuyên quyền, độc đoán hoặc dân chủ hình thức.",
          "Bối cảnh hiện nay: yêu cầu minh bạch, trách nhiệm giải trình cao hơn; đồng thời xuất hiện thông tin sai lệch, lợi dụng dân chủ gây mất ổn định, cần nâng cao nhận thức và trách nhiệm công dân.",
        ],
      },
      {
        id: "phan-2-b",
        title: "b) Nhà nước là công cụ thực thi",
        detail:
          "Nhà nước XHCN trở thành công cụ quan trọng để thực thi quyền làm chủ của nhân dân, thông qua thể chế hóa bằng pháp luật, bảo vệ quyền và tổ chức quản lý xã hội.",
        points: [
          "Nhà nước thể chế hóa ý chí nhân dân thành pháp luật, quy định rõ quyền và nghĩa vụ công dân.",
          "Chính sách, pháp luật hướng đến phục vụ lợi ích nhân dân, bảo vệ quyền tự do, dân chủ hợp pháp và tạo hành lang tham gia quản lý xã hội.",
          "Ví dụ: Hiến pháp 2013 quy định quyền con người, quyền và nghĩa vụ cơ bản của công dân.",
          "Nhà nước bảo vệ quyền và lợi ích chính đáng của nhân dân; sử dụng pháp luật và bộ máy quản lý để giữ gìn an ninh, trật tự xã hội.",
          "Nhà nước tổ chức và quản lý xã hội: phát triển kinh tế, văn hóa, giáo dục, an sinh; nâng cao đời sống vật chất, tinh thần.",
          "Nhà nước không ngừng mở rộng dân chủ, hoàn thiện hình thức đại diện và tăng tham gia của nhân dân.",
          "Nếu nhà nước đánh mất bản chất thì nền dân chủ bị thu hẹp, dân chủ hình thức, chuyên chế độc tài. ",
          "Ý nghĩa: bảo đảm quyền lực thực sự thuộc về nhân dân, tạo động lực phát triển, củng cố niềm tin và giữ vững ổn định chính trị.",
        ],
      },
    ],
  },
];

const principles = [
  {
    title: "Dân chủ là nền tảng",
    text: "Dân chủ XHCN bảo đảm quyền lực thuộc về nhân dân trong mọi lĩnh vực.",
    icon: Hand,
  },
  {
    title: "Pháp luật là công cụ",
    text: "Nhà nước thể chế hóa ý chí nhân dân thành pháp luật để bảo vệ quyền và nghĩa vụ.",
    icon: FileText,
  },
  {
    title: "Kiểm soát quyền lực",
    text: "Giám sát xã hội giúp ngăn tham nhũng, lạm quyền và quan liêu.",
    icon: ShieldCheck,
  },
  {
    title: "Mở rộng dân chủ",
    text: "Hoàn thiện cơ chế đại diện, tăng tham gia và đồng thuận xã hội.",
    icon: ClipboardCheck,
  },
];

const compareRows: CompareRow[] = [
  {
    label: "Nền tảng",
    democracy: "Bảo đảm quyền lực thuộc về nhân dân và điều kiện để nhân dân làm chủ.",
    state: "Thể chế hóa ý chí nhân dân thành pháp luật và chính sách.",
  },
  {
    label: "Công cụ",
    democracy: "Tạo cơ chế để nhân dân tham gia quản lý và giám sát.",
    state: "Tổ chức bộ máy, nguồn lực để quyền làm chủ thành hiện thực.",
  },
  {
    label: "Kiểm soát quyền lực",
    democracy: "Giám sát xã hội, phản biện, chống tha hóa quyền lực.",
    state: "Công khai, minh bạch, kỷ luật, pháp luật, xử lý tham nhũng.",
  },
  {
    label: "Hệ quả",
    democracy: "Vi phạm dân chủ làm suy giảm niềm tin và biến quyền lực của nhân dân.",
    state: "Mất bản chất dẫn đến dân chủ hình thức, chuyên quyền.",
  },
];

const vietnamTimeline = [
  {
    year: "1945",
    title: "Nhà nước của nhân dân ra đời",
    text: "Cách mạng Tháng Tám lập nên chính quyền của nhân dân, do nhân dân, vì nhân dân.",
  },
  {
    year: "2013",
    title: "Hiến pháp khẳng định quyền công dân",
    text: "Quyền con người, quyền và nghĩa vụ công dân được quy định rõ trong Hiến pháp.",
    sourceHref: "https://chinhphu.vn/hien-phap-nam-2013/chuong-ii-quyen-con-nguoi-quyen-va-nghia-vu-co-ban-cua-cong-dan-10053009",
    sourceLabel: "Xem Chương II Hiến pháp 2013",
  },
  {
    year: "Hiện nay",
    title: "Cải cách, minh bạch, chuyển đổi số",
    text: "Mở rộng tham gia của người dân, công khai minh bạch, phòng chống tham nhũng.",
  },
];

const timelineCoverImages: Record<string, { src: string; alt: string; objectPosition?: string }> = {
  "1945": {
    src: "/images/qn1.jpg",
    alt: "Cách mạng Tháng Tám năm 1945",
    objectPosition: "center 34%",
  },
  "2013": {
    src: "/images/timeline-2013.jpg",
    alt: "Pháp luật và quyền công dân năm 2013",
  },
  "Hiện nay": {
    src: "/images/timeline-hien-nay.png",
    alt: "Cải cách, minh bạch và chuyển đổi số ở Việt Nam hiện nay",
    objectPosition: "center 20%",
  },
};


const suggestedQuestions = [
  "Tóm tắt nhà nước XHCN theo 3 ý chính",
  "Phân tích bản chất nhà nước XHCN theo 3 phương diện",
  "Giải thích mối quan hệ dân chủ - nhà nước XHCN",
  "Lập dàn ý câu hỏi về chức năng nhà nước XHCN",
];

const initialMessages: Message[] = [
  {
    role: "model",
    text: "Chào bạn. Mình đang ở chế độ học: Nhà nước XHCN và mối quan hệ giữa dân chủ XHCN với nhà nước XHCN. Bạn có thể hỏi tóm tắt, lập dàn ý, giải thích khái niệm hoặc luyện câu hỏi ôn tập.",
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
    domain: "Sự ra đời",
    prompt: "Nhà nước XHCN ra đời từ đâu?",
    choices: [
      { label: "A", text: "Từ cách mạng XHCN do giai cấp công nhân lãnh đạo" },
      { label: "B", text: "Từ thỏa hiệp giữa các giai cấp bóc lột" },
      { label: "C", text: "Từ sự tự phát của thị trường" },
    ],
    answer: 0,
    explain:
      "Nhà nước XHCN là kết quả tất yếu của cách mạng XHCN do giai cấp công nhân và nhân dân lao động lãnh đạo.",
    keyword: "Cách mạng XHCN",
  },
  {
    domain: "Hình thức",
    prompt: "Nhà nước XHCN có thể ra đời bằng những con đường nào?",
    choices: [
      { label: "A", text: "Bạo lực cách mạng hoặc hòa bình" },
      { label: "B", text: "Chỉ thông qua bạo lực" },
      { label: "C", text: "Chỉ bằng thương lượng" },
    ],
    answer: 0,
    explain:
      "Tùy điều kiện lịch sử, nhà nước XHCN có thể ra đời bằng bạo lực hoặc hòa bình.",
    keyword: "Hình thức ra đời",
  },
  {
    domain: "Bản chất",
    prompt: "Bản chất nhà nước XHCN thể hiện ở mấy phương diện?",
    choices: [
      { label: "A", text: "Ba phương diện: chính trị, kinh tế, văn hóa - xã hội" },
      { label: "B", text: "Chỉ một phương diện chính trị" },
      { label: "C", text: "Hai phương diện: chính trị và kinh tế" },
    ],
    answer: 0,
    explain:
      "Bản chất nhà nước XHCN thể hiện ở ba phương diện: chính trị, kinh tế, văn hóa - xã hội.",
    keyword: "Ba phương diện",
  },
  {
    domain: "Chức năng",
    prompt: "Chức năng đối nội của nhà nước XHCN là gì?",
    choices: [
      { label: "A", text: "Quản lý các lĩnh vực trong nước" },
      { label: "B", text: "Chỉ bảo vệ chủ quyền đối ngoại" },
      { label: "C", text: "Không can thiệp kinh tế - xã hội" },
    ],
    answer: 0,
    explain:
      "Đối nội là quản lý kinh tế, chính trị, văn hóa, giáo dục, y tế, an ninh trong nước.",
    keyword: "Đối nội",
  },
  {
    domain: "Quan hệ",
    prompt: "Trong mối quan hệ, dân chủ XHCN giữ vai trò nào?",
    choices: [
      { label: "A", text: "Nền tảng để xây dựng nhà nước" },
      { label: "B", text: "Chỉ là khẩu hiệu hình thức" },
      { label: "C", text: "Phụ thuộc hoàn toàn vào thị trường" },
    ],
    answer: 0,
    explain:
      "Dân chủ XHCN là nền tảng cho việc xây dựng và hoạt động của nhà nước XHCN.",
    keyword: "Dân chủ là nền tảng",
  },
  {
    domain: "Kiểm soát",
    prompt: "Dân chủ XHCN giúp kiểm soát quyền lực nhà nước bằng cách nào?",
    choices: [
      { label: "A", text: "Giám sát và phản biện xã hội" },
      { label: "B", text: "Bỏ qua trách nhiệm giải trình" },
      { label: "C", text: "Hạn chế tham gia của người dân" },
    ],
    answer: 0,
    explain:
      "Giám sát và phản biện xã hội giúp ngăn tham nhũng, lạm quyền và quan liêu.",
    keyword: "Giám sát quyền lực",
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

function LessonOverview() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#121C18] bg-cover bg-center bg-no-repeat pb-14 pt-20 md:py-18"
      style={{ backgroundImage: "url('/images/vietnam-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,28,24,0.92)_0%,rgba(18,28,24,0.72)_42%,rgba(18,28,24,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,28,24,0.82)_0%,rgba(18,28,24,0.42)_45%,rgba(18,28,24,0.88)_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 grid gap-5 md:mb-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
              Bài học
            </p>
            <h2 className="max-w-4xl text-4xl font-black leading-[1.05] text-white md:text-6xl">
              Chọn phần để xem nội dung chi tiết
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/72">
              Trang Bài học chia thành 2 phần lớn. Bấm vào từng phần để xem nội dung.
            </p>
          </div>
          <div className="rounded-[8px] border border-white/12 bg-white/[0.07] p-5 shadow-sm backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">Lộ trình học</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.05] p-4">
                <p className="text-3xl font-black text-white">2</p>
                <p className="mt-1 text-xs font-bold text-white/66">Phần nội dung</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.05] p-4">
                <p className="text-3xl font-black text-white">5</p>
                <p className="mt-1 text-xs font-bold text-white/66">Mục trọng tâm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {lessonSections.map((section) => {
            const Icon = section.icon;
            return (
              <NavLink
                key={section.id}
                to={`/bai-hoc/${section.id}`}
                className="group relative overflow-hidden rounded-[8px] border border-white/16 bg-white/[0.06] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-[#F1C75B]/55 hover:shadow-xl hover:shadow-black/24"
              >
                <div className="relative min-h-[360px] md:min-h-[430px]">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    loading="eager"
                    decoding="sync"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,28,24,0.32),rgba(18,28,24,0.94))]" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8">
                    <span className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-white/12 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/82">
                      <Icon className="h-4 w-4" />
                      {section.eyebrow}
                    </span>
                    <div>
                      <h3 className="max-w-2xl text-3xl font-black leading-tight md:text-4xl">{section.title}</h3>
                      <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/82 md:text-base">
                        {section.description}
                      </p>
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/18 pt-5">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-white/72">
                          {section.subSections.length} mục chi tiết
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#17211D] transition group-hover:bg-[#F1C75B]">
                          <ChevronRight className="h-5 w-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CompareTable() {
  return (
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
  );
}

function LessonDetailPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const selectedLesson = lessonSections.find((lesson) => lesson.id === sectionId) ?? lessonSections[0];
  const [activeSubSectionId, setActiveSubSectionId] = useState(
    selectedLesson.subSections[0]?.id ?? "",
  );
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const selectedSubSection = selectedLesson.subSections.find((section) => section.id === activeSubSectionId)
    ?? selectedLesson.subSections[0];

  useEffect(() => {
    setActiveSubSectionId(selectedLesson.subSections[0]?.id ?? "");
    setIsCompareOpen(false);
  }, [selectedLesson.id]);

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#121C18] bg-cover bg-center bg-no-repeat py-18 md:py-24"
      style={{ backgroundImage: "url('/images/vietnam-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,28,24,0.92)_0%,rgba(18,28,24,0.72)_42%,rgba(18,28,24,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,28,24,0.82)_0%,rgba(18,28,24,0.42)_45%,rgba(18,28,24,0.88)_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/bai-hoc")}
            className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#4B5563] transition hover:border-[#B83A2A]/40"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Quay lại Bài học
          </button>
        </div>

        <motion.article
          key={selectedLesson.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-sm"
        >
          <div className="relative h-[280px] md:h-[380px]">
            <img
              src={selectedLesson.image}
              alt={selectedLesson.imageAlt}
              loading="eager"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,24,39,0.92),rgba(17,24,39,0.28))]" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white md:p-8">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <selectedLesson.icon className="h-4 w-4" />
                {selectedLesson.eyebrow}
              </span>
              <div>
                <h3 className="text-2xl font-black md:text-4xl">{selectedLesson.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                  {selectedLesson.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:p-8">
            {selectedLesson.subSections.map((subSection) => {
              const isActiveSub = subSection.id === selectedSubSection?.id;
              return (
                <button
                  key={subSection.id}
                  type="button"
                  onClick={() => setActiveSubSectionId(subSection.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    isActiveSub
                      ? "border-[#B83A2A] bg-white"
                      : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#B83A2A]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-black text-[#111827]">{subSection.title}</h4>
                    <ChevronRight className={`mt-1 h-5 w-5 shrink-0 transition ${isActiveSub ? "rotate-90 text-[#B83A2A]" : "text-[#9CA3AF]"}`} />
                  </div>
                  {isActiveSub && (
                    <div className="mt-3">
                      <p className="text-sm leading-6 text-[#4B5563]">{subSection.detail}</p>
                      <ul className="mt-3 grid gap-2 text-sm text-[#4B5563]">
                        {subSection.points.map((point) => (
                          <li key={point} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6F5B]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}

            {selectedLesson.id === "phan-2" && (
              <div className={`mt-2 rounded-[20px] border p-5 transition ${
                isCompareOpen
                  ? "border-[#B83A2A] bg-[#F8F7F5]"
                  : "border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#B83A2A]/40"
              }`}>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen((current) => !current)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#17211D] text-[#F1C75B]">
                      <Scale className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B83A2A]">
                        Bảng hệ thống hóa
                      </p>
                      <h4 className="mt-1 text-xl font-black text-[#111827]">
                        So sánh dân chủ XHCN và nhà nước XHCN
                      </h4>
                    </div>
                  </div>
                  <ChevronRight className={`mt-2 h-5 w-5 shrink-0 transition ${isCompareOpen ? "rotate-90 text-[#B83A2A]" : "text-[#9CA3AF]"}`} />
                </button>

                <AnimatePresence>
                  {isCompareOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <CompareTable />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function App() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openTimelineYears, setOpenTimelineYears] = useState<Record<string, boolean>>({});
  const [isMemoryFormulaOpen, setIsMemoryFormulaOpen] = useState(false);

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

  const changePage = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
          text: "Mình chưa kết nối được hệ thống hỏi đáp. Bạn vẫn có thể học theo các mục Tổng quan, Bài học, Việt Nam và Game trên trang.",
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
    <div className="min-h-screen bg-[#F8F7F5] text-[#111827] selection:bg-[#B83A2A] selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E5E7EB] bg-white/92 shadow-[0_8px_30px_rgba(23,33,29,0.06)] backdrop-blur-xl">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 md:px-8">
          <button
            type="button"
            onClick={() => changePage("/tong-quan")}
            className="flex min-w-0 items-center gap-3 font-semibold"
            aria-label="Về đầu trang"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#17211D] text-[#F6F1E8]">
              <Scale className="h-5 w-5" />
            </span>
            <span className="hidden leading-tight sm:block">
              Chương 4 MLN
              <span className="block text-xs font-medium text-[#63756B]">
                Dân chủ và Nhà nước
              </span>
            </span>
          </button>

          <nav className="hidden justify-self-center rounded-[8px] border border-[#17211D]/8 bg-[#F3F1ED] p-1 shadow-inner md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex h-10 min-w-[92px] items-center justify-center rounded-[8px] px-4 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-[#17211D] shadow-sm ring-1 ring-[#17211D]/8"
                      : "text-[#44564E] hover:bg-white/65 hover:text-[#17211D]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={openChat}
              aria-label="Mở trợ lý AI"
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#B83A2A] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#972D22]"
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
              className="overflow-hidden border-t border-[#17211D]/10 bg-white shadow-lg md:hidden"
            >
              <div className="grid gap-2 px-4 py-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex min-h-12 items-center justify-between rounded-[8px] border px-3 py-3 text-left text-sm font-bold transition ${
                        isActive
                          ? "border-[#17211D]/10 bg-[#F8F7F5] text-[#17211D]"
                          : "border-[#17211D]/8 bg-white text-[#44564E] hover:border-[#B83A2A]/40"
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-[#B83A2A]" />
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/tong-quan" replace />} />
          <Route
            path="/tong-quan"
            element={(
              <>
                <section className="relative min-h-[92vh] overflow-hidden pt-16">
              <img
                src={images.hero}
                alt="Tòa nhà Quốc hội Việt Nam"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.96),rgba(23,33,29,0.78),rgba(23,33,29,0.18))]" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8F7F5] to-transparent" />

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
                    Tập trung vào: sự ra đời, bản chất, chức năng của nhà nước XHCN và mối quan hệ
                    giữa dân chủ XHCN với nhà nước XHCN, kèm ví dụ vận dụng tại Việt Nam.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => changePage("/bai-hoc")}
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[#F1C75B] px-5 py-3 text-sm font-bold text-[#17211D] transition hover:bg-[#FFDA72]"
                    >
                      Học theo phần
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="py-18 md:py-24">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  eyebrow="Tổng quan"
                  title="Nhìn một lần là thấy mạch chương"
                  subtitle="Trọng tâm là nhà nước XHCN và mối quan hệ với dân chủ XHCN: nền tảng, công cụ, chức năng và ý nghĩa." 
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
                        className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
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
                  <div
                    className={`relative min-h-[300px] overflow-hidden rounded-[8px] bg-[#17211D] p-6 text-white shadow-sm md:p-8 ${
                      isMemoryFormulaOpen ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (isMemoryFormulaOpen) setIsMemoryFormulaOpen(false);
                    }}
                  >
                    <img
                      src="/images/memory-formula-cover.jpg"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.94),rgba(23,33,29,0.76))]" />
                    <div className="relative z-10 flex items-start gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[8px] bg-[#F1C75B] text-[#17211D]">
                        <Network className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                          Công thức nhớ
                        </p>
                        <h3 className="mt-2 text-2xl font-black md:text-3xl">
                          Dân chủ là nền tảng, nhà nước là công cụ thực thi
                        </h3>
                        <p className="mt-4 text-base leading-8 text-white/72">
                          Nắm vững mối quan hệ này sẽ giúp triển khai các câu hỏi về bản chất,
                          chức năng và ý nghĩa của nhà nước XHCN.
                        </p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {!isMemoryFormulaOpen && (
                        <motion.button
                          type="button"
                          aria-label="Mở công thức nhớ"
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsMemoryFormulaOpen(true);
                          }}
                          className="absolute inset-0 z-20 overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-[#F1C75B]/60"
                          initial={{ opacity: 0, rotateY: -88 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -88 }}
                          transition={{ duration: 0.55, ease: "easeInOut" }}
                          style={{ transformOrigin: "left center" }}
                        >
                          <img
                            src="/images/memory-formula-cover.jpg"
                            alt="Tranh Bác Hồ với nhân dân lao động"
                            className="h-full w-full object-cover object-top"
                          />
                          <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.78),rgba(23,33,29,0.28))]" />
                          <span className="absolute left-6 top-6 inline-flex items-center gap-3 rounded-[8px] bg-[#F1C75B] px-4 py-3 font-black text-[#17211D] shadow-sm">
                            <Network className="h-5 w-5" />
                            Công thức nhớ
                          </span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6">
                    {principles.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-3 border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F8F7F5] text-[#B83A2A]">
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
              </>
            )}
          />
          <Route path="/bai-hoc" element={<LessonOverview />} />
          <Route path="/bai-hoc/:sectionId" element={<LessonDetailPage />} />
          <Route
            path="/viet-nam"
            element={(
              <section
                className="relative min-h-screen overflow-hidden bg-[#121C18] bg-cover bg-center bg-no-repeat pb-16 pt-24 text-white md:pb-20 md:pt-28"
                style={{ backgroundImage: "url('/images/vietnam-background.jpg')" }}
              >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,28,24,0.92)_0%,rgba(18,28,24,0.72)_42%,rgba(18,28,24,0.58)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,28,24,0.82)_0%,rgba(18,28,24,0.42)_45%,rgba(18,28,24,0.88)_100%)]" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
              <div className="grid gap-8 lg:min-h-[calc(100vh-12rem)] lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                <div>
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#F1C75B]">
                    Liên hệ Việt Nam
                  </p>
                  <h2 className="max-w-[620px] text-4xl font-black leading-[1.05] md:text-6xl">
                    Dân chủ và nhà nước XHCN trong thực tiễn
                  </h2>
                  <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/72">
                    Liên hệ Việt Nam có thể đi từ quyền làm chủ của nhân dân,
                    đến thể chế hóa bằng pháp luật và vai trò quản lý xã hội của nhà nước.
                  </p>
                  <div className="mt-7 flex gap-3 rounded-[8px] border border-white/12 bg-white/[0.07] p-4 shadow-sm">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-[#F1C75B]" />
                    <p className="text-sm font-semibold leading-7 text-white/78">
                      Câu chốt: Dân chủ là nền tảng, nhà nước là công cụ để quyền làm chủ của
                      nhân dân được thực hiện và được bảo vệ.
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {["Nhân dân", "Pháp luật", "Minh bạch"].map((item) => (
                      <div key={item} className="rounded-[8px] border border-white/10 bg-white/[0.05] px-4 py-3">
                        <p className="text-sm font-black text-[#F1C75B]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3">
                  {vietnamTimeline.map((item, index) => {
                    const imageCover = timelineCoverImages[item.year];
                    const hasImageCover = Boolean(imageCover);
                    const isTimelineOpen = Boolean(openTimelineYears[item.year]);
                    const isContentVisible = !hasImageCover || isTimelineOpen;

                    return (
                      <motion.article
                        key={item.year}
                        onClick={() => {
                          if (hasImageCover && isTimelineOpen) {
                            setOpenTimelineYears((current) => ({
                              ...current,
                              [item.year]: false,
                            }));
                          }
                        }}
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ delay: index * 0.06 }}
                        className={`relative grid min-h-[190px] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.07] p-5 shadow-sm backdrop-blur md:min-h-[220px] md:grid-cols-[132px_1fr] md:items-center ${
                          hasImageCover ? "cursor-pointer" : ""
                        }`}
                      >
                        {imageCover && (
                          <>
                            <img
                              src={imageCover.src}
                              alt=""
                              className={`absolute inset-0 h-full w-full object-cover transition duration-300 ${
                                isContentVisible ? "opacity-100" : "opacity-0"
                              }`}
                              style={{ objectPosition: imageCover.objectPosition ?? "center center" }}
                            />
                            <span
                              className={`absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.92),rgba(23,33,29,0.68))] transition duration-300 ${
                                isContentVisible ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {item.year === "Hiện nay" && (
                              <span
                                className={`absolute inset-0 bg-black/25 transition duration-300 ${
                                  isContentVisible ? "opacity-100" : "opacity-0"
                                }`}
                              />
                            )}
                          </>
                        )}
                        <div
                          className={`relative z-[1] flex items-center gap-3 transition duration-300 ${
                            isContentVisible ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#F1C75B] text-[#17211D]">
                            <BookOpen className="h-5 w-5" />
                          </span>
                          <p className="text-xl font-black text-[#F1C75B]">{item.year}</p>
                        </div>
                        <div className={`relative z-[1] transition duration-300 ${isContentVisible ? "opacity-100" : "opacity-0"}`}>
                          <h3 className="text-2xl font-black">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/72">{item.text}</p>
                          {item.sourceHref && (
                            <a
                              href={item.sourceHref}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="mt-4 inline-flex items-center gap-2 rounded-[8px] border border-[#F1C75B]/45 bg-[#F1C75B]/12 px-3 py-2 text-sm font-black text-[#F1C75B] transition hover:bg-[#F1C75B] hover:text-[#17211D]"
                            >
                              {item.sourceLabel}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>

                        <AnimatePresence>
                          {imageCover && !isTimelineOpen && (
                            <motion.button
                              type="button"
                              aria-label={`Mở nội dung năm ${item.year}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenTimelineYears((current) => ({
                                  ...current,
                                  [item.year]: true,
                                }));
                              }}
                              className="absolute inset-0 z-10 overflow-hidden text-left outline-none focus-visible:ring-4 focus-visible:ring-[#F1C75B]/60"
                              initial={{ opacity: 0, rotateY: -88 }}
                              animate={{ opacity: 1, rotateY: 0 }}
                              exit={{ opacity: 0, rotateY: -88 }}
                              transition={{ duration: 0.55, ease: "easeInOut" }}
                              style={{ transformOrigin: "left center" }}
                            >
                              <img
                                src={imageCover.src}
                                alt={imageCover.alt}
                                className="h-full w-full object-cover"
                                style={{ objectPosition: imageCover.objectPosition ?? "center center" }}
                              />
                              <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.76),rgba(23,33,29,0.18))]" />
                              {item.year === "Hiện nay" && (
                                <span className="absolute inset-0 bg-black/35" />
                              )}
                              <span className="absolute left-5 top-5 inline-flex items-center gap-3 rounded-[8px] bg-[#F1C75B] px-4 py-3 font-black text-[#17211D] shadow-sm">
                                <BookOpen className="h-5 w-5" />
                                {item.year}
                              </span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}

                  <div className="rounded-[8px] bg-[#F6F1E8] p-6 text-[#17211D] shadow-sm md:p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#1F6F5B] text-white">
                        <Scale className="h-5 w-5" />
                      </span>
                      <h3 className="text-2xl font-black">4 điểm liên hệ nhanh</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Bầu cử, góp ý luật pháp và tham gia giám sát xã hội.",
                        "Cải cách hành chính, dịch vụ công số, minh bạch hóa.",
                        "Phòng chống tham nhũng, lạm quyền và quan liêu.",
                        "An sinh xã hội, hỗ trợ vùng khó khăn, thu hẹp bất bình đẳng.",
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
            )}
          />
          <Route
            path="/game"
            element={<EscapeRoomApp />}
          />
        </Routes>
      </main>

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
