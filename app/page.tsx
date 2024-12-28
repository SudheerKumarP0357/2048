"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Undo, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Cell, Direction, GRID_SIZE, VECTORS, generateRandomCell, canMove } from "@/lib/game";
import { getColor } from "@/lib/styles";
import { useSwipe } from "@/hooks/use-touch";
import { useDrag } from "@/hooks/use-mouse";

export default function Home() {
  const [cells, setCells] = useState<Cell[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [previousStates, setPreviousStates] = useState<{ cells: Cell[][]; score: number }[]>([]);

  useEffect(() => {
    initializeGame();
    const savedBestScore = localStorage.getItem("bestScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  const initializeGame = () => {
    const newCells: Cell[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    addRandomCell(newCells);
    addRandomCell(newCells);
    setCells(newCells);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setPreviousStates([]);
  };

  const addRandomCell = (grid: Cell[][]) => {
    const newCell = generateRandomCell(grid);
    if (newCell) {
      grid[newCell.row][newCell.col] = {
        value: newCell.value,
        id: `${Date.now()}-${Math.random()}`,
      };
    }
  };

  const move = (direction: Direction) => {
    if (gameOver) return;

    const previousState = {
      cells: JSON.parse(JSON.stringify(cells)),
      score: score,
    };

    let moved = false;
    const newCells = JSON.parse(JSON.stringify(cells));
    let newScore = score;
    const vector = VECTORS[direction];
    
    // Clear merged flags
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (newCells[x][y]) {
          delete newCells[x][y].mergedFrom;
        }
      }
    }

    // Move tiles
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!newCells[x][y]) continue;

        let newX = x + vector.x;
        let newY = y + vector.y;

        while (
          newX >= 0 && newX < GRID_SIZE &&
          newY >= 0 && newY < GRID_SIZE
        ) {
          if (!newCells[newX][newY]) {
            newCells[newX][newY] = newCells[newX - vector.x][newY - vector.y];
            newCells[newX - vector.x][newY - vector.y] = null;
            moved = true;
          } else if (
            newCells[newX][newY].value === newCells[newX - vector.x][newY - vector.y].value &&
            !newCells[newX][newY].mergedFrom
          ) {
            const value = newCells[newX][newY].value * 2;
            newCells[newX][newY] = {
              value,
              id: `${Date.now()}-${Math.random()}`,
              mergedFrom: [newCells[newX][newY], newCells[newX - vector.x][newY - vector.y]],
            };
            newCells[newX - vector.x][newY - vector.y] = null;
            newScore += value;
            moved = true;

            if (value === 2048 && !won) {
              setWon(true);
              toast.success("Congratulations! You've reached 2048!");
            }
            break;
          }
          newX += vector.x;
          newY += vector.y;
        }
      }
    }

    if (moved) {
      setPreviousStates([previousState, ...previousStates]);
      addRandomCell(newCells);
      setCells(newCells);
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("bestScore", newScore.toString());
      }

      if (!canMove(newCells)) {
        setGameOver(true);
        toast.error("Game Over!");
      }
    }
  };

  const undo = () => {
    if (previousStates.length > 0) {
      const [previousState, ...rest] = previousStates;
      setCells(previousState.cells);
      setScore(previousState.score);
      setPreviousStates(rest);
      setGameOver(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: { [key: string]: Direction } = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      
      if (directions[event.key]) {
        event.preventDefault();
        move(directions[event.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cells, score, gameOver]);

  // Add touch and mouse controls
  useSwipe(move);
  useDrag(move);

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800">2048</h1>
            <p className="text-neutral-600">Join the numbers to get to 2048!</p>
          </div>
          <div className="space-y-2">
            <Card className="p-3 text-center">
              <p className="text-sm text-neutral-600">SCORE</p>
              <p className="text-xl font-bold">{score}</p>
            </Card>
            <Card className="p-3 text-center bg-orange-50">
              <p className="text-sm text-neutral-600">BEST</p>
              <p className="text-xl font-bold">{bestScore}</p>
            </Card>
          </div>
        </div>

        <div className="flex gap-2 bg-neutral-200 p-2 rounded-lg">
          <Button
            variant="outline"
            onClick={() => initializeGame()}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          <Button
            variant="outline"
            onClick={undo}
            disabled={previousStates.length === 0}
            className="flex-1"
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
        </div>

        <Card className="p-4 bg-gray-50 aspect-square">
          <div className="relative w-full h-full grid grid-cols-4 gap-2">
            {cells.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`relative rounded-lg ${
                    cell
                      ? `${getColor(cell.value)} transition-all duration-100 
                      ${cell.value==4? 'bg-yellow-100' : 'text-neutral-900'}
                      ${cell.value==8? 'bg-orange-300' : 'text-neutral-900'}
                      ${cell.value==16? 'bg-orange-400' : 'text-neutral-900'}
                      ${cell.value==32? 'bg-red-300' : 'text-neutral-900'}
                      ${cell.value==64? 'bg-red-400' : 'text-neutral-900'}
                      ${cell.value==128? 'bg-green-400' : 'text-neutral-900'}
                      ${cell.value==256? 'bg-green-500' : 'text-neutral-900'}
                      ${cell.value==512? 'bg-blue-400' : 'text-neutral-900'}
                      ${cell.value==1024? 'bg-blue-500' : 'text-neutral-900'}
                      ${cell.value==2048? 'bg-purple-500' : 'text-neutral-900'}`
                      : "bg-gray-200"
                  }  flex items-center justify-center`}
                >
                  {cell && (
                    <span
                      className={`text-2xl font-bold`}
                    >
                      {cell.value}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <div />
          <Button variant="outline" onClick={() => move("up")}>
            <ArrowUp className="w-4 h-4" />
          </Button>
          <div />
          <Button variant="outline" onClick={() => move("left")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => move("down")}>
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => move("right")}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}