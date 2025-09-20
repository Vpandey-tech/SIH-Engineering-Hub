
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mocked PYQ question bank (structure: semester, subject, topic, question, options, answer, importance)
const PYQ_QUESTIONS = [
  {
    semester: "5",
    subject: "Data Structures",
    topic: "Queues",
    question: "Which data structure works on the principle of FIFO (First-In-First-Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    important: true,
  },
  {
    semester: "5",
    subject: "Data Structures",
    topic: "BST",
    question: "What is the time complexity of searching in a balanced BST?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
    answer: "O(log n)",
    important: true,
  },
  {
    semester: "5",
    subject: "Data Structures",
    topic: "Stacks",
    question: "The postfix expression for the infix expression (A+B)*(C-D) is?",
    options: [
      "AB+CD-*",
      "AB+*CD-",
      "A+B*C-D",
      "A+B*C-D-"
    ],
    answer: "AB+CD-*",
    important: true,
  },
  {
    semester: "5",
    subject: "Data Structures",
    topic: "Stacks",
    question: "Which operation is not possible on stack?",
    options: [
      "Push",
      "Pop",
      "Random Access",
      "Peek"
    ],
    answer: "Random Access",
    important: true,
  },
  {
    semester: "5",
    subject: "Data Structures",
    topic: "Trees",
    question: "The maximum number of nodes in a binary tree of height 'h' is?",
    options: [
      "2^h - 1",
      "2h",
      "2h - 1",
      "h^2"
    ],
    answer: "2^h - 1",
    important: true,
  },
  // ... add more questions for diversity and reach up to 20+ for fuller quiz
  // For brevity, we assume there are at least 20 important questions spread out over topics/subjects/semesters
];

const semesters = ["5", "6", "7", "8"];
const subjects = ["Data Structures", "Algorithms", "DBMS", "Operating Systems"];
const topics = ["Queues", "Stacks", "Trees", "Graphs", "BST", "Sorting", "Searching", "Concurrency", "Transactions"];

const ExamPreparationCard: React.FC = () => {
  // Form fields
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [formTouched, setFormTouched] = useState(false);

  // Questions state
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<typeof PYQ_QUESTIONS>([]);
  const [curr, setCurr] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [noQuestionsFound, setNoQuestionsFound] = useState(false);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    let filtered = PYQ_QUESTIONS.filter(q =>
      (semester ? q.semester === semester : true) &&
      (subject ? q.subject === subject : true) &&
      (topic ? q.topic?.toLowerCase().includes(topic.toLowerCase()) : true) &&
      q.important
    );

    filtered = filtered.slice(0, 20);

    setQuestions(filtered);
    setCurr(0);
    setShowScore(false);
    setScore(0);

    if (filtered.length === 0) {
      setQuizStarted(false);
      setNoQuestionsFound(true);
    } else {
      setQuizStarted(true);
      setNoQuestionsFound(false);
    }
  };

  const handleOption = (opt: string) => {
    // Guard against out-of-bounds access
    const currQuestion = questions[curr];
    if (!currQuestion) return;
    if (opt === currQuestion.answer) setScore(score + 1);
    if (curr === questions.length - 1) setShowScore(true);
    else setCurr(curr + 1);
  };

  // Reset quiz
  const handleTryAgain = () => {
    setQuizStarted(false);
    setScore(0);
    setShowScore(false);
    setCurr(0);
    setFormTouched(false);
    setSemester("");
    setSubject("");
    setTopic("");
    setQuestions([]);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-6 h-6 text-green-700" />
        <h3 className="text-lg font-bold text-green-800">Exam Preparation</h3>
      </div>
      {!quizStarted ? (
        <form
          className="flex flex-col sm:flex-row gap-3 mb-4"
          onSubmit={handleStartQuiz}
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Semester <span className="text-red-500">*</span></label>
            <select
              className="border border-slate-300 rounded px-2 py-1 min-w-[90px] outline-none focus:ring-2 focus:ring-blue-200"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              required
            >
              <option value="">Select</option>
              {semesters.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Subject <span className="text-red-500">*</span></label>
            <select
              className="border border-slate-300 rounded px-2 py-1 min-w-[140px] outline-none focus:ring-2 focus:ring-blue-200"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            >
              <option value="">Select</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-700">Topic (Optional)</label>
            <Input
              className="min-w-[140px]"
              placeholder="e.g. Queues"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              maxLength={48}
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 rounded mt-5 sm:mt-0 min-w-[110px] flex items-center gap-1"
          >
            Start Test
          </Button>
          {(formTouched && noQuestionsFound) && (
            <div className="text-xs text-red-600 mt-1 col-span-2">No questions found for your selection.</div>
          )}
        </form>
      ) : showScore ? (
        <div className="mt-4 text-center">
          <div className="text-xl font-bold">
            Your score: {score} / {questions.length}
          </div>
          <Button className="mt-3 underline text-blue-600" variant="ghost" onClick={handleTryAgain}>
            Try Another Test
          </Button>
        </div>
      ) : (
        // Only render question if it exists
        <div className="mt-2">
          <div className="mb-2 text-sm text-slate-500">
            Q{curr + 1} of {questions.length} | <span className="font-semibold">{subject}</span>
            {topic && <> | Topic: <span className="font-semibold">{topic}</span></>}
          </div>
          {questions[curr] ? (
            <Card>
              <CardContent className="py-4">
                <div className="font-medium">{questions[curr].question}</div>
                <div className="flex flex-col gap-2 mt-3">
                  {questions[curr].options.map((opt, i) => (
                    <Button
                      key={opt}
                      className="text-left font-normal bg-blue-100 hover:bg-blue-200 text-blue-800 rounded px-3 py-1 transition"
                      type="button"
                      onClick={() => handleOption(opt)}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="py-10 text-center text-red-600">No question available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamPreparationCard;
