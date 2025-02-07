// src/components/KanjiList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KanjiList.css'; // Import CSS for styling

type Kanji = {
    character: string;
    id: string;
};

const KanjiList: React.FC = () => {
    const [kanjis, setKanjis] = useState<Kanji[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock API data for demonstration purposes
        const fetchKanjis = async () => {
            const data = await fetch("http://localhost:3000/kanji")
                .then(x => x.json())

            const kanjiData: Kanji[] = data.map((x: any) => {
                const kanji: Kanji = {
                    character: x.character,
                    id: x.id,
                };
                return kanji;
            })
            setKanjis(kanjiData);
        };

        fetchKanjis();
    }, []);

    const handleCardClick = (kanji: string) => {
        navigate(`/review/${kanji}`);
    };


    return (
        <div className="kanji-list">
            {kanjis.map((kanji) => (
                <div key={kanji.id} className="kanji-card" onClick={() => handleCardClick(kanji.id)}>
                    <h2>{kanji.character}</h2>
                </div>
            ))}
        </div>
    );
};

export default KanjiList;