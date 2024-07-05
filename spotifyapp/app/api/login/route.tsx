import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import querystring from 'querystring';
import generateRandomString from '@/utils/generateRandomString';
import { cookies } from 'next/headers';

const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;

export async function GET(req: NextRequest, res: NextResponse) {
    const scope =
        'user-read-private user-read-email user-read-recently-played user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-library-modify user-top-read';
    const state = generateRandomString(16);
    cookies().set('state', state);

    const queryParams = querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

    return NextResponse.redirect(spotifyAuthUrl);
}
