import React, { useState, useEffect, useRef } from 'react';
import '../styles/FrontPage.css'; // For custom styles

const TEXT_COLOR = 'rgba(0, 255, 0, 0.9)';  // Green color for text
const BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.8)'; // Black color for background
const ALPHA_BACKGROUND_COLOR = '#00000018'; // Semi-transparent black
const FONT = '15pt monospace'; // Font style
const TEXT_COLUMN_WIDTH = 20; // Width of each column
const FPS = 20; // Frames per second

function getPseudoRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function MatrixBackground({ destroyMode }) {
    const matrixCanvasRef = useRef(null);

    const initializeMatrixCanvas = () => {
        if (!matrixCanvasRef.current) return;

        const canvas = matrixCanvasRef.current;
        const canvasContext = canvas.getContext('2d');

        if (!canvasContext) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvasContext.fillStyle = BACKGROUND_COLOR;
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const numberOfColumns = Math.floor(canvas.width / TEXT_COLUMN_WIDTH) + 1;
        const defaultYPositions = Array(numberOfColumns).fill(0);

        return defaultYPositions;
    };

    const drawMatrix = (yPositions) => {
        if (!matrixCanvasRef.current) return;

        const canvas = matrixCanvasRef.current;
        const canvasContext = canvas.getContext('2d');

        if (!canvasContext) return;

        canvasContext.fillStyle = ALPHA_BACKGROUND_COLOR;
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        canvasContext.fillStyle = TEXT_COLOR;
        canvasContext.font = FONT;

        const newYPositions = yPositions.map((y, index) => {
            const char = String.fromCharCode(getPseudoRandomInRange(33, 126));
            const x = index * TEXT_COLUMN_WIDTH;

            canvasContext.fillText(char, x, y);

            const shouldResetYPosition = y > canvas.height;
            return shouldResetYPosition ? 0 : y + 20;
        });

        return newYPositions;
    };

    useEffect(() => {
        const defaultYPositions = initializeMatrixCanvas();

        window.addEventListener('resize', initializeMatrixCanvas);

        const animate = (yPositions) => {
            const newYPositions = drawMatrix(yPositions);

            if (newYPositions) {
                setTimeout(() => {
                    animate(newYPositions);
                }, 1000 / FPS);
            }
        };

        if (defaultYPositions) animate(defaultYPositions);

        return () => {
            window.removeEventListener('resize', initializeMatrixCanvas);
        };
    }, [drawMatrix, initializeMatrixCanvas]);

    useEffect(() => {
        if (destroyMode) {
            document.body.style.overflow = 'hidden'; // Disable scrolling
            document.body.style.position = 'fixed'; // Lock the body in place
            document.body.style.top = `-${window.scrollY}px`; // Adjust for current scroll position
            document.body.style.width = '100%'; // Ensure width is 100%
        } else {
            document.body.style.overflow = ''; // Reset overflow to default (enabled scrolling)
            document.body.style.position = ''; // Reset position
            document.body.style.top = ''; // Reset top
            document.body.style.width = ''; // Reset width
        }
    }, [destroyMode]);

    return (
        <canvas
            ref={matrixCanvasRef}
            aria-label="Matrix background"
            className="matrix-background"
        />
    );
}

function FrontPage() {
    const [destroyMode, setDestroyMode] = useState(false);
   
    const handleHover = (event) => {
        if (destroyMode) {
            event.target.style.display = 'none';
        }
    };

    const handleDestroyClick = () => {
        setDestroyMode(true);
    };

    const handleEnterClick = () => {
        window.location.href = '/portfolio/#intro'; // Redirect to the portfolio section
    };

    return (
        <div className={`front-page ${destroyMode ? 'destroy-mode' : ''}`}>
            <MatrixBackground destroyMode={destroyMode} />
            <div className={`hero-section text-center ${destroyMode ? 'destroy-mode' : ''}`}>
                <h1 className="matrix-text" onMouseOver={handleHover}>
                    You take the blue pill—you keep scrolling, and everything stays the same. You take the red pill—and you see how deep the rabbit hole goes.<br />
                    <span>All I'm offering is the truth.</span>
                </h1>
                <div className="button-group">
                    <button onClick={handleEnterClick} disabled={destroyMode} className='btn btn-one'>Enter</button>
                    <button onClick={handleDestroyClick} disabled={destroyMode} className='btn btn-two'>Destroy This Website</button>
                </div>
            </div>
        </div>
    );
}

export default FrontPage;