'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { refreshToken } from '@/utils/refreshToken'
import axios from 'axios'
import Loading from '../loading/Loading'
import { useState } from 'react'
import styles from './usertopitems.module.scss'
const getUserItems = async (type: string, term: string) => {
	try {
		const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}?offset=0&limit=30&time_range=${term}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('access_token')}`,
			},
		})
		return response?.data?.items
	} catch (error: any) {
		if (error.response.status == 401) {
			const user_id = localStorage.getItem('user_id')
			if (user_id) {
				console.log(user_id)
				await refreshToken(user_id)
				const response2 = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				})
				console.log(response2)
				return response2?.data?.items
			}
		}
	}
}

export default function UserTopItems({ type, term }: { type: string; term: string }) {
	const router = useRouter()
	const { data, isLoading, error } = useQuery({
		queryKey: [{ type, term }],
		queryFn: () => getUserItems(type, term),
	})

	if (isLoading) {
		return (
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '80%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Loading />
			</div>
		)
	}

	if (error) {
		return <p>{error.message}</p>
	}
	console.log(data)
	return (
		<>
			{data.map((item: any, index: number) => (
				<>
					<div
						key={item.id}
						className={styles.itemCard}
						onClick={() => {
							router.push(item.external_urls.spotify)
						}}>
						<div
							className={styles.itemCard__itemImgBox}
							style={{
								border:
									index == 0
										? '2px solid #c9b037'
										: index == 1
										? '2px solid #b4b4b4'
										: index == 2
										? '2px solid #ad8a56'
										: '',
							}}>
							<img
								className={styles.itemCard__itemImg}
								src={type == 'tracks' ? item.album.images[2].url : item.images[2].url}
								alt='Track/Artist img'
							/>
						</div>
						<p
							className={styles.itemCard__itemTitle}
							style={{ color: index == 0 ? '#c9b037' : index == 1 ? '#b4b4b4' : index == 2 ? '#ad8a56' : '' }}>
							<span className={styles.itemCard__itemIndex}>{index + 1}.</span>
							{item.name}
						</p>
					</div>
					<div className={styles.underline}></div>
				</>
			))}
		</>
	)
}
