import DoorCard from "./DoorCard.jsx";
import GameStatus from "./GameStatus.jsx";

export default function GameRoom({ doors, lives, score, onDoorClick }) {
  const completedDoors = doors.filter((door) => door.status === "completed").length;

  return (
    <section className="min-h-screen bg-[#090D12] px-4 py-24 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#F1C75B]">
              Virtual classroom escape
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">AI Escape Room</h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/68 md:text-base">
              Mỗi cánh cửa giữ một mảnh kiến thức. Chọn cửa đang mở, trả lời 3 câu hỏi và đi tiếp
              cho đến khi thoát khỏi căn phòng.
            </p>
          </div>
          <GameStatus
            lives={lives}
            score={score}
            completedDoors={completedDoors}
            totalDoors={doors.length}
          />
        </div>

        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#101820] p-5 shadow-2xl md:p-7">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_center,rgba(241,199,91,0.16),transparent_62%)]" />
          <div className="relative mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <h2 className="text-xl font-black">Phòng khóa tri thức</h2>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/44">
              5 doors · 15 questions
            </p>
          </div>
          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {doors.map((door) => (
              <DoorCard key={door.id} door={door} onClick={onDoorClick} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
