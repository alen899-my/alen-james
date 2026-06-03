import GithubCommitMapClient from "@/components/home/GithubCommitMapClient";

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "alen899-my";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

export type ContributionDay = {
    date: string;
    weekday: number;
    contributionCount: number;
};

export type ContributionWeek = {
    firstDay: string;
    contributionDays: ContributionDay[];
};

export type ContributionCalendar = {
    year: number;
    totalContributions: number;
    weeks: ContributionWeek[];
};

type ContributionYearsResponse = {
    data?: {
        user?: {
            contributionsCollection?: {
                contributionYears?: number[];
            };
        };
    };
};

type ContributionCalendarResponse = {
    data?: {
        user?: {
            contributionsCollection?: {
                contributionCalendar?: {
                    totalContributions: number;
                    weeks: ContributionWeek[];
                };
            };
        };
    };
};

async function githubGraphql<T>(query: string, variables: Record<string, unknown>) {
    if (!GITHUB_TOKEN) return null;

    try {
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            next: { revalidate: 60 * 60 * 12 },
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
                "User-Agent": "alen-james-portfolio",
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) return null;

        return (await response.json()) as T;
    } catch {
        return null;
    }
}

async function getContributionYears(username: string) {
    const response = await githubGraphql<ContributionYearsResponse>(
        `
        query ContributionYears($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    contributionYears
                }
            }
        }
        `,
        { login: username },
    );

    return (
        response?.data?.user?.contributionsCollection?.contributionYears ?? []
    ).sort((a, b) => b - a);
}

async function getContributionCalendar(
    username: string,
    year: number,
): Promise<ContributionCalendar | null> {
    const currentYear = new Date().getFullYear();
    const from = new Date(Date.UTC(year, 0, 1)).toISOString();
    const to =
        year === currentYear
            ? new Date().toISOString()
            : new Date(Date.UTC(year + 1, 0, 1)).toISOString();

    const response = await githubGraphql<ContributionCalendarResponse>(
        `
        query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
                contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            firstDay
                            contributionDays {
                                date
                                weekday
                                contributionCount
                            }
                        }
                    }
                }
            }
        }
        `,
        { login: username, from, to },
    );

    const calendar =
        response?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) return null;

    return {
        year,
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks,
    };
}

async function getContributionCalendars(username: string) {
    const years = await getContributionYears(username);
    if (years.length === 0) return [];

    const calendars = await Promise.all(
        years.map((year) => getContributionCalendar(username, year)),
    );

    return calendars.filter(Boolean) as ContributionCalendar[];
}

export default async function GithubCommitMap() {
    const calendars = await getContributionCalendars(GITHUB_USERNAME);
    return (
        <GithubCommitMapClient
            calendars={calendars}
            username={GITHUB_USERNAME}
        />
    );
}
