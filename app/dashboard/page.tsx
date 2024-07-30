import ButtonAccount from "@/components/ButtonAccount";
import { getDrive } from "@/libs/gdrive/auth";
import { fetchContent } from "@/libs/gdrive/folder";
import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { drive_v3 } from "googleapis";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
const folderId = "10j4tdsoYiS903GgiTYxfc5uvdkfji_RA";

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

  let files: drive_v3.Schema$File[] = [];
  try {
    const drive = await getDrive(provider_token);

    files = await fetchContent(drive, folderId);

    console.log(files);
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
