import DoorCard from "./DoorCard.jsx";
import GameStatus from "./GameStatus.jsx";

export default function GameRoom({ doors, lives, score, onDoorClick }) {
  const completedDoors = doors.filter((door) => door.status === "completed").length;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090D12] px-4 py-24 text-white md:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-86"
        style={{ backgroundImage: "url('/images/game-escape-room-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,18,0.62)_0%,rgba(9,13,18,0.26)_46%,rgba(9,13,18,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,13,18,0.7),rgba(9,13,18,0.1)_48%,rgba(9,13,18,0.58))]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 rounded-[8px] border border-[#F1C75B]/24 bg-[#081018]/58 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md md:p-5 lg:grid-cols-[1fr_420px] lg:items-end">
          <div className="rounded-[8px] border border-white/12 bg-[#0B121A]/62 p-5">
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

        <div className="relative overflow-hidden rounded-[8px] border border-[#F1C75B]/34 bg-[#101820]/82 p-5 shadow-2xl shadow-black/45 backdrop-blur-md md:p-7">
          <div className="absolute inset-x-0 top-0 h-px bg-[#F1C75B]/45" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(31,111,91,0.2),transparent)]" />
          <div className="relative mb-5 flex items-center justify-between gap-3 border-b border-[#F1C75B]/18 pb-4">
            <h2 className="text-xl font-black">Phòng khóa tri thức</h2>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/44">
              5 doors · 15 questions
            </p>
          </div>
          <div className="relative grid gap-4 rounded-[8px] border border-white/10 bg-black/18 p-3 sm:grid-cols-2 lg:grid-cols-5">
            {doors.map((door) => (
              <DoorCard key={door.id} door={door} onClick={onDoorClick} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
