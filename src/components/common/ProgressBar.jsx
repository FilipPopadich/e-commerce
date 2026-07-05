import React from 'react';
import './ProgressBar.css';

function ProgressBar({ steps, currentStep, onStepClick }) {
    return (
        <div className="progress-bar">
            {steps.map((label, idx) => {
                const done = idx < currentStep;
                const active = idx === currentStep;
                const clickable = typeof onStepClick === 'function' && idx < currentStep;

                return (
                    <div key={idx} className={`step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                        <button
                            type="button"
                            className="step-indicator"
                            onClick={() => clickable && onStepClick(idx)}
                            disabled={!clickable}
                            aria-current={active ? 'step' : undefined}
                            aria-label={`${label}${clickable ? ' — go back to this step' : ''}`}
                        >
                            {done ? '✓' : idx + 1}
                        </button>
                        <span className="step-label">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default ProgressBar;