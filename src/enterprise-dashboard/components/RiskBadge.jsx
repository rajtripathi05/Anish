import React from 'react';

export default function RiskBadge({ score }) {
    let color = "success";
    let label = "On Track";

    if (score < 70) {
        color = "warning";
        label = "At Risk";
    }
    if (score < 40) {
        color = "error";
        label = "Critical";
    }

    // Map colors to CSS variables or class names
    const getColorClass = (c) => {
        switch (c) {
            case 'success': return 'badge-success';
            case 'warning': return 'badge-warning';
            case 'error': return 'badge-error';
            default: return 'badge-neutral';
        }
    };

    return (
        <span className={`risk-badge ${getColorClass(color)}`}>
            {label}
        </span>
    );
}
