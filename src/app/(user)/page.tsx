import MainSlider from "@/components/main/main.slider";
import * as React from "react";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next"
import { sendRequest } from "@/utils/api";
import { TrackTop } from "@/types/backend.type";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function HomePage() {
  // const session = await getServerSession(authOptions)
  const chills = await sendRequest<BackendRes<TrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: ({
      category: "CHILL",
      limit: 10
    })
  })

  const workouts = await sendRequest<BackendRes<TrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: ({
      category: "WORKOUT",
      limit: 10
    })
  })

  const partys = await sendRequest<BackendRes<TrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: ({
      category: "PARTY",
      limit: 10
    })
  })
  


  return (
    <div>
      <Container>
        <MainSlider data={chills?.data ? chills.data : []} title={"Top Chills"}/>
        <MainSlider data={workouts?.data ? workouts.data : []} title={"Top Workouts"}/>
        <MainSlider data={partys?.data ? partys.data : []} title={"Top Partys"}/>
      </Container>
    </div>
  );
}
