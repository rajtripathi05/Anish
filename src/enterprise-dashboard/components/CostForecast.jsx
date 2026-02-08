import React from 'react';

export default function CostForecast() {
    return (
        <div className="summary-card glass-card">
            <h2 className="section-title">💰 Cost of Delay Forecast</h2>
            <p className="cost-forecast-text">
                Current delivery slip may increase cost by <br />
                <span className="cost-impact">₹8.2 Lakhs</span>
            </p>
        </div>
    );
}
