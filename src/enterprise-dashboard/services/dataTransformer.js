/**
 * Data Transformer - Parse and Transform Workflow Outputs
 * Extracts structured data from workflow-generated GitHub issues
 */

class DataTransformer {
    /**
     * Parse a workflow issue body to extract metrics
     */
    static parseWorkflowIssue(issue) {
        if (!issue || !issue.body) return null;

        const body = issue.body;
        const parsed = {
            id: issue.number,
            title: issue.title,
            date: issue.created_at,
            url: issue.html_url,
            raw: body,
            metrics: {},
            commits: [],
            pullRequests: [],
            issues: [],
            insights: {}
        };

        // Extract date from title (e.g., "Date: February 7, 2026")
        const dateMatch = body.match(/Date:\s*([^\n]+)/i);
        if (dateMatch) {
            parsed.metrics.reportDate = dateMatch[1].trim();
        }

        // Extract commit count
        const commitMatch = body.match(/Commits Made Today:\s*(\d+)/i);
        if (commitMatch) {
            parsed.metrics.commitsToday = parseInt(commitMatch[1]);
        }

        // Extract commits list
        const commitSection = body.match(/(?:Latest|Commits)[\s\S]*?(?=\n#{1,2}|$)/i);
        if (commitSection) {
            const commitLines = commitSection[0].match(/✅.*?(?:\n|$)/g) || [];
            parsed.commits = commitLines.map(line => {
                const timeMatch = line.match(/(\d{1,2}:\d{2})/);
                const messageMatch = line.match(/"([^"]+)"/);
                return {
                    time: timeMatch ? timeMatch[1] : null,
                    message: messageMatch ? messageMatch[1] : line.replace(/✅/g, '').trim()
                };
            });
        }

        // Extract PR count and details
        const prMatch = body.match(/Pull Requests:\s*(\d+)/i);
        if (prMatch) {
            parsed.metrics.pullRequests = parseInt(prMatch[1]);
        }

        const prSection = body.match(/Pull Requests:[\s\S]*?(?=\n#{1,2}|$)/i);
        if (prSection) {
            const prLines = prSection[0].match(/(?:✅|❌).*?PR.*?#(\d+).*?(?:\n|$)/gi) || [];
            parsed.pullRequests = prLines.map(line => {
                const numberMatch = line.match(/#(\d+)/);
                const statusMatch = line.match(/✅/) ? 'merged' : 'open';
                return {
                    number: numberMatch ? parseInt(numberMatch[1]) : null,
                    status: statusMatch,
                    title: line.replace(/(?:✅|❌)/g, '').trim()
                };
            });
        }

        // Extract open issues count
        const issuesMatch = body.match(/Open Issues:\s*(\d+)/i);
        if (issuesMatch) {
            parsed.metrics.openIssues = parseInt(issuesMatch[1]);
        }

        // Extract releases count
        const releasesMatch = body.match(/Releases:\s*(\d+|None)/i);
        if (releasesMatch) {
            parsed.metrics.releases = releasesMatch[1] === 'None' ? 0 : parseInt(releasesMatch[1]);
        }

        // Extract insights/highlights
        const insightsSection = body.match(/Key Insights[\s\S]*?(?=\n#{1,2}|Next Steps|$)/i);
        if (insightsSection) {
            const text = insightsSection[0];

            // Extract positive highlights
            const positiveMatch = text.match(/What's Going.*?:[\s\S]*?(?=Areas|Attention|$)/i);
            if (positiveMatch) {
                parsed.insights.positive = this.extractBulletPoints(positiveMatch[0]);
            }

            // Extract areas needing attention
            const attentionMatch = text.match(/Attention Needed[\s\S]*?(?=\n#{1,2}|$)/i);
            if (attentionMatch) {
                parsed.insights.attention = this.extractBulletPoints(attentionMatch[0]);
            }
        }

        // Extract next steps
        const nextStepsSection = body.match(/Next Steps[\s\S]*?(?=\n#{1,2}|Project Summary|$)/i);
        if (nextStepsSection) {
            parsed.insights.nextSteps = this.extractBulletPoints(nextStepsSection[0]);
        }

        // Extract project status
        const statusMatch = body.match(/Status:\s*([^\n]+)/i);
        if (statusMatch) {
            parsed.metrics.projectStatus = statusMatch[1].trim();
        }

        return parsed;
    }

    /**
     * Extract bullet points from markdown text
     */
    static extractBulletPoints(text) {
        const bullets = text.match(/[🔥🎯🎨⚙️💾📚🔄🛠️📖🏷️].+/g) || [];
        return bullets.map(b => b.trim());
    }

    /**
     * Aggregate multiple workflow issues into time-series data
     */
    static aggregateWorkflowData(issues) {
        const parsed = issues.map(issue => this.parseWorkflowIssue(issue)).filter(Boolean);

        // Sort by date (newest first)
        parsed.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Calculate aggregated metrics
        const aggregated = {
            totalReports: parsed.length,
            dateRange: {
                start: parsed[parsed.length - 1]?.date,
                end: parsed[0]?.date
            },
            timeline: parsed,
            summary: {
                totalCommits: parsed.reduce((sum, p) => sum + (p.metrics.commitsToday || 0), 0),
                totalPRs: parsed.reduce((sum, p) => sum + (p.metrics.pullRequests || 0), 0),
                avgCommitsPerDay: 0,
                avgPRsPerDay: 0
            }
        };

        if (parsed.length > 0) {
            aggregated.summary.avgCommitsPerDay = (aggregated.summary.totalCommits / parsed.length).toFixed(1);
            aggregated.summary.avgPRsPerDay = (aggregated.summary.totalPRs / parsed.length).toFixed(1);
        }

        return aggregated;
    }

    /**
     * Transform commits data for analytics
     */
    static transformCommits(commits) {
        if (!commits || !Array.isArray(commits)) return [];

        return commits.map(commit => {
            // Handle both GitHub API format and mock data format
            if (commit.commit) {
                // GitHub API format
                return {
                    sha: commit.sha,
                    message: commit.commit.message,
                    author: commit.commit.author.name,
                    date: commit.commit.author.date,
                    url: commit.html_url
                };
            } else {
                // Mock data format (already transformed)
                return {
                    sha: commit.sha || Math.random().toString(36).substring(7),
                    message: commit.message,
                    author: commit.author,
                    date: commit.date,
                    url: commit.url || '#'
                };
            }
        });
    }

    /**
     * Transform pull requests data
     */
    static transformPullRequests(prs) {
        if (!prs || !Array.isArray(prs)) return [];

        return prs.map(pr => {
            // Handle both GitHub API format and mock data format
            if (pr.user) {
                // GitHub API format
                return {
                    number: pr.number,
                    title: pr.title,
                    state: pr.state,
                    author: pr.user.login,
                    created: pr.created_at,
                    updated: pr.updated_at,
                    merged: pr.merged_at,
                    url: pr.html_url
                };
            } else {
                // Mock data format (already transformed)
                return {
                    number: pr.number,
                    title: pr.title,
                    state: pr.state,
                    author: pr.author,
                    created: pr.created,
                    updated: pr.updated,
                    merged: pr.merged,
                    url: pr.url || '#'
                };
            }
        });
    }

    /**
     * Calculate time-series metrics for charts
     */
    static calculateTimeSeries(workflowData, metric = 'commits') {
        const timeline = workflowData.timeline || [];

        return timeline.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            value: item.metrics[`${metric}Today`] || 0,
            label: item.title
        }));
    }

    /**
     * Extract velocity trends (commits per week)
     */
    static calculateVelocityTrends(commits) {
        const weeklyData = {};

        commits.forEach(commit => {
            const date = new Date(commit.date);
            const weekStart = this.getWeekStart(date);
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { count: 0, week: weekKey };
            }
            weeklyData[weekKey].count++;
        });

        return Object.values(weeklyData).sort((a, b) =>
            new Date(a.week) - new Date(b.week)
        );
    }

    /**
     * Get start of week (Monday) for a given date
     */
    static getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }
}

export default DataTransformer;
