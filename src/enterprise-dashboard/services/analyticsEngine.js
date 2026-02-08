/**
 * Analytics Engine - Business Intelligence Metrics
 * Calculates delivery health, productivity, cost efficiency, and workforce utilization
 */

import DataTransformer from './dataTransformer.js';

class AnalyticsEngine {
    /**
     * Calculate delivery health score (0-100)
     * Based on velocity, PR merge rate, and issue resolution
     */
    static calculateDeliveryHealth(workflowData, commits, prs) {
        let score = 0;
        const weights = {
            velocity: 0.4,
            prMergeRate: 0.3,
            consistency: 0.3
        };

        // Velocity score (based on commits per day)
        const avgCommitsPerDay = parseFloat(workflowData.summary?.avgCommitsPerDay || 0);
        const velocityScore = Math.min((avgCommitsPerDay / 10) * 100, 100); // 10+ commits/day = 100%
        score += velocityScore * weights.velocity;

        // PR merge rate score
        const mergedPRs = prs.filter(pr => pr.merged).length;
        const totalPRs = prs.length;
        const prMergeRate = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0;
        score += prMergeRate * weights.prMergeRate;

        // Consistency score (based on daily activity)
        const activeDays = workflowData.timeline?.length || 0;
        const consistencyScore = Math.min((activeDays / 30) * 100, 100); // 30 days = 100%
        score += consistencyScore * weights.consistency;

        return {
            overall: Math.round(score),
            breakdown: {
                velocity: Math.round(velocityScore),
                prMergeRate: Math.round(prMergeRate),
                consistency: Math.round(consistencyScore)
            },
            status: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention'
        };
    }

    /**
     * Calculate productivity metrics
     */
    static calculateProductivityMetrics(workflowData, commits, prs) {
        const timeline = workflowData.timeline || [];
        const totalCommits = workflowData.summary?.totalCommits || 0;
        const totalPRs = workflowData.summary?.totalPRs || 0;

        // Calculate trends (last 7 days vs previous 7 days)
        const recentData = timeline.slice(0, 7);
        const previousData = timeline.slice(7, 14);

        const recentCommits = recentData.reduce((sum, d) => sum + (d.metrics.commitsToday || 0), 0);
        const previousCommits = previousData.reduce((sum, d) => sum + (d.metrics.commitsToday || 0), 0);

        const commitTrend = previousCommits > 0
            ? ((recentCommits - previousCommits) / previousCommits) * 100
            : 0;

        // PR cycle time (average time from creation to merge)
        const mergedPRs = prs.filter(pr => pr.merged);
        const avgCycleTime = mergedPRs.length > 0
            ? mergedPRs.reduce((sum, pr) => {
                const created = new Date(pr.created);
                const merged = new Date(pr.merged);
                return sum + (merged - created) / (1000 * 60 * 60 * 24); // days
            }, 0) / mergedPRs.length
            : 0;

        return {
            totalCommits,
            totalPRs,
            avgCommitsPerDay: parseFloat(workflowData.summary?.avgCommitsPerDay || 0),
            avgPRsPerDay: parseFloat(workflowData.summary?.avgPRsPerDay || 0),
            commitTrend: Math.round(commitTrend),
            avgPRCycleTime: avgCycleTime.toFixed(1),
            codeChurn: this.calculateCodeChurn(commits)
        };
    }

    /**
     * Calculate code churn (commits that modify recently changed files)
     */
    static calculateCodeChurn(commits) {
        // Simplified: count commits with "fix", "refactor", "update" in message
        const churnKeywords = ['fix', 'refactor', 'update', 'revert'];
        const churnCommits = commits.filter(c =>
            churnKeywords.some(keyword => c.message.toLowerCase().includes(keyword))
        );

        return {
            total: churnCommits.length,
            percentage: commits.length > 0 ? Math.round((churnCommits.length / commits.length) * 100) : 0
        };
    }

    /**
     * Calculate cost efficiency metrics
     * Assumes average engineering cost and estimates ROI
     */
    static calculateCostEfficiency(workflowData, commits, prs, config = {}) {
        const {
            avgEngineerCost = 100000, // Annual cost per engineer
            teamSize = 1,
            workingDaysPerYear = 250
        } = config;

        const dailyCost = (avgEngineerCost * teamSize) / workingDaysPerYear;
        const activeDays = workflowData.timeline?.length || 1;
        const totalCost = dailyCost * activeDays;

        const totalCommits = workflowData.summary?.totalCommits || 0;
        const totalPRs = workflowData.summary?.totalPRs || 0;
        const mergedPRs = prs.filter(pr => pr.merged).length;

        return {
            totalCost: Math.round(totalCost),
            costPerCommit: totalCommits > 0 ? Math.round(totalCost / totalCommits) : 0,
            costPerFeature: mergedPRs > 0 ? Math.round(totalCost / mergedPRs) : 0,
            efficiency: totalCommits > 0 ? Math.round((totalCommits / activeDays) * 10) : 0, // Efficiency score
            roi: this.calculateROI(mergedPRs, totalCost)
        };
    }

    /**
     * Calculate ROI (simplified)
     */
    static calculateROI(features, cost) {
        const estimatedValuePerFeature = 5000; // Simplified assumption
        const totalValue = features * estimatedValuePerFeature;
        const roi = cost > 0 ? ((totalValue - cost) / cost) * 100 : 0;

        return {
            estimatedValue: totalValue,
            roi: Math.round(roi),
            status: roi >= 100 ? 'Excellent' : roi >= 50 ? 'Good' : roi >= 0 ? 'Break-even' : 'Negative'
        };
    }

    /**
     * Calculate workforce utilization metrics
     */
    static calculateWorkforceUtilization(commits, contributors) {
        // Group commits by author
        const commitsByAuthor = {};
        commits.forEach(commit => {
            const author = commit.author;
            if (!commitsByAuthor[author]) {
                commitsByAuthor[author] = { count: 0, dates: new Set() };
            }
            commitsByAuthor[author].count++;
            commitsByAuthor[author].dates.add(commit.date.split('T')[0]);
        });

        // Calculate metrics per contributor
        const contributorMetrics = Object.entries(commitsByAuthor).map(([author, data]) => ({
            name: author,
            commits: data.count,
            activeDays: data.dates.size,
            avgCommitsPerDay: (data.count / data.dates.size).toFixed(1),
            utilization: Math.min((data.dates.size / 30) * 100, 100) // % of days active in last 30
        }));

        // Sort by commits
        contributorMetrics.sort((a, b) => b.commits - a.commits);

        // Calculate team-wide metrics
        const totalActiveDays = new Set(commits.map(c => c.date.split('T')[0])).size;
        const avgUtilization = contributorMetrics.length > 0
            ? contributorMetrics.reduce((sum, c) => sum + c.utilization, 0) / contributorMetrics.length
            : 0;

        return {
            contributors: contributorMetrics,
            teamSize: contributorMetrics.length,
            totalActiveDays,
            avgUtilization: Math.round(avgUtilization),
            workloadDistribution: this.calculateWorkloadDistribution(contributorMetrics)
        };
    }

    /**
     * Calculate workload distribution (detect imbalances)
     */
    static calculateWorkloadDistribution(contributorMetrics) {
        if (contributorMetrics.length === 0) return { balance: 'N/A', gini: 0 };

        const commits = contributorMetrics.map(c => c.commits);
        const total = commits.reduce((sum, c) => sum + c, 0);
        const avg = total / commits.length;

        // Calculate standard deviation
        const variance = commits.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / commits.length;
        const stdDev = Math.sqrt(variance);

        // Coefficient of variation (lower = more balanced)
        const cv = avg > 0 ? (stdDev / avg) * 100 : 0;

        return {
            balance: cv < 30 ? 'Balanced' : cv < 60 ? 'Moderate' : 'Imbalanced',
            coefficientOfVariation: Math.round(cv),
            avgCommits: Math.round(avg),
            stdDev: Math.round(stdDev)
        };
    }

    /**
     * Predictive analytics - forecast delivery
     */
    static forecastDelivery(workflowData, targetFeatures = 10) {
        const avgPRsPerDay = parseFloat(workflowData.summary?.avgPRsPerDay || 0);

        if (avgPRsPerDay === 0) {
            return {
                daysToTarget: 'N/A',
                estimatedDate: null,
                confidence: 'Low'
            };
        }

        const daysToTarget = Math.ceil(targetFeatures / avgPRsPerDay);
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + daysToTarget);

        // Confidence based on consistency
        const timeline = workflowData.timeline || [];
        const consistency = timeline.length >= 7 ? 'High' : timeline.length >= 3 ? 'Medium' : 'Low';

        return {
            daysToTarget,
            estimatedDate: estimatedDate.toLocaleDateString(),
            confidence: consistency,
            currentVelocity: avgPRsPerDay
        };
    }

    /**
     * Detect delivery risks
     */
    static detectRisks(workflowData, commits, prs, contributors) {
        const risks = [];

        // Low velocity risk
        const avgCommitsPerDay = parseFloat(workflowData.summary?.avgCommitsPerDay || 0);
        if (avgCommitsPerDay < 2) {
            risks.push({
                type: 'velocity',
                severity: 'high',
                message: 'Low commit velocity detected. Consider reviewing team capacity.'
            });
        }

        // High PR cycle time risk
        const mergedPRs = prs.filter(pr => pr.merged);
        if (mergedPRs.length > 0) {
            const avgCycleTime = mergedPRs.reduce((sum, pr) => {
                const created = new Date(pr.created);
                const merged = new Date(pr.merged);
                return sum + (merged - created) / (1000 * 60 * 60 * 24);
            }, 0) / mergedPRs.length;

            if (avgCycleTime > 7) {
                risks.push({
                    type: 'cycle-time',
                    severity: 'medium',
                    message: `High PR cycle time (${avgCycleTime.toFixed(1)} days). Consider streamlining review process.`
                });
            }
        }

        // Workload imbalance risk
        const commitsByAuthor = {};
        commits.forEach(c => {
            commitsByAuthor[c.author] = (commitsByAuthor[c.author] || 0) + 1;
        });

        const commitCounts = Object.values(commitsByAuthor);
        if (commitCounts.length > 1) {
            const max = Math.max(...commitCounts);
            const min = Math.min(...commitCounts);
            if (max / min > 5) {
                risks.push({
                    type: 'workload',
                    severity: 'medium',
                    message: 'Significant workload imbalance detected. Consider redistributing tasks.'
                });
            }
        }

        return risks;
    }
}

export default AnalyticsEngine;
