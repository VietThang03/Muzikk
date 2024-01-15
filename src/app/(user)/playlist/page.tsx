import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Playlist, TrackTop } from "@/types/backend.type";
import { sendRequest } from "@/utils/api";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import React, { Fragment } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NewPlaylist from "@/components/playlists/new.playlist";
import AddPlaylistTrack from "@/components/playlists/add.playlist";
import CurrentTrack from "@/components/playlists/current.track";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Music is life",
};

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);

  // api lay danh sach playlist cua user
  const playlistsUser = await sendRequest<BackendRes<ModelPaginate<Playlist>>>({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });

  // api lay danh sach all track
  const tracksUser = await sendRequest<BackendRes<ModelPaginate<TrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const playlists = playlistsUser?.data?.result ?? [];
  const tracks = tracksUser?.data?.result ?? [];

  return (
    <Container sx={{ mt: 3, p: 3, background: "#f3f6f9", borderRadius: "3px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Playlists</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <NewPlaylist />
          <AddPlaylistTrack playlists={playlists} tracks={tracks} />
        </div>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ mt: 3 }}>
        {playlists?.map((playlist) => {
          return (
            <Accordion key={playlist._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontSize: "20px", color: "#ccc" }}>
                  {playlist.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {playlist?.tracks?.map((track, index: number) => {
                  return (
                    <Fragment key={track._id}>
                      {index === 0 && <Divider />}
                      <CurrentTrack track={track} />
                      <Divider />
                    </Fragment>
                  );
                })}
                {playlist?.tracks?.length === 0 && <span>No data.</span>}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
}
