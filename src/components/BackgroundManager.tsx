import React, { useState } from 'react';
import BackgroundCreationCard from './BackgroundCreationCard';
import BackgroundCard from './BackgroundCard';

interface Background {
    name: string;
    description: string;
    imageUrl: string;
    referenceUrl: string;
}

const BackgroundManager: React.FC = () => {
    const [backgrounds, setBackgrounds] = useState<Background[]>([]);

    const handleCreateBackground = (newBackground: Background) => {
        setBackgrounds([...backgrounds, newBackground]);
    };

    const handleEditBackground = (index: number) => {
        // Lógica para editar um background
    };

    const handleDeleteBackground = (index: number) => {
        const updatedBackgrounds = backgrounds.filter((_, i) => i !== index);
        setBackgrounds(updatedBackgrounds);
    };

    return (
        <div className="container">
            <div className="text-center mb-4">
                <h2>Cadastrar novo Background:</h2>
            </div>
            <div className="d-flex justify-content-center mb-4">
                <BackgroundCreationCard onCreate={handleCreateBackground} />
            </div>
            <hr className="my-4" />
            <div className="text-center mb-4">
                <h2>Backgrounds:</h2>
            </div>
            <div className="row g-4">
                {backgrounds.map((background, index) => (
                    <div className="col-md-6 col-lg-4" key={index}>
                        <BackgroundCard
                            background={background}
                            onEdit={() => handleEditBackground(index)}
                            onDelete={() => handleDeleteBackground(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BackgroundManager;
