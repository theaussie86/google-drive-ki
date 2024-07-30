import { drive_v3 } from "googleapis";

export async function fetchContent(
  drive: drive_v3.Drive,
  folderId: string,
  pageToken = ""
) {
  const files: drive_v3.Schema$File[] = [];
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      pageSize: 2,
      pageToken: pageToken,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields:
        "nextPageToken, files(id, name, mimeType, modifiedTime, size, thumbnailLink, createdTime, exportLinks, webContentLink, sharingUser, owners, permissionIds)",
    });

    files.push(...res.data.files);

    // for (const file of res.data.files) {
    //   if (file.mimeType === "application/vnd.google-apps.folder") {
    //     const nestedFiles = await fetchContent(drive, file.id);
    //     files.push(...nestedFiles);
    //   }
    // }

    if (res.data.nextPageToken) {
      const moreContent = await fetchContent(
        drive,
        folderId,
        res.data.nextPageToken
      );
      files.push(...moreContent);
    }

    console.log(files[0].permissions);
    return files;
  } catch (error) {
    console.error(error);
  }
}
