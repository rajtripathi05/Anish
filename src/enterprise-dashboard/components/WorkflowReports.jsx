import React from 'react';
import './WorkflowReports.css';

/**
 * Workflow Reports View
 * Displays the raw workflow issue reports directly
 */
const WorkflowReports = ({ issues }) => {
    if (!issues || issues.length === 0) {
        return (
            <div className="workflow-reports-empty">
                <div className="empty-icon">📋</div>
                <h3>No Workflow Reports Found</h3>
                <p>Toggle to "Using Live Data" to fetch real workflow reports from GitHub</p>
            </div>
        );
    }

    return (
        <div className="workflow-reports">
            <div className="reports-header">
                <h2 className="gradient-text">Workflow Reports</h2>
                <span className="reports-count">{issues.length} reports</span>
            </div>

            <div className="reports-timeline">
                {issues.map((issue, index) => (
                    <div key={issue.number} className="report-card glass-card">
                        {/* Report Header */}
                        <div className="report-header">
                            <div className="report-title-section">
                                <h3 className="report-title">{issue.title}</h3>
                                <div className="report-meta">
                                    <span className="report-number">#{issue.number}</span>
                                    <span className="report-date">
                                        {new Date(issue.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <a
                                        href={issue.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="report-link"
                                    >
                                        View on GitHub →
                                    </a>
                                </div>
                            </div>

                            {issue.state && (
                                <span className={`report-status status-${issue.state}`}>
                                    {issue.state}
                                </span>
                            )}
                        </div>

                        {/* Report Body */}
                        <div className="report-body">
                            <div
                                className="report-content markdown-content"
                                dangerouslySetInnerHTML={{
                                    __html: formatMarkdown(issue.body)
                                }}
                            />
                        </div>

                        {/* Report Footer */}
                        {issue.labels && issue.labels.length > 0 && (
                            <div className="report-footer">
                                <div className="report-labels">
                                    {issue.labels.map((label, i) => (
                                        <span
                                            key={i}
                                            className="label badge"
                                            style={{
                                                backgroundColor: `#${label.color || '666'}`,
                                                color: getContrastColor(label.color || '666')
                                            }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Simple markdown formatting
 */
function formatMarkdown(markdown) {
    if (!markdown) return '';

    let html = markdown
        // Convert headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')

        // Convert bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

        // Convert italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        // Convert links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

        // Convert checkboxes
        .replace(/- \[x\]/gi, '<span class="checkbox checked">✅</span>')
        .replace(/- \[ \]/g, '<span class="checkbox unchecked">☐</span>')

        // Convert bullet lists
        .replace(/^\* (.+)$/gim, '<li>$1</li>')
        .replace(/^- (.+)$/gim, '<li>$1</li>')

        // Convert line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';

    // Wrap consecutive list items in ul
    html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');

    return html;
}

/**
 * Get contrasting text color for label background
 */
function getContrastColor(hexColor) {
    if (!hexColor) return '#ffffff';

    // Remove # if present
    hexColor = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default WorkflowReports;
