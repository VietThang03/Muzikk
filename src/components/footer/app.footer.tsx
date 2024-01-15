"use client";
import { useEffect, useRef } from "react";
import { useTrackContext } from "@/app/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Link from "next/link";

export default function AppFooter() {
  const {
    currentTrack,
    setCurrentTrack,
    currentTrackLike,
    setCurrentTrackLike,
  } = useTrackContext() as TrackContext;
  const playerRef = useRef(null);
  const likedSongRef = useRef(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (playerRef?.current && currentTrack?.isPlaying === false) {
      //@ts-ignore
      playerRef?.current?.audio?.current.pause();
    }

    if (playerRef?.current && currentTrack?.isPlaying === true) {
      //@ts-ignore
      playerRef?.current?.audio?.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (likedSongRef?.current && currentTrackLike?.isPlaying === false) {
      //@ts-ignore
      likedSongRef?.current?.audio?.current.pause();
    }

    if (likedSongRef?.current && currentTrackLike?.isPlaying === true) {
      //@ts-ignore
      likedSongRef?.current?.audio?.current.play();
    }
  },[currentTrackLike]);

  if (!hasMounted) return <></>;
  return (
    <>
      {currentTrack._id && (
        <div style={{ marginTop: 50 }}>
          <AppBar
            position="fixed"
            color="primary"
            sx={{ bottom: 0, top: "auto", backgroundColor: "#f2f2f2" }}
          >
            <Container
              // Loai bo padding o ben trai va phai cuar container
              disableGutters
              sx={{
                display: "flex",
                gap: 15,
                ".rhap_main": {
                  gap: "35px",
                },
              }}
            >
              <AudioPlayer
                ref={playerRef}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                volume={1}
                style={{
                  backgroundColor: "#f2f2f2",
                  boxShadow: "unset",
                }}
                layout="horizontal-reverse"
                onPlay={() => {
                  setCurrentTrack({
                    ...currentTrack,
                    isPlaying: true,
                  });
                }}
                onPause={() => {
                  setCurrentTrack({
                    ...currentTrack,
                    isPlaying: false,
                  });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  minWidth: 100,
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    color: "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </div>
                <div
                  style={{
                    width: "100%",
                    color: "#ccc",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={currentTrack.description}
                >
                  {currentTrack.description}
                </div>
              </div>
            </Container>
          </AppBar>
        </div>
      )}
      {currentTrackLike._id && (
        <div style={{ marginTop: 50 }}>
          <AppBar
            position="fixed"
            color="primary"
            sx={{ bottom: 0, top: "auto", backgroundColor: "#f2f2f2" }}
          >
            <Container
              // Loai bo padding o ben trai va phai cuar container
              disableGutters
              sx={{
                display: "flex",
                gap: 15,
                ".rhap_main": {
                  gap: "35px",
                },
              }}
            >
              <AudioPlayer
                ref={likedSongRef}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrackLike.trackUrl}`}
                volume={1}
                style={{
                  backgroundColor: "#f2f2f2",
                  boxShadow: "unset",
                }}
                layout="horizontal-reverse"
                onPlay={() => {
                  setCurrentTrackLike({
                    ...currentTrackLike,
                    isPlaying: true,
                  });
                }}
                onPause={() => {
                  setCurrentTrackLike({
                    ...currentTrackLike,
                    isPlaying: false,
                  });
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  minWidth: 100,
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    color: "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={currentTrackLike.title}
                >             
                  {currentTrackLike.title}
                </div>
                <div
                  style={{
                    width: "100%",
                    color: "#ccc",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={currentTrackLike.description}
                >
                  {currentTrackLike.description}
                </div>
              </div>
            </Container>
          </AppBar>
        </div>
      )}
    </>
  );
}
