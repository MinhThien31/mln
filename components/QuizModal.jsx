import { useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

export default function QuizModal({ door, onClose, onAnswer, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState(null);

  const currentQuestion = door.questions[questionIndex];
  const isLastQuestion = questionIndex === door.questions.length - 1;

  const chooseAnswer = (option) => {
    if (result) return;

    const correct = option === currentQuestion.answer;
    setSelected(option);
    setResult(correct ? "correct" : "wrong");
    onAnswer(correct);
  };

  const goNext = () => {
    if (isLastQuestion) {
      onComplete(door.id);
      return;
    }

    setQuestionIndex((current) => current + 1);
    setSelected("");
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[8px] border border-white/12 bg-[#101820] text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F1C75B]">
              {door.chapter} · {questionIndex + 1}/{door.questions.length}
            </p>
            <h2 className="mt-2 text-2xl font-black">{door.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white/8 transition hover:bg-white/14"
            aria-label="Đóng câu hỏi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-black leading-8">{currentQuestion.question}</h3>

          <div className="mt-5 grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selected === option;
              const isCorrectAnswer = result && option === currentQuestion.answer;
              const isWrongSelection = result === "wrong" && isSelected;

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => chooseAnswer(option)}
                  className={`rounded-[8px] border p-4 text-left text-sm font-bold leading-6 transition ${
                    isCorrectAnswer
                      ? "border-emerald-300 bg-emerald-400/16 text-emerald-100"
                      : isWrongSelection
                        ? "border-red-300 bg-red-400/16 text-red-100"
                        : "border-white/10 bg-white/[0.06] text-white/82 hover:border-[#F1C75B]/50 hover:bg-white/[0.1]"
                  }`}
                >
                  <span className="mr-3 text-[#F1C75B]">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {result && (
            <div className={`mt-5 flex gap-3 rounded-[8px] border p-4 ${
              result === "correct"
                ? "border-emerald-300/35 bg-emerald-400/10 text-emerald-100"
                : "border-red-300/35 bg-red-400/10 text-red-100"
            }`}>
              {result === "correct" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
              <p className="text-sm font-semibold leading-6">
                {result === "correct"
                  ? "Chính xác. Cánh cửa đang mở khóa."
                  : `Sai rồi. Đáp án đúng là: ${currentQuestion.answer}`}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              disabled={!result}
              onClick={goNext}
              className="h-11 rounded-[8px] bg-[#F1C75B] px-5 text-sm font-black text-[#101820] transition hover:bg-[#FFD76A] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLastQuestion ? "Hoàn thành cửa" : "Câu tiếp theo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
