import React from 'react';

/**
 * Team Drilldown Modal
 * Shows detailed view of a specific team's composition and risks
 */
const TeamDrilldownModal = ({ team, onClose }) => {
    if (!team) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="text-2xl font-bold">{team.name}</h2>
                        <p className="text-secondary text-sm">Led by {team.lead} • {team.memberCount} Members</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="grid grid-3 mb-6">
                        <div className="stat-box">
                            <span className="text-muted text-xs uppercase">Avg Utilization</span>
                            <div className="text-xl font-bold">{team.utilization}%</div>
                        </div>
                        <div className="stat-box">
                            <span className="text-muted text-xs uppercase">Delivery Health</span>
                            <div className="text-xl font-bold">{team.deliveryHealth}%</div>
                        </div>
                        <div className="stat-box">
                            <span className="text-muted text-xs uppercase">Cost Impact</span>
                            <div className="text-xl font-bold">₹{team.costImpact.toLocaleString()}</div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4">Team Composition & Risk</h3>
                    <ul className="member-list">
                        <li className="member-item member-header text-xs text-muted uppercase">
                            <span className="w-1/3">Name</span>
                            <span>Utilization</span>
                            <span>PR Load</span>
                            <span>Burnout Risk</span>
                        </li>
                        {team.members.map((member, idx) => (
                            <li key={idx} className="member-item">
                                <div className="member-info">
                                    <img src={member.avatar} alt="" className="member-avatar" />
                                    <div>
                                        <div className="font-bold">{member.name}</div>
                                        <div className="text-xs text-muted">{member.role}</div>
                                    </div>
                                </div>

                                <div className="member-stats">
                                    <div className={`font-mono ${member.utilization > 90 ? 'text-error' : ''}`}>
                                        {member.utilization}%
                                    </div>
                                    <div className="font-mono">{member.prLoad}</div>
                                    <span className={`badge badge-${member.burnout === 'High' ? 'error' :
                                            member.burnout === 'Medium' ? 'warning' : 'success'
                                        }`}>
                                        {member.burnout}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="modal-footer mt-6 flex justify-end gap-sm">
                    <button className="btn btn-outline" onClick={onClose}>Close</button>
                    <button className="btn btn-primary">Export Report</button>
                </div>
            </div>
        </div>
    );
};

export default TeamDrilldownModal;
