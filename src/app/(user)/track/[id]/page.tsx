import WaveTrack from "@/components/track/wave.track";
import { TrackComment, TrackTop } from "@/types/backend.type";
import { sendRequest } from "@/utils/api";
import { notFound, useSearchParams } from "next/navigation";
import React from "react";
import type { Metadata, ResolvingMetadata } from 'next'

export default async function DetailTrackPage({
  params,
}: {
  params: { id: string };
}) {
  const slug = params?.id?.split(".html") ?? []
  const slug_id = slug[0]?.split("-") ?? []
  const id = slug_id[slug_id.length - 1]

  const res = await sendRequest<BackendRes<TrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption:{
      // cache: "no-store"
      next: {tags: ['track-by-id']}
    }
  });

  const resCmt = await sendRequest<BackendRes<ModelPaginate<TrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 10,
      trackId: id,
      sort: "-createdAt",
    },
  });

  if(!res?.data){
    notFound()
  }

  return (
    <div>
      <WaveTrack track={res?.data ?? null} listCmt={resCmt?.data?.result || []} />
    </div>
  );
}


 
type Props = {
  params: { id: string }
}
 
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const slug = params?.id?.split(".html") ?? []
  const slug_id = slug[0]?.split("-") ?? []
  const id = slug_id[slug_id.length - 1]
  // fetch data
  const res = await sendRequest<BackendRes<TrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET" 
  });
 
  return {
    title: res.data?.title,
    description: res.data?.description
  }
}
