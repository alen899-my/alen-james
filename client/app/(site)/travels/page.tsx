import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = {
    title: 'Travel Log | Alen James',
    description: 'Stories and snapshots from my adventures around the world.',
};

export default function TravelsPage() {
    return (
        <ComingSoon
            title="Travels"
            description="Adventures, detours, and destinations — every journey I've taken told through photos, words, and raw experiences."
            iconName="mappin"
        />
    );
}
