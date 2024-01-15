import ProfileTrack from "@/components/profile/profile.tracks";
import { TrackTop } from "@/types/backend.type";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Music is life",
};

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const res = await sendRequest<BackendRes<ModelPaginate<TrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: {
      id: params.id,
    },
    nextOption:{
      // cache: "no-store"
      next: {tags: ['track-by-profile']}
    }
  });

  const data = res?.data?.result ?? []

  return (
    <Container sx={{my: 5}}>
       <Grid container spacing={5}>
                {data.map((item: TrackTop, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <ProfileTrack data={item} />
                        </Grid>
                    )
                })}
            </Grid>
    </Container>
  );
}
