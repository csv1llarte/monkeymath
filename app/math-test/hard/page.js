"use client";
import { useState } from "react";

function getQuestion() {
  const ops = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === "+") {
    a = Math.floor(Math.random() * 100) + 1;
    b = Math.floor(Math.random() * 100) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 100) + 1;
    b = Math.floor(Math.random() * 100) + 1;
    answer = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a * b;
  } else {
    b = Math.floor(Math.random() * 20) + 1;
    answer = Math.floor(Math.random() * 20) + 1;
    a = b * answer;
  }
  return { a, b, op, answer };
}

export default function HardMathTest() {
  const [question, setQuestion] = useState(getQuestion());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [end, setEnd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === question.answer) {
      setScore(score + 1);
    }
    setInput("");
    if (count >= 9) {
      setEnd(true);
    } else {
      setQuestion(getQuestion());
      setCount(count + 1);
    }
  };

  const getTime = () => {
    if (!end) return ((Date.now() - startTime) / 1000).toFixed(1);
    return ((Date.now() - startTime) / 1000).toFixed(1);
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', gap: '1.5rem', justifyContent: 'center' }}>
      <h1>Hard Math Test</h1>
      {end ? (
        <div>
          <h2>Done!</h2>
          <p>Score: {score} / 10</p>
          <p>Time: {getTime()} seconds</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>{question.op === "÷" ? `${question.a} ÷ ${question.b}` : `${question.a} ${question.op} ${question.b}`} = ?</div>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ fontSize: '1.2rem', padding: '0.5rem', borderRadius: 6 }}
            required
            autoFocus
          />
          <button type="submit" style={{ padding: '0.5rem 1.5rem', fontSize: '1rem' }}>Next</button>
          <div>Question {count + 1} / 10</div>
        </form>
      )}
    </main>
  );
} 