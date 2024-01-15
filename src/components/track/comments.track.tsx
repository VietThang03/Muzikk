"use client";
import { TrackComment, TrackTop } from "@/types/backend.type";
import React, { useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import WaveSurfer from "wavesurfer.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
dayjs.extend(relativeTime);

interface Props {
  track: TrackTop | null;
  listCmt: TrackComment[];
  wavesurfer: WaveSurfer | null;
}

export default function CommentsTrack({ listCmt, track, wavesurfer }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const [yourComment, setYourComment] = useState<string>("");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSubmit = async () => {
    const res = await sendRequest<BackendRes<TrackComment>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers:{
        Authorization: `Bearer ${session?.access_token}`,
      }
    });
    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };

  return (
    <div>
      <div style={{ marginTop: "50px", marginBottom: "25px" }}>
        {session?.user && (
          <TextField
            fullWidth
            value={yourComment}
            label="Comments"
            variant="standard"
            onChange={(e) => {
              setYourComment(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            InputProps={{
              endAdornment: <SendIcon sx={{cursor: "pointer"}} onClick={() => handleSubmit()} />
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div className="left" style={{ width: "190px" }}>
          <Image
            src={fetchDefaultImages(track?.uploader.type!)}
            alt="avatar"
            width={150}
            height={150}
          />
          <div style={{ textAlign: "center", width: "150px" }}>
            {track?.uploader.name}
          </div>
        </div>
        <div className="right" style={{ width: "calc(100% - 200px)" }}>
          {listCmt?.map((comment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    alignItems: "center",
                  }}
                >
                  <Image
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    src={fetchDefaultImages(comment.user.type)}
                  />
                  <div>
                    <div style={{ fontSize: "13px" }}>
                      {comment?.user?.name ?? comment?.user?.email} at
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleJumpTrack(comment.moment)}
                      >
                        &nbsp; {formatTime(comment.moment)}
                      </span>
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {dayjs(comment.updatedAt).fromNow()}
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
}
