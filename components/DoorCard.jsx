import { CheckCircle2, Lock, UnlockKeyhole } from "lucide-react";

const statusMeta = {
  locked: {
    label: "Locked",
    icon: Lock,
    className: "border-white/14 opacity-58 grayscale",
  },
  unlocked: {
    label: "Unlocked",
    icon: UnlockKeyhole,
    className: "border-[#F1C75B]/70 ring-1 ring-[#F1C75B]/20 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(241,199,91,0.2)]",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-emerald-300/60 bg-emerald-400/10 ring-1 ring-emerald-300/18",
  },
};

export default function DoorCard({ door, onClick }) {
  const meta = statusMeta[door.status];
  const Icon = meta.icon;
  const canOpen = door.status === "unlocked";

  return (
    <button
      type="button"
      onClick={() => canOpen && onClick(door)}
      disabled={!canOpen}
      className={`group relative min-h-[310px] overflow-hidden rounded-[8px] border bg-[#121922] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition ${meta.className}`}
    >
      <div className={`absolute inset-x-8 bottom-0 top-10 rounded-t-full bg-gradient-to-b ${door.accent} opacity-85 shadow-inner`} />
      <div className="absolute inset-x-14 bottom-0 top-20 rounded-t-full bg-[#22170F]/70 ring-2 ring-black/25" />
      <div className="absolute left-1/2 top-[54%] h-3 w-3 -translate-x-[-44px] rounded-full bg-[#F1C75B] shadow-[0_0_18px_rgba(241,199,91,0.9)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(4,7,12,0.9))]" />

      <div className="relative z-10 flex h-full min-h-[278px] flex-col justify-between">
        <div className="flex items-center justify-between gap-3 border-b border-white/12 pb-3">
          <span className="rounded-full border border-white/18 bg-black/32 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/82">
            {door.chapter}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-bold text-white/82">
            <Icon className="h-4 w-4" />
            {meta.label}
          </span>
        </div>

        <div className="rounded-[8px] border border-white/10 bg-black/24 p-3">
          <h3 className="text-2xl font-black leading-tight text-white">{door.title}</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-white/68">{door.description}</p>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#F1C75B]">
            {canOpen ? "Click để giải mã" : door.status === "completed" ? "Đã vượt qua" : "Hoàn thành cửa trước"}
          </p>
        </div>
      </div>
    </button>
  );
}
