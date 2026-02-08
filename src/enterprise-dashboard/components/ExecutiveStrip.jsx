import React from 'react';
import MetricCard from './MetricCard';
import ExplainabilityTooltip from './ExplainabilityTooltip';

/**
 * Executive Strip
 * Top-level always-visible strategic metrics
 */
const ExecutiveStrip = ({ health, cost, risk }) => {
    return (
        <div className="executive-strip grid grid-4 mb-8">
            {/* Risk Forecast */}
            <div className="strip-card glass-card">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted uppercase tracking-wider">Risk Forecast</span>
                        <span className="text-xl font-bold flex items-center gap-2">
                            {health < 70 ? 'High' : 'Low'}
                            <ExplainabilityTooltip
                                text="Based on velocity trend, PR cycle time, and code churn volatility."
                                calculation="Velocity Variance * 0.4 + Churn * 0.6"
                            />
                        </span>
                    </div>
                    <span className="strip-icon">📉</span>
                </div>
            </div>

            {/* Cost of Delay */}
            <div className="strip-card glass-card">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted uppercase tracking-wider">Cost of Delay</span>
                        <span className="text-xl font-bold flex items-center gap-2">
                            ₹{((cost?.costPerFeature || 0) * 1.2).toFixed(1)}k
                            <ExplainabilityTooltip
                                text="Projected financial impact of current delivery slippage."
                                calculation="Avg Daily Burn * Days Delayed"
                                confidence="Medium"
                            />
                        </span>
                    </div>
                    <span className="strip-icon">💰</span>
                </div>
            </div>

            {/* Bottlenecks */}
            <div className="strip-card glass-card">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted uppercase tracking-wider">Bottlenecks</span>
                        <span className="text-xl font-bold flex items-center gap-2">
                            3 Teams
                            <ExplainabilityTooltip
                                text="Teams with utilization > 90% or blocked PRs > 5."
                            />
                        </span>
                    </div>
                    <span className="strip-icon">🛑</span>
                </div>
            </div>

            {/* Workforce Load */}
            <div className="strip-card glass-card">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted uppercase tracking-wider">Workforce Load</span>
                        <span className="text-xl font-bold flex items-center gap-2">
                            87%
                            <ExplainabilityTooltip
                                text="Average utilization across all 50 active teams."
                            />
                        </span>
                    </div>
                    <span className="strip-icon">👥</span>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveStrip;
