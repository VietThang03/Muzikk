"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function NewPlaylist() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Can not leave the title blank!");
      return;
    }
    const res = await sendRequest<BackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: {
        title,
        isPublic,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      toast.success("Successfully created new playlist!");
      setIsPublic(true);
      setTitle("");
      setOpen(false);

      await sendRequest<BackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "playlist-by-user",
          secret: "nvtmusicwithnextjsandnestjs",
        },
      });
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <div>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Playlist
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth={"sm"} fullWidth>
          <DialogTitle> Add new playlist:</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                gap: "30px",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <TextField
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                label="Title"
                variant="standard"
              />
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublic}
                      onChange={(event) => setIsPublic(event.target.checked)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={isPublic === true ? "Public" : "Private"}
                />
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSubmit()}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
