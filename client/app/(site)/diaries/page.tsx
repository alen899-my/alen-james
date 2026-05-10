import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = {
    title: 'My Diary | Alen James',
    description: 'Personal reflections and daily musings from my journal.',
};

export default function DiariesPage() {
    return (
        <ComingSoon
            title="Diaries"
            description="A private window into my thoughts, reflections, and the quiet moments that shape who I am — day by day."
            iconName="notebook"
        />
    );
}
