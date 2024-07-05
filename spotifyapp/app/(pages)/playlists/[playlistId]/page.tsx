'use client';
import axios from 'axios';
import Wrapper from '@/components/others/Wrapper';
import Box from '@/components/others/Box';
import Title from '@/components/others/Title';
import Popup from '@/components/others/Popup';
import styles from './playlistsTracks.module.scss';
import PaginationControls from '@/components/pagination/PaginationControls';
import PlayListTrackCard from '@/components/pagesComponents/playListTracks/PlayListTrackCard';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import DeleteTracks from '@/components/pagesComponents/playListTracks/DeleteTracks';
import Loading from '@/components/loading/Loading';
import { refreshToken } from '@/utils/refreshToken';
import { randomInt } from 'crypto';
import generateRandomString from '@/utils/generateRandomString';

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
            `https://api.spotify.com/v1/playlists/${playlist_id}?fields=description,href,id,name,images,snapshot_id,uri`,
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
        const offset = ((parseInt(page) - 1) * Number(perPage)).toString();
        const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?offset=${offset}&limit=${perPage}&locale=pl-PL`,
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
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await getPlaylist();
                await getTracks(String(page));
            } catch (err: any) {
                if (err.response.status == 401) {
                    const user_id = localStorage.getItem('user_id');
                    if (user_id) {
                        await refreshToken(user_id);
                        let page = searchParams['page'];
                        if (!page) {
                            page = '1';
                        }
                        await getPlaylist();
                        await getTracks(String(page));
                    }
                }
            }
        };
        fetchData();
        console.log(tracksInfo);
    }, [searchParams]);

    const popup = useRef<any>(0);
    const page = searchParams['page'];
    const perPage = searchParams['perPage'] ?? '100';
    const start = (Number(page) - 1) * Number(perPage); //offset
    const end = start + Number(perPage);
    const totalPages = Math.ceil(tracksInfo.total / Number(perPage));

    return (
        <Wrapper>
            <Box>
                <Title>{playlistInfo.name}</Title>
                {!isLoading ? (
                    <div className={styles.column}>
                        <DeleteTracks
                            playlistId={playlist_id}
                            onTracksDeleted={refreshTracks}
                        />
                        {tracksInfo.items.map((track: any, index: number) => {
                            return !track.is_local && track.track ? (
                                <PlayListTrackCard
                                    key={index}
                                    id={track.track.id}
                                    snapshot_id={playlistInfo.snapshot_id}
                                    name={track.track.name}
                                    playlistId={playlist_id}
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
                                        key={track.track.id}
                                        id={track.track.name}
                                        snapshot_id={track.snapshot_id}
                                        name={track.track.name}
                                        playlistId='1'
                                        trackUri='1'
                                        artists={['G O A T']}
                                        artistLink={[
                                            'https://store-images.s-microsoft.com/image/apps.46116.70628353720390187.c5ec2284-1a6e-4ed0-a094-b54b14b8d466.f01d3b8d-41e1-42bc-b322-443ee5b1f390?q=90&w=480&h=270',
                                        ]}
                                        artistId={track.track.name}
                                        imgLink={
                                            'https://media.tenor.com/Wg9fW_XEft0AAAAM/pout-christian-bale.gif'
                                        }
                                        trackLink={'https://random.dog'}
                                    />
                                )
                            );
                        })}
                        <PaginationControls
                            playlistId={params.playlistId}
                            page={page}
                            perPage={perPage}
                            hasNextPage={end < tracksInfo.total}
                            hasPrevPage={start > 0}
                            totalPages={totalPages}
                        ></PaginationControls>
                    </div>
                ) : (
                    // <div
                    //     style={{
                    //         height: "50vh",
                    //         display: "flex",
                    //         justifyContent: "center",
                    //         alignItems: "center",
                    //     }}
                    // >
                    //     {
                    //         <p style={{ fontSize: "3rem", color: "white" }}>
                    //             Loading...
                    //         </p>
                    //     }
                    // </div>
                    <Loading />
                )}
            </Box>
        </Wrapper>
    );
}
