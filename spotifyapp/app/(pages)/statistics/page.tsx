'use client';
import { useState } from 'react';
import Wrapper from '@/components/others/Wrapper';
import Box from '@/components/others/Box';
import Title from '@/components/others/Title';
import UserTopItems from '@/components/statisticsPage/UserTopItems';
import { styleText } from 'util';
import styles from './statistics.module.scss';
export default function Statistics() {
    const [type, setType] = useState<string>('artists');
    const [term, setTerm] = useState<string>('medium_term');
    const [isDropdownOn, setIsDropdownOn] = useState<boolean>(false);
    const range =
        term == 'medium_term'
            ? '~ 6 months'
            : term == 'long_term'
            ? '~ 1 year'
            : '~ 1 month';
    return (
        <Wrapper>
            <Box>
                <Title>Statistics</Title>
                <div className={styles.boxNav}>
                    <button
                        className={styles.boxNav__artistsBtn}
                        onClick={() => setType('artists')}
                    >
                        Artists
                    </button>
                    <button
                        className={styles.boxNav__tracksBtn}
                        onClick={() => setType('tracks')}
                    >
                        Tracks
                    </button>
                    <div className={styles.boxNav__dropDownBox}>
                        <button
                            className={styles.boxNav__termsBtn}
                            onClick={() => setIsDropdownOn(!isDropdownOn)}
                        >
                            Term
                        </button>
                        <div
                            className={styles.boxNav__termsDropDown}
                            style={{
                                transform: isDropdownOn ? 'scaleY(1)' : '',
                            }}
                        >
                            <button
                                className={styles.boxNav__shortTermBtn}
                                onClick={() => {
                                    setTerm('short_term');
                                    setIsDropdownOn(false);
                                }}
                            >
                                Short Term
                            </button>
                            <button
                                className={styles.boxNav__mediumTermBtn}
                                onClick={() => {
                                    setTerm('medium_term');
                                    setIsDropdownOn(false);
                                }}
                            >
                                Medium Term
                            </button>
                            <button
                                className={styles.boxNav__longTermBtn}
                                onClick={() => {
                                    setTerm('long_term');
                                    setIsDropdownOn(false);
                                }}
                            >
                                Long Term
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.statistics}>
                    <div className={styles.box}>
                        <div className={styles.box__info}>
                            <h3 className={styles.box__title}>
                                Most listened to {type}
                            </h3>
                            <p className={styles.box__range}>{range}</p>
                        </div>
                        <div className={styles.underline}></div>
                        <div style={{ overflowY: 'scroll', height: '500px' }}>
                            <UserTopItems type={type} term={term} />
                        </div>
                    </div>
                </div>
            </Box>
        </Wrapper>
    );
}
