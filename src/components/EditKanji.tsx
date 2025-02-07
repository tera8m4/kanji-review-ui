import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditKanji.css'; // Import the CSS file

export interface Word {
    value: string;
    reading: string;
    translation: string;
}

export interface Kanji {
    _id?: string;
    character: string;
    readings: string[];
    words: Word[];
}

const EditKanji: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [kanji, setKanji] = useState<Kanji | null>(null);
    const [character, setCharacter] = useState<string>('');
    const [readings, setReadings] = useState<string[]>(['']);
    const [words, setWords] = useState<Word[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchKanji = async () => {
                const response = await fetch(`http://localhost:3000/kanji/${id}`);
                const data: Kanji = await response.json();
                setKanji(data);
                setCharacter(data.character);
                setReadings(data.readings);
                setWords(data.words);
            };
            fetchKanji();
        }
    }, [id]);

    const handleSave = async () => {
        const updatedKanji: Kanji = { character, readings, words };

        await fetch(`http://localhost:3000/kanji/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedKanji),
        });

        navigate('/');
    };

    const handleReadingChange = (index: number, newValue: string) => {
        const updatedReadings = [...readings];
        updatedReadings[index] = newValue;
        setReadings(updatedReadings);
    };

    const handleAddReading = () => {
        setReadings([...readings, '']);
    };

    const handleRemoveReading = (index: number) => {
        setReadings(readings.filter((_, idx) => idx !== index));
    };

    const handleWordChange = (index: number, newWord: Word) => {
        const updatedWords = [...words];
        updatedWords[index] = newWord;
        setWords(updatedWords);
    };

    const handleAddWord = () => {
        setWords([...words, { value: '', reading: '', translation: '' }]);
    };

    const handleRemoveWord = (index: number) => {
        setWords(words.filter((_, idx) => idx !== index));
    };

    if (!kanji) return <div>Loading...</div>;

    return (
        <div className="edit-kanji-container">
            <h2>Edit Kanji</h2>
            <div className="form-group">
                <label>
                    Character:
                    <input type="text" value={character} onChange={(e) => setCharacter(e.target.value)} />
                </label>
            </div>
            <div className="form-group">
                <label>Readings:</label>
                <div className="reading-word-container">
                    {readings.map((reading, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={reading}
                                onChange={(e) => handleReadingChange(index, e.target.value)}
                            />
                            <button onClick={() => handleRemoveReading(index)} className="remove-btn">Remove</button>
                            <hr />
                        </div>
                    ))}
                    <button onClick={handleAddReading} className="add-btn">Add Reading</button>
                </div>
            </div>
            <div className="form-group">
                <label>Words:</label>
                <div className="reading-word-container">
                    {words.map((word, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Word"
                                value={word.value}
                                onChange={(e) => handleWordChange(index, { ...word, value: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Reading"
                                value={word.reading}
                                onChange={(e) => handleWordChange(index, { ...word, reading: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Translation"
                                value={word.translation}
                                onChange={(e) => handleWordChange(index, { ...word, translation: e.target.value })}
                            />
                            <button onClick={() => handleRemoveWord(index)} className="remove-btn">Remove</button>
                            <hr />
                        </div>
                    ))}
                    <button onClick={handleAddWord} className="add-btn">Add Word</button>
                </div>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => navigate("/")}>Go back</button>
        </div>
    );
};

export default EditKanji;