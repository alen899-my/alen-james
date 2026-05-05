import MoreClient from './MoreClient';

export default async function MorePage() {
    return (
        <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
            <section className="flex-1 pt-32 pb-20 px-6 md:px-14 max-w-7xl mx-auto w-full">
                <div className="mb-16">
                    <h1 
                        className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
                        style={{ fontFamily: '"Patrick Hand SC", cursive', color: 'var(--foreground)' }}
                    >
                        More <span style={{ color: 'var(--accent)' }}>to Explore</span>
                    </h1>
                    <p 
                        className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl leading-tight"
                        style={{ color: 'var(--foreground)', fontFamily: '"Patrick Hand SC", cursive' }}
                    >
                        You have more things to see other than my works.
                    </p>
                </div>

                <MoreClient />
            </section>
        </main>
    );
}
