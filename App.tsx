
import React, { useState, useEffect, useCallback } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import NetworkVisualizer from './components/NetworkVisualizer';
import PredictionBar from './components/PredictionBar';
import ControlPanel from './components/ControlPanel';
import { getDigitPrediction } from './services/geminiService';
import { runSimulation } from './services/simulationService';
import type { LayerActivation, PredictionItem } from './types';
import { GithubIcon } from './components/icons/GithubIcon';

const App: React.FC = () => {
    const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);
    const [activations, setActivations] = useState<LayerActivation[]>([]);
    const [basePredictions, setBasePredictions] = useState<PredictionItem[]>([]);
    const [displayPredictions, setDisplayPredictions] = useState<PredictionItem[]>([]);
    const [dropoutRate, setDropoutRate] = useState<number>(0.1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const initialActivations = runSimulation(dropoutRate);

    useEffect(() => {
        setActivations(initialActivations);
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({ digit: i, confidence: 0.1 }));
        setBasePredictions(initialPredictions);
        setDisplayPredictions(initialPredictions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrawEnd = useCallback((dataUrl: string) => {
        setDrawingDataUrl(dataUrl);
    }, []);

    const handleClear = useCallback(() => {
        setDrawingDataUrl(null);
        setActivations(initialActivations);
        const initialPredictions = Array.from({ length: 10 }, (_, i) => ({ digit: i, confidence: 0.1 }));
        setBasePredictions(initialPredictions);
        setDisplayPredictions(initialPredictions);
        setError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!drawingDataUrl) {
            return;
        }

        const processDrawing = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newActivations = runSimulation(dropoutRate, true);
                const geminiPredictions = await getDigitPrediction(drawingDataUrl);

                setActivations(newActivations);
                setBasePredictions(geminiPredictions);

            } catch (err) {
                console.error("Error processing drawing:", err);
                setError("Could not get prediction. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        processDrawing();
    }, [drawingDataUrl, dropoutRate]);

    useEffect(() => {
        // Simulate prediction changes based on dropout
        if (basePredictions.length === 0) return;

        const adjustedPredictions = basePredictions.map(p => {
            const noise = (Math.random() - 0.5) * dropoutRate;
            const newConfidence = p.confidence * (1 - dropoutRate) + noise;
            return { ...p, confidence: Math.max(0, Math.min(1, newConfidence)) };
        });

        const sum = adjustedPredictions.reduce((acc, p) => acc + p.confidence, 0);
        const normalizedPredictions = adjustedPredictions.map(p => ({ ...p, confidence: p.confidence / sum }));

        setDisplayPredictions(normalizedPredictions);

        // Also update the visual dropout in activations without a full resimulation
        setActivations(prevActivations => {
            return prevActivations.map(layer => {
                if (layer.type === 'DENSE') {
                    const originalActivations = layer.activations as number[];
                    const droppedActivations = originalActivations.map(a => Math.random() < dropoutRate ? 0 : a);
                    return { ...layer, activations: droppedActivations };
                }
                return layer;
            });
        });

    }, [dropoutRate, basePredictions]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
            <header className="mb-6 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    Digit<span className="text-cyan-400">Scope</span>
                </h1>
                <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
                    Draw a digit, see how a neural network "thinks", and adjust parameters to see their effect in real-time.
                </p>
                 <a href="https://github.com/ARUNAGIRINATHAN-K/DigitScope" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-slate-400 hover:text-cyan-400 transition-colors">
                    <GithubIcon className="w-5 h-5" />
                    View on GitHub
                </a>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-3 space-y-6">
                    <DrawingCanvas onDrawEnd={handleDrawEnd} onClear={handleClear} />
                    <ControlPanel dropoutRate={dropoutRate} setDropoutRate={setDropoutRate} />
                </div>

                {/* Middle Column */}
                <div className="lg:col-span-6">
                     <NetworkVisualizer activations={activations} isLoading={isLoading && !drawingDataUrl} />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3">
                    <PredictionBar predictions={displayPredictions} isLoading={isLoading} error={error} />
                </div>
            </main>
        </div>
    );
};

export default App;
