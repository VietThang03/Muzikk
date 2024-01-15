import { Container } from "@mui/material";
import { Metadata } from "next";
import React from "react";
import ClientSearch from "./components/client.search";

export const metadata: Metadata = {
  title: "Search your tracks",
  description: "Music is life",
};

export default function SearchPage() {
  return (
    <Container sx={{ mt: 3 }}>
      <ClientSearch />
    </Container>
  );
}
