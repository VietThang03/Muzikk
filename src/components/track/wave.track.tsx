"use client";
import { useWaveSurfer } from "@/utils/customHook";
import { Container, Tooltip } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import { TrackComment, TrackTop } from "@/types/backend.type";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useTrackContext } from "@/app/lib/track.wrapper";
import CommentsTrack from "./comments.track";
import LikesTrack from "./likes.track";
import Image from "next/image";

interface Props {
  track: TrackTop | null;
  listCmt: TrackComment[];
}

export default function WaveTrack({ track, listCmt }: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<boolean>(true);
  const hoverRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");
  const { currentTrack, setCurrentTrack } = useTrackContext() as TrackContext;
  const [time, setTime] = useState<string>("0:00");
  const [duration, setDuration] = useState<string>("0:00");
  const router = useRouter();

  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;

    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas")!;
      const ctx = canvas.getContext("2d")!;
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }

    return {
      // waveColor: "rgb(200, 0, 200)",
      // progressColor: "rgb(100,0,100)",
      barWidth: 3,
      url: `/api?audio=${fileName}`,
      waveColor: gradient,
      progressColor: progressGradient,
      height: 100,
    };
  }, []);

  const wavesurfer = useWaveSurfer(containerRef, optionsMemo);

  useEffect(() => {
    if (!wavesurfer) return;
    setIsPlaying(false);
    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    //@ts-ignore
    waveform.addEventListener(
      "pointermove",
      (e) => (hover.style.width = `${e.offsetX}px`)
    );

    //moi lan fnc thuc thi xong moi setState
    const subscriptions = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),

      wavesurfer.on("decode", (duration) => {
        setDuration(formatTime(duration));
      }),
      wavesurfer.on("timeupdate", (currentTime) => {
        setTime(formatTime(currentTime));
      }),
      wavesurfer.once("interaction", () => {
        wavesurfer.play();
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const calcComment = (moment: number) => {
    const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
    const precent = (moment / hardCodeDuration) * 100;
    return `${precent}%`;
  };

  useEffect(() => {
    if (wavesurfer && currentTrack.isPlaying) {
      wavesurfer.pause();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (track?._id && !currentTrack?._id) {
      setCurrentTrack({
        ...track,
        isPlaying: false,
      });
    }
  }, [track]);

  const handleIncreaseView = async () => {
    if (viewRef.current) {
      await sendRequest({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        body: {
          trackId: track?._id,
        },
      });

      // data cache
      await sendRequest<BackendRes<any>>({
        url: '/api/revalidate',
        method: 'POST',
        queryParams: {
          tag: 'track-by-id',
          secret: 'nvtmusicwithnextjsandnestjs'
        }
      })

      // router cache
      router.refresh();
      viewRef.current = false;
    }
  };

  return (
    <>
      <Container>
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              gap: 15,
              padding: 20,
              height: 400,
              background:
                "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)",
            }}
          >
            <div
              className="left"
              style={{
                width: "75%",
                height: "calc(100% - 10px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="info" style={{ display: "flex" }}>
                <div>
                  <div
                    onClick={() => {
                      onPlayClick();
                      handleIncreaseView();
                      setCurrentTrack({
                        ...currentTrack,
                        isPlaying: false,
                      });
                    }}
                    style={{
                      borderRadius: "50%",
                      background: "#f50",
                      height: "50px",
                      width: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    {isPlaying === true ? (
                      <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                    ) : (
                      <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                    )}
                  </div>
                </div>
                <div style={{ marginLeft: 20 }}>
                  <div
                    style={{
                      padding: "0 5px",
                      background: "#333",
                      fontSize: 30,
                      width: "fit-content",
                      color: "white",
                    }}
                  >
                    {track?.title}
                  </div>
                  <div
                    style={{
                      padding: "0 5px",
                      marginTop: 10,
                      background: "#333",
                      fontSize: 20,
                      width: "fit-content",
                      color: "white",
                    }}
                  >
                    {track?.description}
                  </div>
                </div>
              </div>
              <div ref={containerRef} id="waveform">
                <div className="time">{time}</div>
                <div className="duration">{duration}</div>
                <div ref={hoverRef} className="hover-wave"></div>
                <div
                  className="overlay"
                  style={{
                    position: "absolute",
                    height: "30px",
                    width: "100%",
                    bottom: "0",
                    // background: "#ccc",
                    backdropFilter: "brightness(0.5)",
                  }}
                ></div>
                <div className="comments" style={{ position: "relative" }}>
                  {listCmt?.map((item) => {
                    return (
                      <Tooltip title={item.content} arrow key={item._id}>
                        <Image
                          src={fetchDefaultImages(item.user.type)}
                          alt="chilll"
                          width={20}
                          height={20}
                          style={{                          
                            position: "absolute",
                            top: 71,
                            left: calcComment(item.moment),
                            zIndex: 20,
                          }}
                          onPointerMove={(e) => {
                            const hover = hoverRef.current!;
                            hover.style.width = calcComment(item.moment);
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="right"
              style={{
                width: "25%",
                padding: 15,
                display: "flex",
                alignItems: "center",
              }}
            >
              {track?.imgUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                  alt={track.category}
                  width={250}
                  height={250}
                />
              ) : (
                <div
                  style={{
                    background: "#ccc",
                    width: 250,
                    height: 250,
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>
        <div>
          <LikesTrack track={track} />
        </div>
        <div>
          <CommentsTrack
            track={track}
            listCmt={listCmt}
            wavesurfer={wavesurfer}
          />
        </div>
      </Container>
    </>
  );
}
