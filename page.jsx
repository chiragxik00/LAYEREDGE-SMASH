'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import layeredgeLogo from '../public/layeredge-logo.png';
import hitSound from '../public/hit.mp3';

export default function Game() {
  const [objects, setObjects] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wallet, setWallet] = useState('');
  const gameAreaRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 90;
      setObjects((prev) => [...prev, { id, left, top: 0 }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fall = setInterval(() => {
      setObjects((prev) =>
        prev.map((obj) => ({ ...obj, top: obj.top + 5 })).filter((obj) => obj.top < 90)
      );
    }, 100);
    return () => clearInterval(fall);
  }, []);

  const handleClick = (id) => {
    setScore(score + 1);
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
    soundRef.current?.play();
  };

  const handleSubmit = () => {
    alert(`Wallet submitted: ${wallet}`);
  };

  return (
    <div className="relative h-screen bg-black text-white overflow-hidden">
      <audio ref={soundRef} src={hitSound} preload="auto" />
      <div className="absolute top-4 left-4 text-xl">Score: {score}</div>
      <div ref={gameAreaRef} className="relative w-full h-full">
        {objects.map((obj) => (
          <div
            key={obj.id}
            className="absolute"
            style={{ left: `${obj.left}%`, top: `${obj.top}%` }}
            onClick={() => handleClick(obj.id)}
          >
            <Image src={layeredgeLogo} alt="logo" width={50} height={50} />
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-2xl mb-4">Game Over</h1>
          <input
            type="text"
            placeholder="Enter wallet address"
            className="text-black p-2 mb-2"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
          <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
