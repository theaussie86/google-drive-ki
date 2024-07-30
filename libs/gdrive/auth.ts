import { google } from "googleapis";

export const dynamic = "force-dynamic";

export const getDrive = async (provider_token: string) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    access_token: provider_token,
  });
  const drive = await google.drive({
    version: "v3",
    auth: oAuth2Client,
  });
  return drive;
};
