import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/utils/db/db";
import User from '@/models/User';
import { redirect } from 'next/navigation'
import axios from "axios";

const redirect_uri = process.env.REDIRECT_URI
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

const fetchProfile = async(accessToken: string,refreshToken: string)=>{
  const cookieStore = cookies();
  try {
    const result = await axios.get("https://api.spotify.com/v1/me", {headers: { Authorization: `Bearer ${accessToken}` }});
    console.log(result.data);
    await db.authenticate();
    await User.sync();
    console.log("Succecfully connected with database");
    cookieStore.set("userId",result.data.id);    
    let user = await User.findOne({ 
        where: {
          spotifyUserId: result.data.id
        }
    });
    if(!user){ 
      user = await User.create({
        spotifyUserId: result.data.id,
        refreshToken: refreshToken,
        accessToken: accessToken
      });
      await user.save();
    }
    else {
      await user.update({refreshToken: refreshToken,accessToken: accessToken});
      await user.save();
    }
  } catch(err: any){
    console.log(err);
  }
};

export async function GET (req: NextRequest, res: NextResponse) {
    const cookieStore = cookies();
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const state_cookie = cookieStore.get("state")
    let curr_state = ""
    if (state_cookie) {
        curr_state = state_cookie.value
    }

    if (state === null || state !== curr_state) {
        return NextResponse.redirect("/404")
    }
    else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
            },
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true 
        }

          const response = await axios.post(authOptions.url, authOptions.form, {
            headers: authOptions.headers
          })
          if(response.data.access_token){
            console.log(response.data);
            await fetchProfile(response.data.access_token,response.data.refresh_token);
            const accessToken = response.data.access_token
            // if(accessToken){
            //   localStorage.setItem("access_token",accessToken);
            // }
            // redirect(`/?access_token=${response.data.access_token}`);
            console.log(cookieStore.get("userId"))
            redirect(`/tracks?access_token=${accessToken}&user_id=${cookieStore.get("userId")?.value}`)
          }
    }
}