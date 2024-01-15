import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LikesPage from '@/components/like/like.page'
import { TrackLike } from '@/types/backend.type';
import { sendRequest } from '@/utils/api';
import { Container, Grid } from '@mui/material';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react'

export const metadata: Metadata = {
  title: "Liked Song",
  description: "Music is life",
};

export default async function LikePage() {
  const session = await getServerSession(authOptions)

  const res = await sendRequest<BackendRes<ModelPaginate<TrackLike>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 100,
      sort: "-createdAt",
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const data = res?.data?.result ?? []

  return (
    <>
    <Container sx={{my: 5}}>
      <div style={{width: "100%", textAlign: "center", color: "#092b4d"}}>
        <h1>Liked Song</h1>
      </div>
       <Grid container spacing={5}>
                {data.map((item: TrackLike, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <LikesPage data={item} />
                        </Grid>
                    )
                })}
            </Grid>
    </Container>
    </>
    
  )
}
