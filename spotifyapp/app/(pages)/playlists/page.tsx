// UserPlaylists.tsx
'use client';
import { useEffect, useContext } from 'react';
import Title from '@/components/others/Title';
import Wrapper from '@/components/others/Wrapper';
import Box from '@/components/others/Box';
import { useRouter } from 'next/navigation';
import PlayListCard from '@/components/pagesComponents/PlayListCard';
import {
    usePlaylists,
    PlaylistsProvider,
} from '../../contexts/PlaylistContext';

const UserPlaylists = () => {
    const { playlists, fetchPlaylists } = usePlaylists();
    const router = useRouter();

    useEffect(() => {
        const sessionStorageKey = 'selectedTracks';
        const sessionSavedStorageKey = 'selectedSavedTracks';
        sessionStorage.removeItem(sessionStorageKey);
        sessionStorage.removeItem(sessionSavedStorageKey);
        console.log('Tracks array cleared from sessionStorage on page load');
    }, []);

    const handlePlaylistClick = (id: any) => {
        console.log('playlist clicked ' + id);
        router.push(`/playlists/${id}?page=1`);
    };
    console.log(playlists)
    return (
        <Wrapper>
            <Box>
                <Title>Playlists</Title>
                {playlists.map((playlist: any, index: number) => (
                    <PlayListCard
                        key={index}
                        id={playlist.id}
                        name={playlist.name}
                        imgLink={
                            playlist.images?.length > 0
                                ? playlist.images[0].url
                                : 'https://f4.bcbits.com/img/a4139357031_10.jpg'
                        }
                        playListLink={playlist.owner.external_urls.spotify}
                        onPressed={handlePlaylistClick}
                    />
                ))}
            </Box>
        </Wrapper>
    );
};

export default function UserPlaylistsPage() {
    return (
        <PlaylistsProvider>
            <UserPlaylists />
        </PlaylistsProvider>
    );
}
