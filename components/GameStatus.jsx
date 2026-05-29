import { Heart, Trophy, UnlockKeyhole } from "lucide-react";

export default function GameStatus({ lives, score, completedDoors, totalDoors }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-[8px] border border-white/10 bg-white/[0.07] p-4">
        <div className="mb-2 flex items-center gap-2 text-[#F87171]">
          <Heart className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-[0.16em]">Lives</span>
        </div>
        <p className="text-3xl font-black text-white">{"♥".repeat(lives)}{"♡".repeat(3 - lives)}</p>
      </div>
      <div className="rounded-[8px] border border-white/10 bg-white/[0.07] p-4">
        <div className="mb-2 flex items-center gap-2 text-[#F1C75B]">
          <Trophy className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-[0.16em]">Score</span>
        </div>
        <p className="text-3xl font-black text-white">{score}</p>
      </div>
      <div className="rounded-[8px] border border-white/10 bg-white/[0.07] p-4">
        <div className="mb-2 flex items-center gap-2 text-[#7DD3FC]">
          <UnlockKeyhole className="h-5 w-5" />
          <span className="text-xs font-black uppercase tracking-[0.16em]">Doors</span>
        </div>
        <p className="text-3xl font-black text-white">{completedDoors}/{totalDoors}</p>
      </div>
    </div>
  );
}
