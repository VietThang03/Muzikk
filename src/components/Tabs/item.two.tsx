"use client";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import Image from "next/image";

interface Props {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadedFileName: string;
  };
  setValue: (v: number) => void
}

interface NewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel({ trackUpload, setValue }: Props) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={trackUpload.percent} />
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface UploadImage {
  info: any;
  setInfo: any;
}

function InputFileUpload({ info, setInfo }: UploadImage) {
  const { data: session } = useSession();
  const toast = useToast()
  const handleUpload = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res.data.data.fileName,
      });
    } catch (error) {
      //@ts-ignore
      // alert(error?.response?.data?.message);
      toast.error(error?.response?.data?.message)
    }
  };
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
          handleUpload(event.files[0]);
        }
      }}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

export default function TabTwo({ trackUpload, setValue }: Props) {
  const { data: session } = useSession();
  const toast = useToast()
  const [info, setInfo] = useState<NewTrack>({
    title: "",
    category: "",
    description: "",
    imgUrl: "",
    trackUrl: "",
  });
  const category = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PARTY",
      label: "PARTY",
    },
  ];

  useEffect(() => {
    if (trackUpload && trackUpload.uploadedFileName) {
      setInfo({
        ...info,
        trackUrl: trackUpload.uploadedFileName,
      });
    }
  }, [trackUpload]);

  const handleFormSubmit = async () => {
    const res = await sendRequest<BackendRes<NewTrack>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
      method: "POST",
      body:{
        title: info.title,
        category: info.category,
        description: info.description,
        imgUrl: info.imgUrl,
        trackUrl: info.trackUrl,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      }
    })
    if(res.data){
      setValue(0)
      toast.success("create new track successfully!!!")

      await sendRequest<BackendRes<any>>({
        url: '/api/revalidate',
        method: 'POST',
        queryParams: {
          tag: 'track-by-profile',
          secret: 'nvtmusicwithnextjsandnestjs'
        }
      })
      
    }else{
      toast.error(res.message)
    }
  }

  // console.log(info);
  return (
    <>
      <div>
        <div>{trackUpload.fileName}</div>
        <LinearWithValueLabel setValue={setValue} trackUpload={trackUpload} />
      </div>

      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div>
              {info.imgUrl && (
                <Image
                  alt={info.description}
                  height={250}
                  width={250}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload info={info} setInfo={setInfo} />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info.title}
            onChange={(e) =>
              setInfo({
                ...info,
                title: e.target.value,
              })
            }
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info.description}
            onChange={(e) =>
              setInfo({
                ...info,
                description: e.target.value,
              })
            }
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            label="Category"
            fullWidth
            variant="standard"
            value={info.category}
            onChange={(e) =>
              setInfo({
                ...info,
                category: e.target.value,
              })
            }
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{
              mt: 5,
            }}
            onClick={handleFormSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
