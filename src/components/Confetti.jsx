// Confetti.js
import React, { useEffect } from 'react';
import '../Confetti.css';

const Confetti = () => {
  useEffect(() => {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = ''; // Clear any previous confetti balls

    const flakes = [];
    for (let i = 0; i < 400; i++) {
      const flake = document.createElement('div');
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      flake.className = 'ball';
      flake.style.backgroundColor = `#${randomColor}`;
      flake.style.animationDuration = `${Math.random() * 9 + 2}s`;
      flake.style.animationDelay = `${Math.random() * 2}s`;
      flakes.push(flake);
    }

    flakes.forEach((flake) => confettiContainer.appendChild(flake));
  }, []);

  return <div id="confetti"></div>;
};

export default Confetti;
