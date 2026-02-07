import React, { useState, useEffect } from 'react';
import ExecutiveSummary from './components/ExecutiveSummary';
import WorkflowReports from './components/WorkflowReports';
import RoleSelector from './components/RoleSelector';
import Sidebar from './components/Sidebar';
import TeamDrilldownModal from './components/TeamDrilldownModal';
import GitHubService from './services/githubService';
import DataTransformer from './services/dataTransformer';
import AnalyticsEngine from './services/analyticsEngine';
import MockDataGenerator from './services/mockDataGenerator';
import { teams as mockTeams } from './services/mockEnterprise';
import './App.css';

/**
 * Enterprise Dashboard Main Application
 * Orchestrates data fetching, transformation, and analytics
 */
function App() {
    const [dashboardData, setDashboardData] = useState(null);
    const [rawIssues, setRawIssues] = useState([]);
    const [activeTab, setActiveTab] = useState('analytics');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [useMockData, setUseMockData] = useState(true); // Toggle for demo
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Initialize GitHub service
    const githubService = new GitHubService({
        owner: 'ANISHTWAGLE',
        repo: 'Anish'
    });

    /**
     * Fetch and process dashboard data
     */
    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            setError(null);

            let workflowIssues, commits, pullRequests, contributors;

            if (useMockData) {
                // Use mock data for development/demo
                const mockData = MockDataGenerator.generateCompleteDataset();
                workflowIssues = mockData.workflowIssues;
                commits = DataTransformer.transformCommits(mockData.commits);
                pullRequests = DataTransformer.transformPullRequests(mockData.pullRequests);
                contributors = mockData.contributors;
            } else {
                // Fetch real data from GitHub
                workflowIssues = await githubService.fetchWorkflowIssues();
                const rawCommits = await githubService.fetchCommits({ per_page: 100 });
                const rawPRs = await githubService.fetchPullRequests({ per_page: 50 });
                contributors = await githubService.fetchContributors();

                commits = DataTransformer.transformCommits(rawCommits);
                pullRequests = DataTransformer.transformPullRequests(rawPRs);
            }

            // Transform workflow data
            const workflowData = DataTransformer.aggregateWorkflowData(workflowIssues);

            // Store raw issues for Reports view
            setRawIssues(workflowIssues);

            // Calculate analytics
            const deliveryHealth = AnalyticsEngine.calculateDeliveryHealth(
                workflowData,
                commits,
                pullRequests
            );

            const productivity = AnalyticsEngine.calculateProductivityMetrics(
                workflowData,
                commits,
                pullRequests
            );

            const costEfficiency = AnalyticsEngine.calculateCostEfficiency(
                workflowData,
                commits,
                pullRequests,
                {
                    avgEngineerCost: 100000,
                    teamSize: contributors.length || 1
                }
            );

            const workforce = AnalyticsEngine.calculateWorkforceUtilization(
                commits,
                contributors
            );

            const risks = AnalyticsEngine.detectRisks(
                workflowData,
                commits,
                pullRequests,
                contributors
            );

            // Prepare dashboard data with enhanced metrics
            const data = {
                deliveryHealth: {
                    ...deliveryHealth,
                    history: workflowData.timeline?.slice(0, 30).map(t => t.metrics.commitsToday || 0) || [],
                    trend: productivity.commitTrend
                },
                productivity: {
                    ...productivity,
                    velocityHistory: workflowData.timeline?.slice(0, 30).map(t => t.metrics.commitsToday || 0) || [],
                    velocityTimeline: workflowData.timeline?.slice(0, 30).map(t => ({
                        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        value: t.metrics.commitsToday || 0,
                        label: t.title
                    })) || []
                },
                costEfficiency: {
                    ...costEfficiency,
                    history: workflowData.timeline?.slice(0, 30).map((_, i) => 50 + Math.random() * 50) || [],
                    trend: 5
                },
                workforce: {
                    ...workforce,
                    history: workflowData.timeline?.slice(0, 30).map((_, i) => 60 + Math.random() * 40) || [],
                    trend: 3
                },
                risks,
                enterpriseTeams: useMockData ? mockTeams : [], // Pass enhanced mock teams
                dateRange: `${workflowData.timeline?.length || 0} days`,
                lastUpdated: new Date().toISOString()
            };

            setDashboardData(data);
            setLoading(false);
            setRefreshing(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchDashboardData();
    }, [useMockData]);

    /**
     * Manual refresh handler
     */
    const handleRefresh = () => {
        githubService.clearCache();
        fetchDashboardData();
    };

    /**
     * Toggle between mock and real data
     */
    const handleToggleDataSource = () => {
        setUseMockData(!useMockData);
    };

    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-spinner"></div>
                <p>Loading Enterprise Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-error">
                <div className="error-icon">⚠️</div>
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={handleRefresh}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="app-main-content">
                {/* Header Controls */}
                <header className="app-header">
                    <div>
                        <h1 className="text-2xl font-bold">Enterprise Intelligence</h1>
                        <p className="text-secondary text-sm">Orchestration & Delivery Analytics</p>
                    </div>
                    <div className="app-controls">
                        <RoleSelector />
                        <div className="control-divider"></div>
                        <button
                            className="btn btn-accent"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            {refreshing ? '🔄' : '🔄 Refresh Data'}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleToggleDataSource}
                        >
                            {useMockData ? '📊 Mock' : '🔗 Live'}
                        </button>
                    </div>
                </header>

                <div className="content-scrollable">
                    {/* Main Content */}
                    {activeTab === 'analytics' || activeTab === 'teams' ? (
                        <ExecutiveSummary
                            data={dashboardData}
                            onSelectTeam={setSelectedTeam}
                            showTeams={activeTab === 'teams'}
                        />
                    ) : (
                        <WorkflowReports issues={rawIssues} />
                    )}
                </div>

                {/* Footer */}
                <footer className="app-footer">
                    <p>
                        Enterprise Intelligence Dashboard •
                        Powered by AI-Driven Analytics •
                        Last Updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
                    </p>
                </footer>
            </main>

            {/* Drilldown Modal */}
            <TeamDrilldownModal
                team={selectedTeam}
                onClose={() => setSelectedTeam(null)}
            />
        </div>
    );
}

export default App;
