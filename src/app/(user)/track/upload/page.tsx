import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upload",
  description: "Music is life",
};

export default function UploadPage() {
  return (
    <Container>
      <UploadTabs/>
    </Container>
  );
}
