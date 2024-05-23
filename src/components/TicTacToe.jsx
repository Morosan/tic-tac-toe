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
  // State for managing the tiles on the board
  const [tiles, setTiles] = useState(Array(9).fill(null));

  // State for tracking the current player's turn
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);

  // State for managing the strike class for the winning line
  const [strikeClass, setStrikeClass] = useState(null);

  // State for tracking the current game state (in progress, won, draw)
  const [gameState, setGameState] = useState(GameState.inProgress);

  // Memoized sound for game over event, ensures the sound is not recreated on every render
  const gameOverSound = useMemo(() => {
    const audio = new Audio(gameOverSoundAsset);
    audio.volume = 0.2;  // Set volume for the sound
    return audio;
  }, []);

  // Memoized sound for tile click event
  const clickSound = useMemo(() => {
    const audio = new Audio(clickSoundAsset);
    audio.volume = 0.5;  // Set volume for the sound
    return audio;
  }, []);

  // Callback for handling tile click
  const handleTileClick = useCallback((index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null) {
      return;  // Ignore if game is over or tile is already filled
    }

    const newTiles = tiles.slice();  // Create a copy of the current tiles
    newTiles[index] = playerTurn;  // Set the tile to the current player's symbol
    setTiles(newTiles);  // Update the state with new tiles

    // Toggle player turn between PLAYER_X and PLAYER_O
    setPlayerTurn((prev) => (prev === PLAYER_X ? PLAYER_O : PLAYER_X));
  }, [gameState, tiles, playerTurn]);

  // Callback for resetting the game
  const handleReset = useCallback(() => {
    setGameState(GameState.inProgress);  // Reset game state to in progress
    setTiles(Array(9).fill(null));  // Clear the board
    setPlayerTurn(PLAYER_X);  // Set the starting player to PLAYER_X
    setStrikeClass(null);  // Clear any strike class
  }, []);

  // Effect to check for a winner whenever the tiles state changes
  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);  // Check for a winner and update state accordingly
  }, [tiles]);

  // Effect to play click sound whenever a tile is clicked
  useEffect(() => {
    if (tiles.some((tile) => tile !== null)) {
      clickSound.play();  // Play click sound if any tile is filled
    }
  }, [tiles, clickSound]);

  // Effect to play game over sound when the game state changes to not in progress
  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();  // Play game over sound if game is won or drawn
    }
  }, [gameState, gameOverSound]);

  return (
    <div className='body'>
      <h1>Tic Tac Toe</h1>
      {/* Display confetti if the game is over and it's not a tie */}
      {gameState !== GameState.inProgress && gameState !== GameState.draw && <Confetti />}
      <Board
        strikeClass={strikeClass}
        playerTurn={playerTurn}
        tiles={tiles}
        onTileClick={handleTileClick}
      />
      {gameState === GameState.inProgress && <h3 className='player-turn'>{`Player's Turn: ${playerTurn}`}</h3>}
      <GameOver gameState={gameState} />
      <Reset onReset={handleReset} gameState={gameState} />
    </div>
  );
};

export default TicTacToe;
