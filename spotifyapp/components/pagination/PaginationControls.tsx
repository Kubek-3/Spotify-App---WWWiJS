"use client";
import { useRouter } from "next/navigation";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import styles from "./paginationcontrols.module.scss";
import { useState } from "react";
interface PaginationControls {
    playlistId: string | null;
    page: string | string[] | undefined;
    perPage: string | string[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
}

export default function PaginationControls({
    playlistId,
    page,
    perPage,
    hasNextPage,
    hasPrevPage,
    totalPages,
}: PaginationControls) {
    const router = useRouter();
    let currPage = 1;
    if (Number(page) >= 1) {
        currPage = Number(page);
    }
    let pageNumbers = [];
    for (let i = currPage - 2; i <= currPage + 2; i++) {
        if (i < 1) continue;
        if (i > totalPages) break;
        pageNumbers.push(i);
    }
    return (
        <div className={styles.box}>
            {/* <button
				className={styles.box__prevBtn}
				disabled={!hasPrevPage}
				onClick={() => {
					router.push(`/playlists/${playlistId}?page=${Number(page) - 1}&perPage=${perPage}`)
				}}>
				<GrPrevious />
			</button> */}
            <div className={styles.box__numBox}>
                {pageNumbers[0] !== 1 && (
                    <p className={styles.box__more}>...</p>
                )}
                {pageNumbers.map((pageNum) => (
                    <button
                        key={pageNum}
                        className={styles.box__numBtn}
                        style={{
                            color: Number(page) == pageNum ? "#1DB954" : "",
                            scale: Number(page) == pageNum ? 1.2 : "",
                            border:
                                Number(page) == pageNum
                                    ? "1px solid #1b9144"
                                    : "",
                            padding: pageNum > 9 ? "1em 1em" : "",
                        }}
                        onClick={() => {
                            if (playlistId) {
                                router.push(
                                    `/playlists/${playlistId}?page=${pageNum}&perPage=${perPage}`
                                );
                            } else {
                                router.push(
                                    `/savedTracks?page=${pageNum}&perPage=${perPage}`
                                );
                            }
                        }}
                    >
                        {pageNum}
                    </button>
                ))}
                {pageNumbers[pageNumbers.length - 1] !== totalPages && (
                    <p className={styles.box__more}>...</p>
                )}
            </div>
            {/* <button
				className={styles.box__nextBtn}
				disabled={!hasNextPage}
				onClick={() => {
					router.push(`/playlists/${playlistId}?page=${Number(page) + 1}&perPage=${perPage}`)
				}}>
				<GrNext />
			</button> */}
        </div>
    );
}
