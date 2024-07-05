// refresh token

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import axios from "axios";

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET

export async function GET(req: NextRequest,res: NextResponse) {
    const user_id = req.nextUrl.searchParams.get("user_id");
    const user = await User.findOne({where: {
        spotifyUserId: user_id
    }});
    if(user){
        const refreshToken = user.getDataValue("refreshToken");
        const response = await axios.post("https://accounts.spotify.com/api/token",{
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        },{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': 'Basic ' + (Buffer.from(client_id  + ':' + client_secret).toString('base64'))
            }
        })

        const newAccessToken = response.data.access_token; 
        await user.update({
            accessToken: newAccessToken
        });
        await user.save();
        console.log("refreshed token!");
        return NextResponse.json({
            message: "Succesfully updated access token!",
            accessToken: newAccessToken
        });      
    }
    else {
        return NextResponse.json({
            message: "No user with this token! Login one more time!"
        })
    }
}