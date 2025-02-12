import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditKanji.css'; // Assuming similar styling

const CreateKanji: React.FC = () => {
    const [jsonInput, setJsonInput] = useState<string>('');
    const [character, setCharacter] = useState<string>('');
    const [readings, setReadings] = useState<string[]>(['']);
    const [words, setWords] = useState<{ value: string, reading: string, translation: string }[]>([]);
    const navigate = useNavigate();

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonInput(e.target.value);
    };


    const fetchFromJisho = async (query: string) => {
        const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Error fetching data from Jisho');
        }
        const res = await response.json();
        const reading: string = res.data[0]?.japanese[0]?.reading || '';
        const translation: string = res.data[0]?.senses[0]?.english_definitions.join(",") || '';

        return { reading, translation };
    };

    const handleGenerate = async () => {
        try {
            const data: { character: string; readings: string[]; words: string[] } = JSON.parse(jsonInput);
            setCharacter(data.character);
            setReadings(data.readings);
            const jishoDefinitions = await Promise.all(data.words.map(x => fetchFromJisho(x)));
            const fixedWords = data.words.map((x, i) => Object.assign({ value: x }, jishoDefinitions[i]));
            setWords(fixedWords);
        } catch (error) {
            alert('Invalid JSON');
        }
    };

    const handleSave = async () => {
        const newKanji = { character, readings, words };

        await fetch('http://localhost:3000/kanji', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newKanji),
        });

        navigate('/');
    };

    return (
        <div className="create-kanji-container">
            <h2>Create Kanji</h2>
            <div className="form-group">
                <label>JSON Input:</label>
                <textarea value={jsonInput} onChange={handleJsonChange} rows={10} style={{ width: '100%' }} />
                <button onClick={handleGenerate}>Generate from JSON</button>
            </div>
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
                                onChange={(e) => {
                                    const updatedReadings = [...readings];
                                    updatedReadings[index] = e.target.value;
                                    setReadings(updatedReadings);
                                }}
                            />
                            <button onClick={() => setReadings(readings.filter((_, idx) => idx !== index))} className="remove-btn">Remove</button>
                            <hr />
                        </div>
                    ))}
                    <button onClick={() => setReadings([...readings, ''])} className="add-btn">Add Reading</button>
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
                                onChange={(e) =>
                                    setWords(words.map((w, idx) =>
                                        idx === index ? { ...w, value: e.target.value } : w
                                    ))
                                }
                            />
                            <input
                                type="text"
                                placeholder="Reading"
                                value={word.reading}
                                onChange={(e) =>
                                    setWords(words.map((w, idx) =>
                                        idx === index ? { ...w, reading: e.target.value } : w
                                    ))
                                }
                            />
                            <input
                                type="text"
                                placeholder="Translation"
                                value={word.translation}
                                onChange={(e) =>
                                    setWords(words.map((w, idx) =>
                                        idx === index ? { ...w, translation: e.target.value } : w
                                    ))
                                }
                            />
                            <button onClick={() => setWords(words.filter((_, idx) => idx !== index))} className="remove-btn">Remove</button>
                            <hr />
                        </div>
                    ))}
                    <button onClick={() => setWords([...words, { value: '', reading: '', translation: '' }])} className="add-btn">Add Word</button>
                </div>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => navigate("/")}>Go back</button>
        </div>
    );
};

export default CreateKanji;