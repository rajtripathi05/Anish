import React, { useState } from 'react';

/**
 * Explanation Tooltip Component
 * Provides context ("Trust Layer") for metrics
 */
const ExplainabilityTooltip = ({ text, calculation, confidence = "High" }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="explanation-tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <div className="tooltip-trigger">❓</div>

            {isVisible && (
                <div className="explanation-tooltip glass-card">
                    <div className="tooltip-header">
                        <span className="tooltip-title">Metric Explanation</span>
                        <span className={`confidence-badge confidence-${confidence.toLowerCase()}`}>
                            {confidence} Confidence
                        </span>
                    </div>
                    <div className="tooltip-body">
                        <p className="tooltip-text">{text}</p>
                        {calculation && (
                            <div className="tooltip-calc">
                                <strong>Calculation:</strong> {calculation}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExplainabilityTooltip;
