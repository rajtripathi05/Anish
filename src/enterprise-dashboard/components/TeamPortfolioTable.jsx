import React from 'react';
import './TeamPortfolio.css';

/**
 * Team Portfolio Table
 * Interactive org-level view of all teams
 */
const TeamPortfolioTable = ({ teams, onSelectTeam }) => {
    return (
        <div className="team-portfolio glass-card">
            <div className="portfolio-header">
                <h2 className="section-title">🏢 Org Portfolio Overview</h2>
                <div className="portfolio-filters">
                    {/* Placeholders for filters */}
                    <span className="filter-badge active">All Teams</span>
                    <span className="filter-badge">Critical</span>
                    <span className="filter-badge">At Risk</span>
                </div>
            </div>

            <div className="table-container">
                <table className="enterprise-table">
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>Lead</th>
                            <th>Members</th>
                            <th>Utilization</th>
                            <th>Delivery Health</th>
                            <th>Cost Impact</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.slice(0, 10).map((team) => (
                            <tr
                                key={team.id}
                                onClick={() => onSelectTeam(team)}
                                className="clickable-row"
                            >
                                <td className="font-bold text-primary">{team.name}</td>
                                <td className="text-secondary">{team.lead}</td>
                                <td>{team.memberCount}</td>
                                <td>
                                    <div className="progress-cell">
                                        <span className="text-xs">{team.utilization}%</span>
                                        <div className="mini-progress">
                                            <div
                                                className="mini-progress-bar"
                                                style={{
                                                    width: `${team.utilization}%`,
                                                    backgroundColor: team.utilization > 90 ? 'var(--color-error)' : 'var(--color-success)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>{team.deliveryHealth}%</td>
                                <td className="font-mono">
                                    ₹{(team.costImpact / 1000).toFixed(1)}k
                                </td>
                                <td>
                                    <span className={`badge badge-${team.riskLevel === 'Critical' ? 'error' :
                                            team.riskLevel === 'At Risk' ? 'warning' : 'success'
                                        }`}>
                                        {team.riskLevel}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="portfolio-footer">
                Showing top 10 of {teams.length} teams
            </div>
        </div>
    );
};

export default TeamPortfolioTable;
