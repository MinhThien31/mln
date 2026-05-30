import { useMemo, useState } from "react";
import { RotateCcw, Trophy, XCircle } from "lucide-react";
import { buildRandomDoorQuestions } from "../data/questions.js";
import GameRoom from "./GameRoom.jsx";
import HomeScreen from "./HomeScreen.jsx";
import QuizModal from "./QuizModal.jsx";

function createDoors() {
  const generatedDoors = buildRandomDoorQuestions();
  return generatedDoors.map((door, index) => ({
    ...door,
    status: index === 0 ? "unlocked" : "locked",
  }));
}

function EndScreen({ type, score, onRestart }) {
  const isVictory = type === "victory";
  const Icon = isVictory ? Trophy : XCircle;

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090D12] px-4 py-24 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-86"
        style={{ backgroundImage: "url('/images/game-escape-room-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,13,18,0.62),rgba(9,13,18,0.3),rgba(9,13,18,0.78))]" />
      <div className="w-full max-w-2xl rounded-[8px] border border-[#F1C75B]/18 bg-[#101820]/78 p-8 text-center shadow-2xl shadow-black/45 backdrop-blur-md">
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-[8px] ${
          isVictory ? "bg-[#F1C75B] text-[#101820]" : "bg-[#B83A2A] text-white"
        }`}>
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-4xl font-black md:text-5xl">
          {isVictory ? "Bạn đã thoát khỏi phòng!" : "Game Over"}
        </h1>
        <p className="mt-4 text-base font-medium leading-8 text-white/70">
          {isVictory
            ? "Tất cả cánh cửa đã được mở. Bạn đã chứng minh mình nắm chắc nội dung bài học."
            : "Bạn đã hết mạng. Hãy chơi lại để củng cố kiến thức và mở khóa các cửa."}
        </p>
        <p className="mt-6 text-3xl font-black text-[#F1C75B]">{score} điểm</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-7 inline-flex h-12 items-center gap-2 rounded-[8px] bg-[#F1C75B] px-6 text-sm font-black text-[#101820] transition hover:bg-[#FFD76A]"
        >
          <RotateCcw className="h-5 w-5" />
          Chơi lại
        </button>
      </div>
    </section>
  );
}

export default function EscapeRoomApp() {
  const [screen, setScreen] = useState("home");
  const [doors, setDoors] = useState(() => createDoors());
  const [activeDoor, setActiveDoor] = useState(null);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const completedCount = useMemo(
    () => doors.filter((door) => door.status === "completed").length,
    [doors],
  );

  const startGame = () => {
    setDoors(createDoors());
    setActiveDoor(null);
    setLives(3);
    setScore(0);
    setScreen("room");
  };

  const handleAnswer = (correct) => {
    if (correct) {
      setScore((current) => current + 100);
      return;
    }

    setLives((current) => {
      const nextLives = current - 1;
      if (nextLives <= 0) {
        setActiveDoor(null);
        setScreen("gameover");
        return 0;
      }

      return nextLives;
    });
  };

  const completeDoor = (doorId) => {
    setDoors((currentDoors) => {
      const completedIndex = currentDoors.findIndex((door) => door.id === doorId);
      const nextDoors = currentDoors.map((door, index) => {
        if (door.id === doorId) return { ...door, status: "completed" };
        if (index === completedIndex + 1 && door.status === "locked") return { ...door, status: "unlocked" };
        return door;
      });

      const finished = nextDoors.every((door) => door.status === "completed");
      if (finished) {
        setScreen("victory");
      }

      return nextDoors;
    });
    setActiveDoor(null);
  };

  // Future API integration point:
  // Replace createDoors()/buildRandomDoorQuestions() with questions generated from uploaded PDFs.

  if (screen === "home") return <HomeScreen onStart={startGame} />;
  if (screen === "victory") return <EndScreen type="victory" score={score} onRestart={startGame} />;
  if (screen === "gameover") return <EndScreen type="gameover" score={score} onRestart={startGame} />;

  return (
    <>
      <GameRoom
        doors={doors}
        lives={lives}
        score={score}
        completedDoors={completedCount}
        onDoorClick={setActiveDoor}
      />
      {activeDoor && (
        <QuizModal
          door={activeDoor}
          onClose={() => setActiveDoor(null)}
          onAnswer={handleAnswer}
          onComplete={completeDoor}
        />
      )}
    </>
  );
}
