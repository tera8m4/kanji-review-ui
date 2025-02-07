import React, { useEffect, useRef, useState } from 'react';
import './WordReview.css';
import { useNavigate, useParams } from 'react-router-dom';
import * as wanakana from 'wanakana';

type Word = {
    word: string;
    reading: string;
    translation: string;
};

const WordReview: React.FC = () => {
    let { kanji } = useParams();
    const navigate = useNavigate();
    const [words, setWords] = useState<Word[]>([]);
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [userReading, setUserReading] = useState<string>('');
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [totalWords, setTotalWords] = useState<number>(0);
    const [isAllCorrect, setIsAllCorrect] = useState<boolean>(true);
    const [hint, setHint] = useState<string>(''); // State for displaying hints
    const inputRef = useRef<HTMLInputElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isCurrentIncorrect, setIsCurrentIncorrect] = useState<boolean>(false);

    useEffect(() => {
        async function fetchWords() {
            const words = await fetch(`http://localhost:3000/kanji/${kanji}/review`)
                .then(res => res.json());

            const newWords = words.words.map((x: any) => ({
                word: x.value,
                reading: x.reading,
                translation: x.translation
            }));

            setTotalWords(newWords.length);

            setCurrentWord(newWords.shift());
            setWords(newWords);
        }

        fetchWords();
    }, [kanji]);

    const checkAnswer = () => {
        if (isCurrentIncorrect) {
            moveToNextWord();
            return;
        }

        // Check if the user's answer is correct
        if (userReading.trim() !== currentWord!.reading) {
            setIsAllCorrect(false);
            setHint(`Incorrect! Correct answer: ${currentWord?.reading}`);
            setIsCurrentIncorrect(true);
            words.push(currentWord!);
            setWords(words);
            buttonRef.current?.focus();
        } else {
            setHint(''); // Clear hint if the answer is correct
            moveToNextWord();
        }
    };

    const moveToNextWord = () => {
        setIsCurrentIncorrect(false);
        setHint('');
        if (words.length > 0) {
            setCurrentWord(words.shift()!);
            setWords(words);
            setUserReading('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);

        } else {
            const url = `http://localhost:3000/kanji/${kanji}/review`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correct: isAllCorrect }),
            });

            setIsComplete(true);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
        }
    };

    if (isComplete) {
        return (
            <div className="result">
                {isAllCorrect
                    ? "All answers correct!"
                    : `Some answers were incorrect. You had incorrect answers.`}
                <button onClick={() => navigate("/")}>Go back</button>
            </div>
        );
    }

    if (words.length === 0 && currentWord == null) {
        return (<div className="no-words">Nothing here</div>);
    }

    // Calculate progress
    const progress = (totalWords - words.length - (!isCurrentIncorrect ? 1 : 0)) / totalWords * 100;

    return (
        <div className="word-review">
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="word"><strong>Word:</strong> {currentWord!.word}</div>
            <div className="translation"><strong>Translation:</strong> {currentWord!.translation}</div>
            <input
                type="text"
                value={userReading}
                ref={inputRef}
                onChange={(e) => setUserReading(wanakana.toHiragana(e.target.value, { IMEMode: true }))}
                className="input"
                placeholder="Enter the reading"
                onKeyDown={handleKeyPress}
                disabled={isCurrentIncorrect}
            />
            <button onClick={checkAnswer} ref={buttonRef} className="button">{isCurrentIncorrect ? 'Next' : 'Submit'}</button>
            {hint && <div className="hint">{hint}</div>}
        </div>
    );
};

export default WordReview;