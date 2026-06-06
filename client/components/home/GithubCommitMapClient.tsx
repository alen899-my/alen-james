"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
    ContributionCalendar,
    ContributionWeek,
} from "@/components/home/GithubCommitMap";

type GithubCommitMapClientProps = {
    calendars: ContributionCalendar[];
    username: string;
};

function getCellClass(count: number) {
    if (count === 0)
        return "bg-[var(--border)] border-[var(--border)] opacity-40";
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

export default function GithubCommitMapClient({
    calendars,
    username,
}: GithubCommitMapClientProps) {
    const [selectedYear, setSelectedYear] = useState(
        calendars[0]?.year.toString() ?? "",
    );

    const selectedCalendar = useMemo(
        () =>
            calendars.find((c) => c.year.toString() === selectedYear) ??
            calendars[0],
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
            {/* ── subtle grid overlay ── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.028]"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

           

            <div className="relative mx-auto max-w-6xl">

                {/* ── header ────────────────────────────────────────────── */}
                <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                    {/* title */}
                    <div>
                        
                        <h2
                            className="text-6xl md:text-8xl font-black uppercase tracking-tighter"
                            style={{ fontFamily: "'Patrick Hand SC', cursive", color: 'var(--foreground)' }}
                        >
                            My{" "}
                            <span className="text-[var(--accent)]">Commits.</span>
                        </h2>
                    </div>

                    {/* stats */}
                    <div className="flex gap-8">
                        {[
                            { value: totalContributions.toLocaleString(), label: "Total" },
                            { value: calendars.length, label: "Years" },
                            { value: bestYear?.year ?? "—", label: "Best year" },
                        ].map(({ value, label }) => (
                            <div key={label} className="text-right">
                                <div
                                    className="text-2xl font-black leading-none text-[var(--foreground)]"
                                    style={{ fontFamily: "'Patrick Hand SC', cursive" }}
                                >
                                    {value}
                                </div>
                                <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── thin accent divider ────────────────────────────────── */}
                <div
                    className="mb-10 h-px w-full opacity-20"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, var(--accent), transparent)",
                    }}
                />

                {/* ── heatmap area ───────────────────────────────────────── */}
                <div>
                    {/* year row */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-baseline gap-3">
                            <span
                                className="text-2xl font-black leading-none text-[var(--foreground)]"
                                style={{ fontFamily: "'Patrick Hand SC', cursive" }}
                            >
                                {selectedCalendar?.year}
                            </span>
                            {selectedCalendar && (
                                <span className="text-xs tracking-wide text-[var(--muted-foreground)]">
                                    <span className="font-bold text-[var(--accent)]">
                                        {selectedCalendar.totalContributions.toLocaleString()}
                                    </span>{" "}
                                    contributions
                                    {latestYear === selectedCalendar.year ? " so far" : ""}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* year select */}
                            {calendars.length > 0 && (
                                <label className="relative block">
                                    <span className="sr-only">Filter contribution year</span>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="
                                            h-9 min-w-32 appearance-none
                                            rounded border border-[var(--border)]
                                            bg-transparent
                                            px-3 pr-8
                                            font-mono text-[10px] font-bold uppercase
                                            tracking-[0.14em] text-[var(--foreground)]
                                            outline-none transition-colors
                                            hover:border-[var(--accent)]
                                            focus:border-[var(--accent)]
                                        "
                                    >
                                        {calendars.map((c) => (
                                            <option key={c.year} value={c.year}>
                                                {c.year}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={12}
                                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                                    />
                                </label>
                            )}

                            {/* legend */}
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                                <span>Less</span>
                                {[0, 1, 3, 6, 10].map((count) => (
                                    <span
                                        key={count}
                                        className={`block h-2.5 w-2.5 rounded-[2px] border ${getCellClass(count)}`}
                                        aria-hidden="true"
                                    />
                                ))}
                                <span>More</span>
                            </div>
                        </div>
                    </div>

                    {/* grid */}
                    {selectedCalendar && (
                        <div className="overflow-x-auto pb-2">
                            <div className="grid min-w-[800px] grid-cols-[28px_1fr] gap-2">

                                {/* weekday labels */}
                                <div className="grid grid-rows-7 gap-[6px] pt-6 text-right font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                    {["Sun", "", "Tue", "", "Thu", "", "Sat"].map(
                                        (day, i) => <span key={i}>{day}</span>,
                                    )}
                                </div>

                                <div>
                                    {/* month labels */}
                                    <div className="relative mb-1 h-5 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                                        {getMonthLabels(selectedCalendar.weeks).map((item) => (
                                            <span
                                                key={`${selectedCalendar.year}-${item.label}-${item.index}`}
                                                className="absolute top-0"
                                                style={{ left: `${item.index * 22}px` }}
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
                                                                className="h-4 w-4"
                                                            />
                                                        );
                                                    return (
                                                        <span
                                                            key={day.date}
                                                            className={`
                                                                h-4 w-4 rounded-[3px] border
                                                                cursor-default
                                                                transition-transform duration-100
                                                                hover:scale-[1.3]
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
                    )}
                </div>

            </div>
        </section>
    );
}