import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Board from './Board';
import GameOver from './GameOver';
import GameState from './GameState';
import Reset from './Reset';
import Confetti from './Confetti';
import gameOverSoundAsset from '../sounds/game-over.wav';
import clickSoundAsset from '../sounds/click.wav';
import { PLAYER_X, PLAYER_O } from './constants';
import { checkWinner } from './utils';

const TicTacToe = () => {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState(null);
  const [gameState, setGameState] = useState(GameState.inProgress);

  const gameOverSound = useMemo(() => {
    const audio = new Audio(gameOverSoundAsset);
    audio.volume = 0.2;
    return audio;
  }, []);

  const clickSound = useMemo(() => {
    const audio = new Audio(clickSoundAsset);
    audio.volume = 0.5;
    return audio;
  }, []);

  const handleTileClick = useCallback((index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null) {
      return;
    }

    const newTiles = tiles.slice();
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    setPlayerTurn((prev) => (prev === PLAYER_X ? PLAYER_O : PLAYER_X));
  }, [gameState, tiles, playerTurn]);

  const handleReset = useCallback(() => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
  }, []);

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles, clickSound]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState, gameOverSound]);

  return (
    <div className='body'>
      <h1>Tic Tac Toe</h1>
      {gameState !== GameState.inProgress && <Confetti />}
      <Board
        strikeClass={strikeClass}
        playerTurn={playerTurn}
        tiles={tiles}
        onTileClick={handleTileClick}
      />
      <h3 className='player-turn'>{`Player's Turn: ${playerTurn}`}</h3>
      <GameOver gameState={gameState} />
      <Reset onReset={handleReset} gameState={gameState} />
    </div>
  );
};

export default TicTacToe;
