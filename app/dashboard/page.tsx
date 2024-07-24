import ButtonAccount from "@/components/ButtonAccount";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { drive_v3, google } from "googleapis";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: {
      session: { provider_token },
    },
  } = await supabase.auth.getSession();

  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({
    access_token: provider_token,
  });
  console.log(oAuth2Client);
  let files: drive_v3.Schema$File[] = [];
  try {
    const drive = await google.drive({
      version: "v3",
      auth: oAuth2Client,
    });

    const res = await drive.files.list({
      pageSize: 10,
      // fields: "nextPageToken, files(id, name)",
    });
    files = res.data.files;
  } catch (error) {
    console.error(error);
  }
  // const files = [];

  if (files.length === 0) {
    return (
      <main>
        <section>
          <ButtonAccount />
          <div>No files found.</div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 className="text-3xl md:text-4xl font-extrabold">Private Page</h1>
        <ol>
          {files.map((file) => (
            <li key={file.id}>{file.name}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
