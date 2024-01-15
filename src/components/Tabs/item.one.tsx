"use client";
import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { sendRequest, sendRequestFile } from "@/utils/api";
import { JWT } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Props {
  setValue: (v: number) => void
  setTrackUpload: any
  trackUpload: any
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

function InputFileUpload() {
  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
      onClick={(e) => e.preventDefault()}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

export default function TabOne({setValue, setTrackUpload, trackUpload}: Props) {
  // const [percent, setPercent] = useState<number>(0)
  const { data: session } = useSession();
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        setValue(1)
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                // delay: 3000
              },
              onUploadProgress: progressEvent => {
                let percentCompeleted = Math.floor((progressEvent.loaded * 100)/ progressEvent.total!)
                // setPercent(percentCompeleted)
                setTrackUpload({
                  ...trackUpload,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompeleted
                })
              }
            }
          );
          setTrackUpload((prev: any) => ({
            ...prev,
            uploadedFileName: res.data.data.fileName
          }))
        } catch (error) {
          //@ts-ignore
          alert(error?.response?.data?.message);
        }
      }
    },
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3, .m4a"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
