"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Button, Box, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { TrackTop } from "@/types/backend.type";
import { title } from "process";
import Link from "next/link";
import { convertSlug } from "@/utils/api";
import Image from "next/image";

interface Props {
  data: TrackTop[];
  title: string;
}

export default function MainSlider({ data, title }: Props) {
  const NextArrow = (props: any) => {
    return (
      <Button
        variant="contained"
        color="inherit"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 0,
          top: "20%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: any) => {
    return (
      <Button
        variant="contained"
        color="inherit"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          top: "20%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
      breakpoint: 1024,
      settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: true,
      dots: true
      }
      },
      {
      breakpoint: 600,
      settings: {
      slidesToShow: 2,
      slidesToScroll: 2,
      initialSlide: 2
      }
      },
      {
      breakpoint: 480,
      settings: {
      slidesToShow: 1,
      slidesToScroll: 1
      }
      }
      ]
  };
  return (
    <Box
      sx={{
        margin: "0px 50px",
        ".track": {
          padding: "0px 10px",
          img: {
            height: 150,
            width: 150,
          },
        },
        cursor: "pointer",
        a: {
          color: "unset",
          textDecoration: "none",
        },
        // h3: {
        //   border: "1px solid #ccc",
        //   padding: "20px",
        //   height: "200px",
        // },
      }}
    >
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((track) => (
          <div className="track" key={track._id}>
            <div
              style={{
                position: "relative",
                height: "150px",
                width: "100%",
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                alt={track.description}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
            <Link
              href={`/track/${convertSlug(track.title)}-${track._id}.html/?audio=${track.trackUrl}`}
            >
              <div
                style={{
                  width: "100%",
                  color: "#000",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 10,
                }}
                title={track.title}
              >
                {track.title}
              </div>
            </Link>
            <div
              style={{
                width: "100%",
                color: "#000",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 16,
                // fontWeight: "bold",
                marginTop: 10,
              }}
            >
              {track.description}
            </div>
          </div>
        ))}
      </Slider>
      <Divider />
    </Box>
  );
}
