import React, { useState, useEffect, useContext } from 'react';
import MetricCard from './MetricCard';
import RiskBadge from './RiskBadge';
import Bottlenecks from './Bottlenecks';
import CostForecast from './CostForecast';
import ExecutiveStrip from './ExecutiveStrip';
import AlertsBanner from './AlertsBanner';
import TeamPortfolioTable from './TeamPortfolioTable';
import ExplainabilityTooltip from './ExplainabilityTooltip';
import { LineChart, DonutChart, BarChart } from './ChartComponents';
import { RoleContext } from '../context/RoleContext';
import './ExecutiveSummary.css';
import './RiskBadge.css';
import './NewWidgets.css';

/**
 * Executive Summary Dashboard
 * High-level overview of delivery health, productivity, and team metrics
 */
const ExecutiveSummary = ({ data, onSelectTeam }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { role } = useContext(RoleContext);

    useEffect(() => {
        if (data) {
            setMetrics(data);
            setLoading(false);
        }
    }, [data]);

    if (loading || !metrics) {
        return (
            <div className="executive-summary loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    const { deliveryHealth, productivity, costEfficiency, workforce, risks, enterpriseTeams } = metrics;

    // Detect critical risks for AlertsBanner
    const criticalTeams = enterpriseTeams?.filter(t => t.riskLevel === 'Critical') || [];
    const riskAlerts = criticalTeams.map(t => ({ message: `${t.name} is at critical risk (Health: ${t.deliveryHealth}%)` }));

    return (
        <div className="executive-summary">

            {/* 1. Alerts Banner - Always visible if risks exist */}
            <AlertsBanner alerts={riskAlerts} totalRisk={criticalTeams.length} />

            {/* 2. Executive Strip - Top level KPI summary */}
            <ExecutiveStrip
                health={deliveryHealth?.overall}
                cost={costEfficiency}
                risk={risks}
            />

            {/* 3. Role-Based Widgets Section */}
            <div className="charts-section grid grid-3">
                {/* Only show Bottlenecks to CTO, VP, PM */}
                {['CTO', 'VP Engineering', 'Project Manager', 'General'].includes(role) && (
                    <Bottlenecks />
                )}

                {/* Only show Cost Forecast to CFO, CTO, VP, CEO */}
                {['CFO', 'CTO', 'VP Engineering', 'CEO', 'General'].includes(role) && (
                    <CostForecast />
                )}

                {/* AI Recommendations */}
                <div className="summary-card glass-card">
                    <h2 className="section-title">✨ AI Recommendations</h2>
                    <ul className="bottleneck-list">
                        <li className="bottleneck-item">
                            Hire 2 backend engineers for Team Alpha
                            <ExplainabilityTooltip text="Based on sustained 92% utilization for 3 sprints." />
                        </li>
                        <li className="bottleneck-item">
                            Invest in CI/CD stabilization
                            <ExplainabilityTooltip text="CI failure rate increased by 15% this week." />
                        </li>
                    </ul>
                </div>
            </div>

            {/* 4. Team Portfolio Table - Interactive drilldown */}
            {enterpriseTeams && enterpriseTeams.length > 0 && (
                <div className="mb-8">
                    <TeamPortfolioTable
                        teams={enterpriseTeams}
                        onSelectTeam={onSelectTeam}
                    />
                </div>
            )}

            {/* 5. Historical Charts Section */}
            <div className="charts-section grid grid-2">
                {/* Delivery Health Breakdown */}
                <div className="chart-card glass-card">
                    <h2 className="section-title">
                        📊 Delivery Health Breakdown
                        <ExplainabilityTooltip text="Composite score of Velocity, PR Merge Rate, and Consistency." />
                    </h2>
                    <DonutChart
                        data={[
                            { label: 'Velocity', value: deliveryHealth?.breakdown?.velocity || 0, color: '#10b981' },
                            { label: 'PR Merge Rate', value: deliveryHealth?.breakdown?.prMergeRate || 0, color: '#3b82f6' },
                            { label: 'Consistency', value: deliveryHealth?.breakdown?.consistency || 0, color: '#f59e0b' }
                        ]}
                        size={200}
                    />
                </div>

                {/* Velocity Trend */}
                <div className="chart-card glass-card">
                    <h2 className="section-title">📈 Velocity Trend (Last 30 Days)</h2>
                    <LineChart
                        data={productivity?.velocityTimeline || []}
                        height={200}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSummary;
