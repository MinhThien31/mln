import { BrainCircuit, DoorOpen, Sparkles } from "lucide-react";

export default function HomeScreen({ onStart }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090D12] px-4 py-24 text-white md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,197,91,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(46,204,170,0.14),transparent_34%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">
            <Sparkles className="h-4 w-4" />
            Document learning quest
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.96] md:text-7xl">
            AI Escape Room
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-white/72 md:text-lg">
            Bạn đang bị khóa trong một lớp học ảo. Mỗi cánh cửa là một chủ đề học tập.
            Trả lời đúng các câu hỏi từ tài liệu để mở khóa toàn bộ căn phòng và thoát ra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex h-12 items-center gap-2 rounded-[8px] bg-[#F1C75B] px-6 text-sm font-black text-[#101820] shadow-[0_16px_40px_rgba(241,199,91,0.25)] transition hover:-translate-y-0.5 hover:bg-[#FFD76A]"
            >
              <DoorOpen className="h-5 w-5" />
              Start Game
            </button>
          </div>
        </div>

        <div className="rounded-[8px] border border-white/12 bg-white/[0.07] p-6 shadow-2xl backdrop-blur">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[8px] bg-[#1F6F5B] text-white">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">Luật chơi</p>
              <h2 className="text-2xl font-black">Mở 5 cửa để chiến thắng</h2>
            </div>
          </div>
          <div className="grid gap-3 text-sm font-semibold leading-7 text-white/74">
            <p>3 mạng sống. Trả lời sai mất 1 mạng.</p>
            <p>Mỗi cửa có 3 câu hỏi trắc nghiệm được random từ ngân hàng câu hỏi.</p>
            <p>Trả lời đúng được 100 điểm. Hoàn thành cả 5 cửa để thoát khỏi phòng.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
