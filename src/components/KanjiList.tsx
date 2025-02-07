// src/components/KanjiList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KanjiList.css'; // Import CSS for styling

type Kanji = {
    character: string;
    id: string;
    nextReviewDate: Date;
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
                    nextReviewDate: new Date(x["next_review_time"])
                };
                return kanji;
            })

            kanjiData.sort((a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime());
            setKanjis(kanjiData);
        };

        fetchKanjis();
    }, []);

    const handleCardClick = (kanji: string) => {
        navigate(`/review/${kanji}`);
    };

    const handleEditClick = (e: React.MouseEvent, kanji: string) => {
        e.stopPropagation();  // Prevent event propagation from button to card
        navigate(`/kanji/${kanji}/edit`);
    };

    return (
        <div className="kanji-list">
            {kanjis.map((kanji) => {
                const now = new Date();
                const isReviewable = now >= kanji.nextReviewDate; // Check if it's time for review

                return (<div
                    className={`kanji-card ${isReviewable ? 'clickable' : 'not-clickable'}`}
                    key={kanji.id} onClick={() => isReviewable && handleCardClick(kanji.id)}>
                    <h2>{kanji.character}</h2>
                    <button className="edit-button" onClick={(e) => handleEditClick(e, kanji.id)}>Edit</button>
                </div>);
            })}
        </div>
    );
};

export default KanjiList;