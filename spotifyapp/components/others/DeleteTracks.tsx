import { useState } from "react";
import styles from "./deleteTracks.module.scss";
import axios from "axios";
import Popup from "./Popup";
interface DeleteTracks {
    playlistId: string;
    onTracksDeleted: () => void;
}

const accessToken = localStorage.getItem("access_token");

const deleteTracksFromPlaylist = async (
    accessToken: string,
    playlistId: string,
    tracks: string
) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    const data = {
        tracks,
    };

    const response = await axios.delete(url, { headers, data });+
    sessionStorage.removeItem("selectedTracks");
    return response.status;
};

export default function DeleteTracks({ playlistId, onTracksDeleted }: DeleteTracks) {
    const [status, setStatus] = useState<string>("");
    const [popup, setPopup] = useState<number>(0)
    const handleDeleteTracks = async () => {
        if (accessToken) {
            const sessionTracks = sessionStorage.getItem("selectedTracks");

            if (sessionTracks) {
                const { tracks } = JSON.parse(sessionTracks);
                console.log(tracks);
                const responseStatus = await deleteTracksFromPlaylist(
                    accessToken,
                    playlistId,
                    tracks
                );
                if (responseStatus === 200) {
                    setStatus("Tracks deleted successfully");
                    setPopup(1)
					setTimeout(() => setPopup(0), 3000)
                    onTracksDeleted();
                } else {
                    setStatus("Failed to delete tracks");
                }
                console.log(tracks);
            } else {
                setStatus("No tracks found in session storage");
            }
        }
    };

    return (
        <>
        <Popup currPopup={popup} popupText={"Tracks have been sucessfully deleted"}/>
        <div className={styles.box} onClick={handleDeleteTracks}>
            <p className={styles.text}>
                delete selected tracks from playlist {status}
            </p>
        </div>
        </>
    );
}
