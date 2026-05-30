import { BrainCircuit, DoorOpen, Sparkles } from "lucide-react";

export default function HomeScreen({ onStart }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090D12] px-4 py-24 text-white md:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-88"
        style={{ backgroundImage: "url('/images/game-escape-room-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,13,18,0.78)_0%,rgba(9,13,18,0.45)_48%,rgba(9,13,18,0.68)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,18,0.48)_0%,rgba(9,13,18,0.08)_42%,rgba(9,13,18,0.78)_100%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-6xl items-center">
        <div className="grid gap-4 rounded-[8px] border border-[#F1C75B]/28 bg-[#081018]/62 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.52)] backdrop-blur-md md:p-5 lg:grid-cols-[1fr_0.82fr]">
        <div className="relative overflow-hidden rounded-[8px] border border-white/14 bg-[#0B121A]/72 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-[#F1C75B]/55" />
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F1C75B]/40 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B] shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Document learning quest
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.96] md:text-7xl">
            AI Escape Room
          </h1>
          <p className="mt-6 max-w-2xl border-l-2 border-[#F1C75B]/48 pl-5 text-base font-medium leading-8 text-white/78 md:text-lg">
            Bạn đang bị khóa trong một lớp học ảo. Mỗi cánh cửa là một chủ đề học tập.
            Trả lời đúng các câu hỏi từ tài liệu để mở khóa toàn bộ căn phòng và thoát ra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/12 pt-6">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex h-12 items-center gap-2 rounded-[8px] border border-[#F1C75B] bg-[#F1C75B] px-6 text-sm font-black text-[#101820] shadow-[0_16px_40px_rgba(241,199,91,0.25)] transition hover:-translate-y-0.5 hover:bg-[#FFD76A]"
            >
              <DoorOpen className="h-5 w-5" />
              Start Game
            </button>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#F1C75B]/36 bg-[#101820]/82 p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="mb-5 flex items-center gap-3 border-b border-[#F1C75B]/18 pb-5">
            <span className="grid h-12 w-12 place-items-center rounded-[8px] border border-emerald-200/20 bg-[#1F6F5B] text-white shadow-[0_10px_30px_rgba(31,111,91,0.32)]">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">Luật chơi</p>
              <h2 className="text-2xl font-black">Mở 5 cửa để chiến thắng</h2>
            </div>
          </div>
          <div className="grid gap-3 text-sm font-semibold leading-7 text-white/78 [&>p]:rounded-[8px] [&>p]:border [&>p]:border-white/12 [&>p]:bg-white/[0.06] [&>p]:px-4 [&>p]:py-3">
            <p>3 mạng sống. Trả lời sai mất 1 mạng.</p>
            <p>Mỗi cửa có 3 câu hỏi trắc nghiệm được random từ ngân hàng câu hỏi.</p>
            <p>Trả lời đúng được 100 điểm. Hoàn thành cả 5 cửa để thoát khỏi phòng.</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
