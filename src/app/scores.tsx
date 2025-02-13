import { useState } from 'react';
import styles from './styles/scores.module.css';
export default function Scores({ answered, correctScore, scoreHandler }: Readonly<{ answered: boolean, correctScore: number, scoreHandler: (scoreGuess: number) => void }>) {

  const [guess, setGuess] = useState<number | undefined>(undefined);
  const invalid = [27, 26, 25, 19]
  const scores = [];
  const clickHandler = (scoreGuess: number) => {
    setGuess(scoreGuess);
    scoreHandler(scoreGuess);
  }
  for (let i = 0; i < 30; i++) {
    if (!invalid.includes(i)) {
      if (!answered) {
        scores.push(<ScoreOption score={i} key={i} onClick={
          () => {
            clickHandler(i);
          }
        } />)
      } else if (i === correctScore) {
        scores.push(<button key={i} className={`${styles.scoreOption} ${styles.correctScore}`}>{i}</button>)
      } else if (i === guess) {
        scores.push(<button key={i} className={`${styles.scoreOption} ${styles.incorrectScore}`}>{i}</button>)
      } else {
        scores.push(<button key={i} className={`${styles.scoreOption}`}>{i}</button>)
      }
    }
  }
  return (
    <div className={styles.scores}>
      {scores}
    </div>
  );
}

function ScoreOption({ score, onClick }: Readonly<{ score: number, onClick: () => void }>) {
  return (
    <button onClick={() => {
      onClick();
    }} className={styles.scoreOption}>{score}</button>
  );
}
