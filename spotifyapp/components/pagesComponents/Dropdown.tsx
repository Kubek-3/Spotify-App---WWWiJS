'use client'
import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popup from '../others/Popup'
import { PlaylistsProvider, usePlaylists } from '@/app/contexts/PlaylistContext'
import styles from './dropdown.module.scss'
import { useState, useEffect, useRef } from 'react'
import deleteTracksFromPlaylist from './playListTracks/DeleteTracks'
import axios from 'axios'

const moveTracks = async (accessToken: string, playlistId: string, uris: string[], total: number) => {
	const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	}

	const data = {
		uris: uris.map(uri => `spotify:track:${uri}`),
		position: total,
	}
	console.log(data)

	const response = await axios.post(url, data, { headers })
	return response.status
}

const DropdownComponent = () => {
	const [popup, setPopup] = useState<number>(0)
    const [name, setName] = useState<string>("")
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const accessToken = localStorage.getItem('access_token')

	const handleClose = () => {
		setIsOpen(false)
	}

	let handleMoveTracks = async (playlistId: string, total: number, playlistName:string) => {
		if (accessToken) {
			const sessionSavedTracks = sessionStorage.getItem('selectedSavedTracks')
			if (sessionSavedTracks && playlistId) {
				const tracks = JSON.parse(sessionSavedTracks)
				console.log(tracks)
				const responseStatus = await moveTracks(accessToken, playlistId, tracks, total)
				if (responseStatus === 200) {
					// setStatus('Tracks deleted successfully');
					// setPopup(1);
					// setTimeout(() => setPopup(0), 2000);
					// onTracksDeleted();
                    setName(playlistName)
					setPopup(1)
					setTimeout(() => setPopup(0), 3000)
				} else {
					console.log('Failed to delete tracks')
				}
				console.log(tracks)
			}
		}
	}

	const { playlists } = usePlaylists()

	const handleButtonClick = () => {
		setIsOpen(!isOpen)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<>
			<Popup currPopup={popup} popupText={`Tracks have been added to ${name}`} />
			<div className={styles.container} ref={dropdownRef}>
				<button className={styles.button} onClick={handleButtonClick}>
					Pick a playlist to move selected tracks
				</button>
				{isOpen && (
					<div className={styles.dropdown}>
						{playlists.map((playlist: any) => (
							<div
								key={playlist.id}
								className={styles.option}
								onClick={() => {
									handleMoveTracks(playlist.id, playlist.tracks.total, playlist.name)
									handleClose()
								}}>
								{playlist.name}
							</div>
						))}
					</div>
				)}
			</div>
		</>
	)
}

export default function Dropdown() {
	return (
		<PlaylistsProvider>
			<DropdownComponent
			// onTracksDeleted={refreshTracks}
			/>
		</PlaylistsProvider>
	)
}
