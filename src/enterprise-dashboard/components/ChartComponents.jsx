import React from 'react';
import './ChartComponents.css';

/**
 * Reusable Chart Components
 * Simple, lightweight chart implementations without external dependencies
 */

// Line Chart Component
export const LineChart = ({ data, title, height = 200 }) => {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 80;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <svg viewBox="0 0 100 100" style={{ height: `${height}px` }} className="line-chart">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} className="grid-line" />
                ))}

                {/* Line */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    className="chart-line"
                />

                {/* Area fill */}
                <polygon
                    points={`0,100 ${points} 100,100`}
                    fill="url(#areaGradient)"
                    className="chart-area"
                />

                {/* Data points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (d.value / maxValue) * 80;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="2"
                            className="chart-point"
                            data-label={d.label}
                        />
                    );
                })}

                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-primary)" />
                        <stop offset="100%" stopColor="var(--color-accent)" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="chart-labels">
                {data.map((d, i) => (
                    <span key={i} className="chart-label">{d.date}</span>
                ))}
            </div>
        </div>
    );
};

// Bar Chart Component
export const BarChart = ({ data, title, height = 200 }) => {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <div className="bar-chart" style={{ height: `${height}px` }}>
                {data.map((d, i) => (
                    <div key={i} className="bar-wrapper">
                        <div className="bar-container">
                            <div
                                className="bar"
                                style={{ height: `${(d.value / maxValue) * 100}%` }}
                                data-value={d.value}
                            >
                                <span className="bar-value">{d.value}</span>
                            </div>
                        </div>
                        <span className="bar-label">{d.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Donut Chart Component
export const DonutChart = ({ data, title, size = 200 }) => {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -90;

    const slices = data.map((d, i) => {
        const percentage = (d.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
        const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
        const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
        const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

        const largeArc = angle > 180 ? 1 : 0;

        return {
            path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`,
            color: d.color || `hsl(${(i * 360) / data.length}, 70%, 60%)`,
            label: d.label,
            value: d.value,
            percentage: percentage.toFixed(1)
        };
    });

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <div className="donut-chart-wrapper">
                <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }} className="donut-chart">
                    {slices.map((slice, i) => (
                        <path
                            key={i}
                            d={slice.path}
                            fill={slice.color}
                            className="donut-slice"
                            data-label={slice.label}
                        />
                    ))}
                    <circle cx="50" cy="50" r="25" fill="var(--color-bg-primary)" />
                    <text x="50" y="50" textAnchor="middle" dy=".3em" className="donut-center-text">
                        {total}
                    </text>
                </svg>
                <div className="donut-legend">
                    {slices.map((slice, i) => (
                        <div key={i} className="legend-item">
                            <span className="legend-color" style={{ background: slice.color }}></span>
                            <span className="legend-label">{slice.label}</span>
                            <span className="legend-value">{slice.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Sparkline Component (mini line chart)
export const Sparkline = ({ data, width = 100, height = 30, color = 'var(--color-accent)' }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="sparkline">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
            />
        </svg>
    );
};

// Progress Bar Component
export const ProgressBar = ({ value, max = 100, label, color = 'var(--color-primary)' }) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className="progress-container">
            {label && (
                <div className="progress-header">
                    <span className="progress-label">{label}</span>
                    <span className="progress-value">{value}/{max}</span>
                </div>
            )}
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%`, background: color }}
                >
                    <span className="progress-percentage">{percentage.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    );
};

// Heatmap Component
export const Heatmap = ({ data, title }) => {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const maxValue = Math.max(...data.flatMap(row => row.values));

    return (
        <div className="chart-container">
            {title && <h3 className="chart-title">{title}</h3>}
            <div className="heatmap">
                {data.map((row, i) => (
                    <div key={i} className="heatmap-row">
                        <span className="heatmap-label">{row.label}</span>
                        <div className="heatmap-cells">
                            {row.values.map((value, j) => {
                                const intensity = value / maxValue;
                                return (
                                    <div
                                        key={j}
                                        className="heatmap-cell"
                                        style={{
                                            background: `rgba(10, 77, 60, ${intensity})`,
                                            border: `1px solid rgba(212, 175, 55, ${intensity * 0.5})`
                                        }}
                                        data-value={value}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default {
    LineChart,
    BarChart,
    DonutChart,
    Sparkline,
    ProgressBar,
    Heatmap
};
