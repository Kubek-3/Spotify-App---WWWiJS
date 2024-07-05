"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Wrapper from "@/components/others/Wrapper";
import Box from "@/components/others/Box";
import TrackCard from "@/components/pagesComponents/TrackCard";
import Title from "@/components/others/Title";
import styles from "./tracks.module.scss";
import { refreshToken } from "@/utils/refreshToken";

const RecentTracks = () => {
    const [items, setItems] = useState([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const sessionStorageKey = "selectedTracks";
        sessionStorage.removeItem(sessionStorageKey);
        console.log("Tracks array cleared from sessionStorage on page load");
    }, []);

    useEffect(() => {
        const getData = async () => {
            const accessToken = searchParams.get("access_token");
            const userId = searchParams.get("user_id");
            if (accessToken) {
                localStorage.setItem("access_token", accessToken);
            }
            if (userId) {
                localStorage.setItem("user_id", userId);
            }
            try {
                const response = await axios.get(
                    "https://api.spotify.com/v1/me/player/recently-played",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                );
                setItems(response.data.items);
                console.log(response.data.items);
            } catch (err: any) {
                if (err.response.status == 401) {
                    const user_id = localStorage.getItem("user_id");
                    if (user_id) {
                        await refreshToken(user_id);
                        const response2 = await axios.get(
                            "https://api.spotify.com/v1/me/player/recently-played",
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "access_token"
                                    )}`,
                                },
                            }
                        );
                        setItems(response2.data.items);
                        console.log(response2.data);
                    }
                }
            }
        };
        getData();
    }, []);
    return (
        <Wrapper>
            <Box>
                <Title>Recent Tracks</Title>
                <div className={styles.box__tracks}>
                    {items.map((item: any, index) => (
                        <TrackCard
                            key={item.track.id}
                            name={item.track.name}
                            artists={item.track.artists.map(
                                (artist: any) => artist.name
                            )}
                            artistLink={item.track.artists.map(
                                (artist: any) => artist.external_urls.spotify
                            )}
                            artistId={item.track.artists.map(
                                (artist: any) => artist.id
                            )}
                            imgLink={item.track.album.images[2].url}
                            trackLink={item.track.external_urls.spotify}
                            styleNumber={1}
                            is_local={item.is_local}
                        />
                    ))}
                </div>
            </Box>
        </Wrapper>
    );
};

export default RecentTracks;
