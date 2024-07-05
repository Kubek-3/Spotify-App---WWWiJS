// PlaylistsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '@/utils/refreshToken';

interface Playlist {
    tracks: any;
    id: string;
    name: string;
    images: { url: string }[];
    owner: { external_urls: { spotify: string } };
}

interface PlaylistsContextType {
    playlists: Playlist[];
    fetchPlaylists: () => Promise<void>;
}

const PlaylistsContext = createContext<PlaylistsContextType | undefined>(
    undefined
);

export const usePlaylists = () => {
    const context = useContext(PlaylistsContext);
    if (context === undefined) {
        throw new Error('usePlaylists must be used within a PlaylistsProvider');
    }
    return context;
};

export const PlaylistsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const createPlaylistList = async (userId: string) => {
        const response = await axios.get(
            `https://api.spotify.com/v1/me/playlists`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                    )}`,
                },
            }
        );

        const playlists_arr = response.data.items;
        const user_playlists = [];

        for (const playlist of playlists_arr) {
            if (playlist.owner.id === userId) {
                user_playlists.push(playlist);
            }
        }
        return user_playlists;
    };

    const fetchPlaylists = async () => {
        try {
            const user_response = await axios.get(
                'https://api.spotify.com/v1/me',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'access_token'
                        )}`,
                    },
                }
            );

            const userId = user_response.data.id;
            const user_playlists = await createPlaylistList(userId);
            setPlaylists(user_playlists);
        } catch (err: any) {
            if (err.response.status == 401) {
                const user_id = localStorage.getItem('user_id');
                if (user_id) {
                    await refreshToken(user_id);
                    const user_response = await axios.get(
                        'https://api.spotify.com/v1/me',
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    'access_token'
                                )}`,
                            },
                        }
                    );

                    const userId = user_response.data.id;
                    const user_playlists = await createPlaylistList(userId);
                    setPlaylists(user_playlists);
                }
            }
        }
        console.log(playlists);
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    return (
        <PlaylistsContext.Provider value={{ playlists, fetchPlaylists }}>
            {children}
        </PlaylistsContext.Provider>
    );
};
