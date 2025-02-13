"use client";
import { useState } from 'react'
import { Card } from './lib/types'; // Adjust the import path as necessary
import Hand from './hand';
import Cut from './cut';
import { deal } from './lib/actions';
import Scores from './scores'; // Adjust the import path as necessary

import styles from './styles/page.module.css';

export default function Home() {
  const [hand, setHand] = useState<Card[]>([]);
  const [cut, setCut] = useState<Card | undefined>(undefined);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [stopwatch, setStopwatch] = useState<NodeJS.Timeout | undefined>(undefined);
  const [totalTime, setTotalTime] = useState<number | undefined>(undefined);
  const [streak, setStreak] = useState<number | undefined>(undefined);
  const [answered, setAnswered] = useState<boolean>(false);


  const handleScoreClick = (scoreGuess: number) => {
    // stop the timer
    clearInterval(stopwatch);
    setStopwatch(timeKeeper('stop'));
    setAnswered(true);
    // calculate the actual score
    if (score === scoreGuess) {
      setStreak(streak ? streak + 1 : 1);
      setTotalTime(totalTime ? totalTime + (timer ?? 0) : timer);
    } else {
      setStreak(0);
    }
  }

  // create a precision stopwatch
  const timeKeeper = (action: 'start' | 'stop') => {
    if (action === 'start') {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      setTimer(0);
      return interval;
    } else {
      setTimer(undefined);
    }
  }

  return (
    <div className="home">
      <h1 className={styles.nineteen}>nineteen</h1>
      <div className={styles.menu}>
        <div className="streakAndTime">streak: {streak} time: {totalTime}</div>
      </div>
      <div className={styles.cards}>
        <Cut cut={cut} />
        <Hand hand={hand} />
      </div>
      {/* if the timer isn't running show the deal button */}
      {timer === undefined &&
        <button onClick={() => {
          const { hand, cut, score } = deal();
          setHand(hand);
          setCut(cut);
          setScore(Number(score));
          setStopwatch(timeKeeper('start'));
          setAnswered(false);
        }} className={styles.dealBtn}>Deal</button>
      }
      <div className="scores">
        <Scores answered={answered} correctScore={score ?? 0} scoreHandler={handleScoreClick} />
      </div>
      {/* otherwise show the timer */}
      {timer !== undefined &&
        <div className={styles.timer}>{timer}</div>
      }
    </div>
  );
}
