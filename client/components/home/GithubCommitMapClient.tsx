"use client";

import { useMemo, useState } from "react";
import {
    ChevronDown,
    ExternalLink,
    GitBranch,
    GitCommitHorizontal,
    Activity,
} from "lucide-react";
import type {
    ContributionCalendar,
    ContributionWeek,
} from "@/components/home/GithubCommitMap";

type GithubCommitMapClientProps = {
    calendars: ContributionCalendar[];
    username: string;
};

/* ─── cell colour — uses theme tokens ─────────────────────────────────────── */
function getCellClass(count: number) {
    if (count === 0)
        return "bg-[var(--border)] border-[var(--border)] opacity-50";
    if (count <= 2)
        return "bg-[color-mix(in_oklch,var(--accent)_25%,transparent)] border-[color-mix(in_oklch,var(--accent)_35%,transparent)]";
    if (count <= 5)
        return "bg-[color-mix(in_oklch,var(--accent)_50%,transparent)] border-[color-mix(in_oklch,var(--accent)_60%,transparent)]";
    if (count <= 9)
        return "bg-[color-mix(in_oklch,var(--accent)_75%,transparent)] border-[color-mix(in_oklch,var(--accent)_85%,transparent)]";
    return "bg-[var(--accent)] border-[var(--accent)]";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}

function getMonthLabels(weeks: ContributionWeek[]) {
    const labels: { label: string; index: number }[] = [];
    let lastMonth = "";
    weeks.forEach((week, index) => {
        const label = new Intl.DateTimeFormat("en", { month: "short" }).format(
            new Date(`${week.firstDay}T00:00:00`),
        );
        if (label !== lastMonth) {
            labels.push({ label, index });
            lastMonth = label;
        }
    });
    return labels;
}

/* ─── stat card ────────────────────────────────────────────────────────────── */
function StatCard({
    value,
    label,
}: {
    value: string | number;
    label: string;
}) {
    return (
        <div
            className="
                group relative overflow-hidden rounded-[var(--radius)]
                border border-[var(--border)] bg-[var(--card)]
                p-5 transition-all duration-300
                hover:border-[var(--accent)] hover:shadow-[0_0_20px_color-mix(in_oklch,var(--accent)_18%,transparent)]
            "
        >
            {/* accent dot */}
            <span
                className="
                    absolute right-4 top-4 h-2 w-2 rounded-full
                    bg-[var(--accent)] opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                "
            />
            <div className="text-3xl font-black text-[var(--foreground)]">
                {value}
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                {label}
            </div>
        </div>
    );
}

/* ─── main component ───────────────────────────────────────────────────────── */
export default function GithubCommitMapClient({
    calendars,
    username,
}: GithubCommitMapClientProps) {
    const [selectedYear, setSelectedYear] = useState(
        calendars[0]?.year.toString() ?? "",
    );

    const selectedCalendar = useMemo(
        () =>
            calendars.find(
                (calendar) => calendar.year.toString() === selectedYear,
            ) ?? calendars[0],
        [calendars, selectedYear],
    );

    const totalContributions = calendars.reduce(
        (sum, c) => sum + c.totalContributions,
        0,
    );
    const bestYear = calendars.reduce<ContributionCalendar | null>(
        (best, c) =>
            !best || c.totalContributions > best.totalContributions ? c : best,
        null,
    );
    const latestYear = calendars[0]?.year;

    return (
        <section
            className="
                relative z-10 w-full overflow-hidden
                bg-[var(--background)] px-6 py-24 md:px-14 md:py-32
            "
        >
            {/* ── decorative layer ── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {/* top rule */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40" />
                {/* bottom rule */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />
                {/* subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.032]"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                    }}
                />
                {/* radial glow — accent */}
                <div
                    className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[680px] rounded-full opacity-[0.07] blur-3xl"
                    style={{ background: "var(--accent)" }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl">

                {/* ── header row ──────────────────────────────────────────── */}
                <div className="mb-14 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
                    {/* left: title block */}
                    <div>
                      

                        <h2
                            className="
                                max-w-2xl text-5xl font-black uppercase
                                leading-[0.92] tracking-tight
                                text-[var(--foreground)]
                                md:text-7xl
                            "
                        >
                            My commit
                            <br />
                            <span className="text-[var(--accent)]">heatmap.</span>
                        </h2>

                        <p className="mt-6 max-w-md text-lg leading-snug text-[var(--muted-foreground)]">
                            A GitHub-style contribution calendar rebuilt with the
                            site's design language — cream or deep black, always
                            ocean-blue.
                        </p>

                        <a
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="
                                mt-8 inline-flex items-center gap-3 rounded-full
                                border border-[var(--accent)] bg-[var(--accent)]
                                px-6 py-3 text-sm font-black uppercase
                                tracking-[0.18em] text-white
                                transition-all duration-200
                                hover:bg-transparent hover:text-[var(--accent)]
                                active:scale-95
                            "
                        >
                            @{username}
                            <ExternalLink size={15} />
                        </a>
                    </div>

                    {/* right: stat cards */}
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard value={totalContributions.toLocaleString()} label="total" />
                        <StatCard value={calendars.length} label="years" />
                        <StatCard value={bestYear?.year ?? "—"} label="best year" />
                    </div>
                </div>

                {/* ── calendar card ────────────────────────────────────────── */}
                <div
                    className="
                        rounded-[var(--radius-xl)]
                        border border-[var(--border)]
                        bg-[var(--card)]
                        p-5 shadow-lg md:p-8
                        transition-shadow duration-300
                        hover:shadow-[0_8px_48px_color-mix(in_oklch,var(--accent)_10%,transparent)]
                    "
                >
                    {/* card header */}
                    <div
                        className="
                            mb-6 flex flex-col gap-4 border-b border-[var(--border)]
                            pb-5 md:flex-row md:items-end md:justify-between
                        "
                    >
                        <div>
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                                <GitCommitHorizontal size={17} />
                                Contribution calendar
                            </div>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                {calendars.length > 0
                                    ? "Pick a year to inspect the heatmap."
                                    : "Add GITHUB_TOKEN in .env.local to enable the full heatmap."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            {/* year picker */}
                            {calendars.length > 0 && (
                                <label className="relative block">
                                    <span className="sr-only">Filter contribution year</span>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="
                                            h-10 min-w-36 appearance-none
                                            rounded-[var(--radius)]
                                            border border-[var(--border)]
                                            bg-[var(--background)]
                                            px-4 pr-10
                                            text-sm font-black uppercase tracking-[0.14em]
                                            text-[var(--foreground)]
                                            outline-none transition-colors
                                            hover:border-[var(--accent)]
                                            focus:border-[var(--accent)]
                                            focus:ring-1 focus:ring-[var(--accent)]
                                        "
                                    >
                                        {calendars.map((c) => (
                                            <option key={c.year} value={c.year}>
                                                {c.year}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={15}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                                    />
                                </label>
                            )}

                            {/* legend */}
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                                <span>Less</span>
                                {[0, 1, 3, 6, 10].map((count) => (
                                    <span
                                        key={count}
                                        className={`h-3 w-3 rounded-[3px] border ${getCellClass(count)}`}
                                        aria-hidden="true"
                                    />
                                ))}
                                <span>More</span>
                            </div>
                        </div>
                    </div>

                    {/* no data state */}
                    {!selectedCalendar ? (
                        <div
                            className="
                                rounded-[var(--radius)] border border-dashed
                                border-[var(--border)] p-8
                                text-[var(--muted-foreground)]
                            "
                        >
                            <Activity
                                size={32}
                                className="mb-3 text-[var(--accent)] opacity-50"
                            />
                            GitHub contribution data unavailable. Add{" "}
                            <span className="font-bold text-[var(--accent)]">
                                GITHUB_TOKEN
                            </span>{" "}
                            to <span className="text-[var(--foreground)]">.env.local</span>,
                            then restart the dev server.
                        </div>
                    ) : (
                        <div>
                            {/* year + count */}
                            <div className="mb-5 flex items-end gap-4">
                                <h3 className="text-4xl font-black leading-none text-[var(--foreground)]">
                                    {selectedCalendar.year}
                                </h3>
                                <p className="mb-1 text-sm text-[var(--muted-foreground)]">
                                    <span className="font-bold text-[var(--accent)]">
                                        {selectedCalendar.totalContributions.toLocaleString()}
                                    </span>{" "}
                                    contributions
                                    {latestYear === selectedCalendar.year ? " so far" : ""}
                                </p>
                            </div>

                            {/* heatmap grid */}
                            <div className="overflow-x-auto pb-2">
                                <div className="grid min-w-[860px] grid-cols-[34px_1fr] gap-3">
                                    {/* weekday labels */}
                                    <div className="grid grid-rows-7 gap-[6px] pt-7 text-right text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                                        {["Sun", "", "Tue", "", "Thu", "", "Sat"].map(
                                            (day, i) => (
                                                <span key={i}>{day}</span>
                                            ),
                                        )}
                                    </div>

                                    <div>
                                        {/* month labels */}
                                        <div className="relative mb-3 h-4 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                                            {getMonthLabels(selectedCalendar.weeks).map((item) => (
                                                <span
                                                    key={`${selectedCalendar.year}-${item.label}-${item.index}`}
                                                    className="absolute top-0"
                                                    style={{ left: `${item.index * 20}px` }}
                                                >
                                                    {item.label}
                                                </span>
                                            ))}
                                        </div>

                                        {/* cells */}
                                        <div className="flex gap-[6px]">
                                            {selectedCalendar.weeks.map((week) => (
                                                <div
                                                    key={week.firstDay}
                                                    className="grid grid-rows-7 gap-[6px]"
                                                >
                                                    {Array.from({ length: 7 }).map((_, weekday) => {
                                                        const day = week.contributionDays.find(
                                                            (d) => d.weekday === weekday,
                                                        );

                                                        if (!day)
                                                            return (
                                                                <span
                                                                    key={`${week.firstDay}-${weekday}`}
                                                                    className="h-3 w-3"
                                                                />
                                                            );

                                                        return (
                                                            <span
                                                                key={day.date}
                                                                className={`
                                                                    h-3 w-3 rounded-[3px] border
                                                                    cursor-default
                                                                    transition-transform duration-150
                                                                    hover:scale-[1.4]
                                                                    hover:shadow-[0_0_6px_color-mix(in_oklch,var(--accent)_55%,transparent)]
                                                                    ${getCellClass(day.contributionCount)}
                                                                `}
                                                                title={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                                                                aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}