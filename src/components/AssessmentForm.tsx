import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { principles, questions } from "../data/principles";
import { pmqCategories } from "../data/principles";
import { Assessment, Answer } from "../types";

interface AssessmentFormProps {
  assessment: Assessment;
  onUpdateAnswer: (
    principleId: string,
    score: number,
    comment?: string
  ) => void;
  getAnswer: (principleId: string) => Answer | undefined;
  onComplete: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  assessment,
  onUpdateAnswer,
  getAnswer,
  onComplete,
}) => {
  const [currentPMQ, setCurrentPMQ] = useState(1);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const currentPMQPrinciples = principles.filter((p) => p.pmq === currentPMQ);
  const currentCategory = pmqCategories.find((c) => c.id === currentPMQ);

  const answeredQuestions = assessment.answers.length;
  const totalQuestions = principles.length;

  const handleScoreChange = (principleId: string, score: number) => {
    const existingAnswer = getAnswer(principleId);
    onUpdateAnswer(principleId, score, existingAnswer?.comment);
  };

  const handleCommentChange = (principleId: string, comment: string) => {
    const existingAnswer = getAnswer(principleId);
    const score = existingAnswer?.score || 1;
    onUpdateAnswer(principleId, score, comment);
  };

  const toggleComment = (principleId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [principleId]: !prev[principleId],
    }));
  };

  const canGoNext = currentPMQ < 7;
  const canGoPrevious = currentPMQ > 1;
  const canComplete = answeredQuestions === totalQuestions;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPMQ = () => {
    if (canGoNext) {
      setCurrentPMQ(currentPMQ + 1);
      scrollToTop();
    }
  };

  const handlePreviousPMQ = () => {
    if (canGoPrevious) {
      setCurrentPMQ(currentPMQ - 1);
      scrollToTop();
    }
  };

  const handlePMQSelect = (pmq: number) => {
    setCurrentPMQ(pmq);
    scrollToTop();
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              PMQ {currentPMQ} - {currentCategory?.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {currentCategory?.description}
            </p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
              Progression globale
            </div>
            <div
              className="text-base sm:text-lg font-semibold"
              style={{ color: "#009688" }}
            >
              {answeredQuestions}/{totalQuestions} questions
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: "#009688",
              width: `${(answeredQuestions / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 sm:space-y-6">
        {currentPMQPrinciples.map((principle) => {
          const question = questions.find(
            (q) => q.principleId === principle.id
          );
          const answer = getAnswer(principle.id);
          const isCommentVisible = showComments[principle.id];

          return (
            <div
              key={principle.id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                    <span
                      className="text-xs sm:text-sm font-medium px-2 sm:px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#e0f2f1", color: "#009688" }}
                    >
                      Question{" "}
                      {principles.findIndex((p) => p.id === principle.id) + 1}
                    </span>
                    {answer && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {question?.text}
                  </p>
                </div>
              </div>

              {/* Rating Scale */}
              <div className="mb-3 sm:mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                  {question?.options.map((option) => (
                    <label
                      key={option.value}
                      className={`relative flex flex-col items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 ${
                        answer?.score === option.value
                          ? "shadow-md"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      style={
                        answer?.score === option.value
                          ? {
                              borderColor: "#009688",
                              backgroundColor: "#e0f2f1",
                            }
                          : {}
                      }
                      onMouseEnter={(e) => {
                        if (answer?.score !== option.value) {
                          e.currentTarget.style.borderColor = "#4db6ac";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (answer?.score !== option.value) {
                          e.currentTarget.style.borderColor = "";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name={`score-${principle.id}`}
                        value={option.value}
                        checked={answer?.score === option.value}
                        onChange={() =>
                          handleScoreChange(principle.id, option.value)
                        }
                        className="absolute opacity-0 w-full h-full cursor-pointer"
                      />
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1 sm:mb-2 transition-all duration-200 ${
                          answer?.score === option.value
                            ? "text-white scale-110"
                            : "bg-gray-200 text-gray-600"
                        }`}
                        style={
                          answer?.score === option.value
                            ? { backgroundColor: "#009688" }
                            : {}
                        }
                      >
                        {option.value}
                      </div>
                      <span className="text-[10px] sm:text-xs text-center text-gray-700 leading-tight">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comment Section */}
              <div className="border-t pt-4">
                <button
                  onClick={() => toggleComment(principle.id)}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: "#009688" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#00796b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#009688")
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>
                    {isCommentVisible ? "Masquer" : "Ajouter"} un commentaire
                  </span>
                </button>

                {isCommentVisible && (
                  <div className="mt-3">
                    <textarea
                      placeholder="Ajoutez des précisions ou du contexte..."
                      value={answer?.comment || ""}
                      onChange={(e) =>
                        handleCommentChange(principle.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                      style={
                        { "--tw-ring-color": "#009688" } as React.CSSProperties
                      }
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <div className="text-sm text-gray-500 mb-2">PMQ</div>
              <div className="grid grid-cols-4 gap-1 max-w-32 mx-auto mb-2">
                {[1, 2, 3, 4].map((pmq) => (
                  <button
                    key={pmq}
                    onClick={() => handlePMQSelect(pmq)}
                    className={`w-7 h-7 rounded-full text-xs font-medium transition-all duration-200 ${
                      currentPMQ === pmq
                        ? "text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    style={
                      currentPMQ === pmq ? { backgroundColor: "#009688" } : {}
                    }
                  >
                    {pmq}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1 max-w-24 mx-auto">
                {[5, 6, 7].map((pmq) => (
                  <button
                    key={pmq}
                    onClick={() => handlePMQSelect(pmq)}
                    className={`w-7 h-7 rounded-full text-xs font-medium transition-all duration-200 ${
                      currentPMQ === pmq
                        ? "text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                    style={
                      currentPMQ === pmq ? { backgroundColor: "#009688" } : {}
                    }
                  >
                    {pmq}
                  </button>
                ))}
              </div>
            </div>

            {canGoNext ? (
              <button
                onClick={handleNextPMQ}
                className="flex items-center justify-center space-x-2 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 ml-4"
                style={{ backgroundColor: "#009688" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#00796b")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#009688")
                }
              >
                <span>Suivant</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                disabled={!canComplete}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white ml-4 ${
                  canComplete
                    ? ""
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                style={canComplete ? { backgroundColor: "#4caf50" } : {}}
                onMouseEnter={(e) => {
                  if (canComplete) {
                    e.currentTarget.style.backgroundColor = "#388e3c";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canComplete) {
                    e.currentTarget.style.backgroundColor = "#4caf50";
                  }
                }}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Terminer</span>
              </button>
            )}
          </div>

          <button
            onClick={handlePreviousPMQ}
            disabled={!canGoPrevious}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full ${
              canGoPrevious
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Précédent</span>
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex justify-between items-center">
          <button
            onClick={handlePreviousPMQ}
            disabled={!canGoPrevious}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canGoPrevious
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Précédent</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">PMQ</div>
            <div className="flex space-x-2 justify-center">
              {[1, 2, 3, 4, 5, 6, 7].map((pmq) => (
                <button
                  key={pmq}
                  onClick={() => handlePMQSelect(pmq)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentPMQ === pmq
                      ? "text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                  style={
                    currentPMQ === pmq ? { backgroundColor: "#009688" } : {}
                  }
                >
                  {pmq}
                </button>
              ))}
            </div>
          </div>

          {canGoNext ? (
            <button
              onClick={handleNextPMQ}
              className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{ backgroundColor: "#009688" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#00796b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#009688")
              }
            >
              <span>Suivant</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              disabled={!canComplete}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-white ${
                canComplete
                  ? ""
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              style={canComplete ? { backgroundColor: "#4caf50" } : {}}
              onMouseEnter={(e) => {
                if (canComplete) {
                  e.currentTarget.style.backgroundColor = "#388e3c";
                }
              }}
              onMouseLeave={(e) => {
                if (canComplete) {
                  e.currentTarget.style.backgroundColor = "#4caf50";
                }
              }}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Terminer l'évaluation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
