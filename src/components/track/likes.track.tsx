"use client";
import { TrackLike, TrackTop } from "@/types/backend.type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { sendRequest } from "@/utils/api";

interface Props {
  track: TrackTop | null;
}

export default function LikesTrack({ track }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [trackLikes, setTrackLikes] = useState<TrackLike[] | null>(null);

  const fetchData = async () => {
    if (session?.access_token) {
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
      if (res?.data?.result) {
        setTrackLikes(res?.data?.result);
        console.log(res?.data?.result)
      }
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [session]);

  const handleLikeTrack = async () => {
    const res = await sendRequest<BackendRes<ModelPaginate<TrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    fetchData();

    await sendRequest<BackendRes<any>>({
      url: '/api/revalidate',
      method: 'POST',
      queryParams: {
        tag: 'track-by-id',
        secret: 'nvtmusicwithnextjsandnestjs'
      }
    })

    router.refresh();
  };

  return (
    <div
      style={{
        margin: "20px 10px 0 10px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Chip
        onClick={() => handleLikeTrack()}
        sx={{ borderRadius: "5px" }}
        size="medium"
        variant="outlined"
        color={
          trackLikes?.some((t) => t._id === track?._id) ? "error" : "default"
        }
        clickable
        icon={<FavoriteIcon />}
        label="Like"
      />
      <div
        style={{ display: "flex", width: "100px", gap: "20px", color: "#999" }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon sx={{ fontSize: "20px" }} />{track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon sx={{ fontSize: "20px" }} />{track?.countLike}
        </span>
      </div>
    </div>
  );
}
