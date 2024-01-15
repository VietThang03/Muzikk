"use client";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TabOne from "../Tabs/item.one";
import TabTwo from "../Tabs/item.two";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UploadTabs() {
  const [value, setValue] = React.useState(0);
  const [trackUpload, setTrackUpload] = useState({
    fileName: "",
    percent: 0,
    uploadedFileName: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", border: "1px solid #ccc", marginTop: "25px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Tracks" disabled={value !== 0}/>
          <Tab label="Basic Information" disabled={value !== 1} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabOne setValue={setValue} setTrackUpload={setTrackUpload} trackUpload={trackUpload} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabTwo setValue={setValue} trackUpload={trackUpload} />
      </CustomTabPanel>
    </Box>
  );
}
