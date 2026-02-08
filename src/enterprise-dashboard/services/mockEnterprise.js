/**
 * Enhanced Enterprise Mock Data
 * Simulates an organization with 50 teams and ~1000 employees
 */

const TEAMS_COUNT = 50;
const MEMBERS_PER_TEAM = 20;

const TEAM_NAMES = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
    'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
    'Phi', 'Chi', 'Psi', 'Omega', 'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Eagle', 'Shark',
    'Panther', 'Wolf', 'Bear', 'Falcon', 'Hawk', 'Raven', 'Viper', 'Cobra', 'Python', 'Hydra',
    'Titan', 'Atlas', 'Prometheus', 'Helios', 'Selene', 'Gaia', 'Cronus', 'Rhea', 'Oceanus', 'Tethys'
];

export const generateEnterpriseData = () => {
    const teams = Array.from({ length: TEAMS_COUNT }).map((_, t) => {
        const teamName = TEAM_NAMES[t] || `Team ${String.fromCharCode(65 + (t % 26))}-${t}`;

        // Generate members for this team
        const members = Array.from({ length: MEMBERS_PER_TEAM }).map((_, i) => {
            const utilization = Math.floor(40 + Math.random() * 60); // 40-100%
            const prLoad = Math.floor(Math.random() * 15); // 0-15 PRs
            const burnoutRisk = utilization > 85 || prLoad > 10 ? (Math.random() > 0.5 ? 'High' : 'Medium') : 'Low';
            const costContribution = Math.floor(8000 + Math.random() * 5000); // Monthly cost

            return {
                id: `EMP-${t}-${i}`,
                name: `Engineer-${t * 20 + i}`,
                role: i === 0 ? 'Tech Lead' : i < 3 ? 'Senior Engineer' : 'Engineer',
                utilization,
                prLoad,
                burnout: burnoutRisk,
                costContribution,
                avatar: `https://ui-avatars.com/api/?name=Engineer+${t * 20 + i}&background=random`
            };
        });

        // Calculate team aggregates
        const avgUtilization = Math.floor(members.reduce((sum, m) => sum + m.utilization, 0) / members.length);
        const totalRisk = members.filter(m => m.burnout === 'High').length;
        const deliveryHealth = Math.floor(100 - (totalRisk * 5) - (Math.random() * 10));

        return {
            id: `TEAM-${t}`,
            name: teamName,
            lead: members[0].name,
            members,
            memberCount: members.length,
            utilization: avgUtilization,
            deliveryHealth,
            riskLevel: deliveryHealth < 60 ? 'Critical' : deliveryHealth < 80 ? 'At Risk' : 'Healthy',
            costImpact: Math.floor(Math.random() * 500000), // Cost of delay
            activeProjects: Math.floor(2 + Math.random() * 5)
        };
    });

    return { teams };
};

// Export pre-generated data
export const { teams } = generateEnterpriseData();
export const employees = teams.flatMap(t => t.members.map(m => ({ ...m, team: t.name })));
