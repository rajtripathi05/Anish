import React from 'react';

export default function Bottlenecks() {
    return (
        <div className="summary-card glass-card">
            <h2 className="section-title">⚠ Bottlenecks Detected</h2>
            <ul className="bottleneck-list">
                <li className="bottleneck-item">PR Review cycle time ↑ 32%</li>
                <li className="bottleneck-item">CI Failures wasting ~14 engineer-hours</li>
                <li className="bottleneck-item">Backend Team utilization at 92%</li>
            </ul>
        </div>
    );
}
