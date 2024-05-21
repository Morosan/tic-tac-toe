import { PLAYER_X, winningCombinations } from './constants';
import GameState from './GameState';

export const checkWinner = (tiles, setStrikeClass, setGameState) => {
  for (const { combo, strikeClass } of winningCombinations) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      setStrikeClass(strikeClass);
      setGameState(tiles[a] === PLAYER_X ? GameState.playerXWins : GameState.playerOWins);
      return;
    }
  }

  if (tiles.every(tile => tile !== null)) {
    setGameState(GameState.draw);
  }
};
