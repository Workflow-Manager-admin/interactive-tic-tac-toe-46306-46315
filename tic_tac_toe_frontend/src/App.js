import React, { useState, useEffect } from "react";
import "./App.css";

// Colors (as constants for easy reuse)
const COLORS = {
  primary: "#1976d2",
  accent: "#ff9800",
  secondary: "#ffffff"
};

/**
 * PUBLIC_INTERFACE
 * Square component represents a single cell in the Tic Tac Toe grid.
 */
function Square({ value, onClick, isWinner }) {
  return (
    <button
      className={`ttt-square${isWinner ? " ttt-winner" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell, ${value}` : "Empty cell"}
      tabIndex={0}
      style={{
        color: value === "X" ? COLORS.primary : COLORS.accent,
        backgroundColor: COLORS.secondary,
        borderColor: isWinner ? COLORS.accent : COLORS.primary
      }}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board component displays the Tic Tac Toe grid, passing props down to squares.
 */
function Board({ squares, onSquareClick, winningLine }) {
  // 3x3 matrix
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      isWinner={winningLine && winningLine.includes(i)}
    />
  );
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-board-row" key={row} role="row">
          {[0, 1, 2].map((col) =>
            renderSquare(row * 3 + col)
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Checks if a player has won. Returns the winning line (indices) if found, otherwise null.
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return line; // Winner found
    }
  }
  return null;
}

/**
 * Determines if the board is full (draw).
 */
function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}

/**
 * PUBLIC_INTERFACE
 * Main App component for the interactive Tic Tac Toe Game.
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X starts
  const [status, setStatus] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  // UI effect for responsiveness
  useEffect(() => {
    document.title = "Tic Tac Toe";
  }, []);

  // Evaluate game outcome & set status after every move
  useEffect(() => {
    const line = calculateWinner(squares);
    if (line) {
      setWinningLine(line);
      setStatus(`Winner: ${squares[line[0]]}`);
      setGameOver(true);
    } else if (isBoardFull(squares)) {
      setStatus("It's a draw!");
      setGameOver(true);
      setWinningLine(null);
    } else {
      setStatus(`Next player: ${xIsNext ? "X" : "O"}`);
      setGameOver(false);
      setWinningLine(null);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  // Handles a move
  const handleSquareClick = (i) => {
    if (gameOver || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  // Resets the game
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinningLine(null);
    setStatus("Next player: X");
  };

  return (
    <div className="app-bg">
      <div className="ttt-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary }}>
          Tic Tac Toe
        </h1>
        <div
          className="ttt-status"
          style={{ color: gameOver && winningLine ? COLORS.accent : COLORS.primary }}
        >
          {status}
        </div>
        <Board squares={squares} onSquareClick={handleSquareClick} winningLine={winningLine} />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.secondary,
            borderColor: COLORS.primary
          }}
          aria-label="Reset game"
        >
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org/"
            className="ttt-footer-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: COLORS.primary }}
          >
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
