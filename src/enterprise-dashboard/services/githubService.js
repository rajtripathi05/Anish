/**
 * GitHub Service - Read-Only API Integration
 * Fetches existing workflow data from GitHub Issues and repository activity
 * NEVER triggers or creates new workflows
 */

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class GitHubService {
    constructor(config = {}) {
        this.owner = config.owner || 'ANISHTWAGLE';
        this.repo = config.repo || 'Anish';
        this.token = config.token || null; // Optional: for higher rate limits
        this.cache = new Map();
    }

    /**
     * Generic fetch with caching and rate limit handling
     */
    async fetchWithCache(url, cacheKey) {
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
        };

        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }

        try {
            const response = await fetch(url, { headers });

            if (!response.ok) {
                if (response.status === 403) {
                    console.warn('GitHub API rate limit exceeded. Using cached data if available.');
                    return cached?.data || null;
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('GitHub API fetch error:', error);
            return cached?.data || null;
        }
    }

    /**
     * Fetch workflow status issues (daily-repo-status reports)
     * Filters by labels: 'report', 'daily-status', or title prefix '[repo-status]'
     */
    async fetchWorkflowIssues(options = {}) {
        const {
            labels = 'report,daily-status',
            state = 'all',
            per_page = 100,
            page = 1
        } = options;

        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/issues?labels=${labels}&state=${state}&per_page=${per_page}&page=${page}`;
        const cacheKey = `issues_${labels}_${state}_${page}`;

        const issues = await this.fetchWithCache(url, cacheKey);

        if (!issues) return [];

        // Filter for workflow-generated issues (by title pattern)
        return issues.filter(issue =>
            issue.title.includes('[repo-status]') ||
            issue.title.includes('Daily Repository Snapshot') ||
            issue.title.includes('Daily Repo Status')
        );
    }

    /**
     * Fetch a specific issue by number
     */
    async fetchIssue(issueNumber) {
        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/issues/${issueNumber}`;
        const cacheKey = `issue_${issueNumber}`;
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Fetch recent commits
     */
    async fetchCommits(options = {}) {
        const {
            since = null,
            until = null,
            per_page = 100,
            page = 1
        } = options;

        let url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/commits?per_page=${per_page}&page=${page}`;

        if (since) url += `&since=${since}`;
        if (until) url += `&until=${until}`;

        const cacheKey = `commits_${since}_${until}_${page}`;
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Fetch pull requests
     */
    async fetchPullRequests(options = {}) {
        const {
            state = 'all',
            per_page = 100,
            page = 1
        } = options;

        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/pulls?state=${state}&per_page=${per_page}&page=${page}`;
        const cacheKey = `prs_${state}_${page}`;
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Fetch releases
     */
    async fetchReleases(options = {}) {
        const {
            per_page = 30,
            page = 1
        } = options;

        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/releases?per_page=${per_page}&page=${page}`;
        const cacheKey = `releases_${page}`;
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Fetch repository statistics
     */
    async fetchRepoStats() {
        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}`;
        const cacheKey = 'repo_stats';
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Fetch contributors
     */
    async fetchContributors(options = {}) {
        const {
            per_page = 100,
            page = 1
        } = options;

        const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contributors?per_page=${per_page}&page=${page}`;
        const cacheKey = `contributors_${page}`;
        return await this.fetchWithCache(url, cacheKey);
    }

    /**
     * Clear cache (useful for manual refresh)
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Set GitHub token for authenticated requests (higher rate limits)
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Set repository configuration
     */
    setRepository(owner, repo) {
        this.owner = owner;
        this.repo = repo;
        this.clearCache(); // Clear cache when switching repos
    }
}

export default GitHubService;
