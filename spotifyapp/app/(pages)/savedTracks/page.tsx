'use client';
import axios from 'axios';
import Wrapper from '@/components/others/Wrapper';
import Box from '@/components/others/Box';
import Title from '@/components/others/Title';
import Loading from '@/components/loading/Loading';
import styles from './savedTracks.module.scss';
import PaginationControls from '@/components/pagination/PaginationControls';
import PlayListTrackCard from '@/components/pagesComponents/playListTracks/PlayListTrackCard';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import DeleteTracks from '@/components/pagesComponents/playListTracks/DeleteTracks';
import Dropdown from '@/components/pagesComponents/Dropdown';

export default function Playlist({
    params,
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
    params: { playlistId: string };
}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tracksInfo, setTracksInfo] = useState<any>([]);
    const [playlistInfo, setPlaylistInfo] = useState<any>({});
    const pathname = usePathname();
    const playlist_id = pathname.split('/')[2];

    const getPlaylist = async () => {
        const response = await axios.get(
            `https://api.spotify.com/v1/me/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                    )}`,
                },
            }
        );
        setPlaylistInfo(response.data);
    };

    const getTracks = async (page: string) => {
        const offset = ((parseInt(page) - 1) * 50).toString();
        const response = await axios.get(
            `https://api.spotify.com/v1/me/tracks?market=PL&limit=${perPage}&offset=${offset}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                    )}`,
                },
            }
        );
        setTracksInfo(response.data);
        setIsLoading(false);
    };

    const refreshTracks = () => {
        const page = searchParams['page'] || '1';
        getTracks(String(page));
    };

    useEffect(() => {
        const sessionStorageKey = 'selectedTracks';
        const sessionSavedStorageKey = 'selectedSavedTracks';
        sessionStorage.removeItem(sessionStorageKey);
        sessionStorage.removeItem(sessionSavedStorageKey);
        console.log('Tracks array cleared from sessionStorage on page load');
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await getPlaylist();
                let page = searchParams['page'];
                if (!page) {
                    page = '1';
                }
                await getTracks(String(page));
            } catch (err: any) {}
        };
        fetchData();
    }, [searchParams]);

    const page = searchParams['page'];
    const perPage = searchParams['perPage'] ?? '50';
    const start = (Number(page) - 1) * Number(perPage); //offset
    const end = start + Number(perPage);
    const totalPages = Math.ceil(tracksInfo.total / Number(perPage));

    return (
        <Wrapper>
            <Box>
                <Title>{'Saved Tracks'}</Title>
                {!isLoading ? (
                    <div className={styles.column}>
                        <DeleteTracks
                            playlistId={null}
                            onTracksDeleted={refreshTracks}
                        />
                        <Dropdown></Dropdown>
                        {tracksInfo.items.map((track: any, index: number) => {
                            return !track.is_local && track.track ? (
                                <PlayListTrackCard
                                    key={index}
                                    id={track.track.id}
                                    snapshot_id={null}
                                    name={track.track.name}
                                    playlistId={null}
                                    trackUri={track.track.uri}
                                    artists={track.track.artists.map(
                                        (artist: any) => artist.name
                                    )}
                                    artistLink={track.track.artists.map(
                                        (artist: any) =>
                                            artist.external_urls.spotify
                                    )}
                                    artistId={track.track.artists.map(
                                        (artist: any) => artist.id
                                    )}
                                    imgLink={track.track.album.images[2].url}
                                    trackLink={
                                        track.track.external_urls.spotify
                                    }
                                />
                            ) : (
                                track.track && (
                                    <PlayListTrackCard
                                        id={track.track.name}
                                        snapshot_id={null}
                                        name={track.track.name}
                                        playlistId={null}
                                        trackUri='1'
                                        artists={['G O A T']}
                                        artistLink={[
                                            'https://store-images.s-microsoft.com/image/apps.46116.70628353720390187.c5ec2284-1a6e-4ed0-a094-b54b14b8d466.f01d3b8d-41e1-42bc-b322-443ee5b1f390?q=90&w=480&h=270',
                                        ]}
                                        artistId={track.track.name}
                                        imgLink={
                                            'https://community-lens.storage.googleapis.com/preview-media/thumbnail/0c2cdd7d-21ff-4a6d-b422-9c1e81442afa.jpg'
                                        }
                                        trackLink={
                                            'https://store-images.s-microsoft.com/image/apps.46116.70628353720390187.c5ec2284-1a6e-4ed0-a094-b54b14b8d466.f01d3b8d-41e1-42bc-b322-443ee5b1f390?q=90&w=480&h=270'
                                        }
                                    />
                                )
                            );
                        })}
                        <PaginationControls
                            playlistId={null}
                            page={page}
                            perPage={perPage}
                            hasNextPage={end < tracksInfo.total}
                            hasPrevPage={start > 0}
                            totalPages={totalPages}
                        ></PaginationControls>
                    </div>
                ) : (
                    <Loading />
                )}
            </Box>
        </Wrapper>
    );
}
