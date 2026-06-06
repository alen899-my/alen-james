import GithubCommitMapClient from "@/components/home/GithubCommitMapClient";
import { getContributionCalendars } from "@/lib/github";

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "alen899-my";

export default async function GithubCommitMap() {
    const calendars = await getContributionCalendars(GITHUB_USERNAME);
    return (
        <GithubCommitMapClient
            calendars={calendars}
            username={GITHUB_USERNAME}
        />
    );
}
