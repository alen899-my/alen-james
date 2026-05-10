import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = {
    title: 'People I Met | Alen James',
    description: 'Stories of the amazing individuals I\'ve met along the way.',
};

export default function PeoplePage() {
    return (
        <ComingSoon
            title="People"
            description="Stories of the incredible humans I've crossed paths with — mentors, friends, collaborators, and strangers who left a mark."
            iconName="users"
        />
    );
}
