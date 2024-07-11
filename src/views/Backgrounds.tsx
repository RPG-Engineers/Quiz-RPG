import React from 'react';
import BackgroundManager from '../components/BackgroundManager';

const Background: React.FC = () => {
    return (
        <div className="container">
            <h1 className="mt-4">Gerenciar Backgrounds</h1>
            <BackgroundManager />
        </div>
    );
};

export default Background;
