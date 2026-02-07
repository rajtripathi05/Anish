import React from 'react';
import { Sparkline } from './ChartComponents';
import './MetricCard.css';

/**
 * Metric Card Component
 * Displays a single metric with trend indicator and sparkline
 */
const MetricCard = ({
    title,
    value,
    unit = '',
    trend = null,
    sparklineData = null,
    icon = null,
    status = 'neutral',
    subtitle = null
}) => {
    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend > 0) return '↑';
        if (trend < 0) return '↓';
        return '→';
    };

    const getTrendClass = () => {
        if (!trend) return '';
        if (trend > 0) return 'trend-up';
        if (trend < 0) return 'trend-down';
        return 'trend-neutral';
    };

    const getStatusClass = () => {
        switch (status) {
            case 'success': return 'status-success';
            case 'warning': return 'status-warning';
            case 'error': return 'status-error';
            case 'info': return 'status-info';
            default: return 'status-neutral';
        }
    };

    return (
        <div className={`metric-card glass-card ${getStatusClass()}`}>
            <div className="metric-header">
                <div className="metric-title-row">
                    {icon && <span className="metric-icon">{icon}</span>}
                    <h3 className="metric-title">{title}</h3>
                </div>
                {trend !== null && (
                    <div className={`metric-trend ${getTrendClass()}`}>
                        <span className="trend-icon">{getTrendIcon()}</span>
                        <span className="trend-value">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>

            <div className="metric-body">
                <div className="metric-value-container">
                    <span className="metric-value">{value}</span>
                    {unit && <span className="metric-unit">{unit}</span>}
                </div>
                {subtitle && <p className="metric-subtitle">{subtitle}</p>}
            </div>

            {sparklineData && sparklineData.length > 0 && (
                <div className="metric-sparkline">
                    <Sparkline
                        data={sparklineData}
                        width={150}
                        height={40}
                        color={trend && trend > 0 ? 'var(--color-success)' : trend && trend < 0 ? 'var(--color-error)' : 'var(--color-accent)'}
                    />
                </div>
            )}
        </div>
    );
};

export default MetricCard;
