"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Wrapper from "@/components/others/Wrapper";
import TrackCard from "@/components/pagesComponents/TrackCard";
import Title from "@/components/others/Title";
import styles from "./active.module.scss";
import { refreshToken } from "@/utils/refreshToken";
const CurrentlyListeningActivity = () => {
    const [state, setState] = useState<any>(null);
    const [item, setItem] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const sessionStorageKey = "selectedTracks";
        sessionStorage.removeItem(sessionStorageKey);
        console.log("Tracks array cleared from sessionStorage on page load");
    }, []);

    useEffect(() => {
        // refresh token hook?
        const GetCurrentlyListeningActivity = async () => {
            try {
                const response = await axios.get(
                    "https://api.spotify.com/v1/me/player/currently-playing",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "access_token"
                            )}`,
                        },
                    }
                );
                setState(response.data);
                setItem(response.data.item);
                console.log(response.data);
            } catch (err: any) {
                if (err.response.status == 401) {
                    const user_id = localStorage.getItem("user_id");
                    if (user_id) {
                        await refreshToken(user_id);
                        const response2 = await axios.get(
                            "https://api.spotify.com/v1/me/player/currently-playing",
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem(
                                        "access_token"
                                    )}`,
                                },
                            }
                        );
                        setState(response2.data);
                        console.log(response2.data);
                    }
                }
            }
            setLoading(false);
        };

        GetCurrentlyListeningActivity();
    }, []);
    console.log(item);
    if (!loading) {
        return (
            <Wrapper>
                <div className={styles.box}>
                    <Title>Currently Playing</Title>
                    {state && item ? (
                        <div className={styles.box__tracks}>
                            {!item.is_local && (
                                <TrackCard
                                    key={item.id}
                                    name={item.name}
                                    artists={item.artists.map(
                                        (artist: any) => artist.name
                                    )}
                                    artistLink={item.artists.map(
                                        (artist: any) =>
                                            artist.external_urls.spotify
                                    )}
                                    artistId={item.artists.map(
                                        (artist: any) => artist.id
                                    )}
                                    imgLink={item.album.images[0].url}
                                    trackLink={item.external_urls.spotify}
                                    styleNumber={2}
                                    is_local={item.is_local}
                                />
                            )}
                            {item.is_local && (
                                <TrackCard
                                    key={item.id}
                                    name={item.name}
                                    artists={[
                                        {
                                            name: "Unknown Artist",
                                        },
                                    ]}
                                    artistLink={[
                                        {
                                            href: "https://open.spotify.com",
                                        },
                                    ]}
                                    artistId={["121308917317389"]}
                                    imgLink={
                                        "https://f4.bcbits.com/img/a4139357031_10.jpg"
                                    }
                                    trackLink={"https://open.spotify.com"}
                                    styleNumber={2}
                                    is_local={item.is_local}
                                />
                            )}
                        </div>
                    ) : (
                        <div className={styles.box__noTracks}>
                            <p className={styles.box__noTracksText}>
                                Nothing here...
                            </p>
                        </div>
                    )}
                </div>
            </Wrapper>
        );
    } else {
        <div className={styles.box}>
            <Title>Currently Playing</Title>
            <div className={styles.box__noTracks}>
                <p className={styles.box__noTracksText}>Nothing here...</p>
            </div>
        </div>;
    }
};

export default CurrentlyListeningActivity;
