"use client";

import { createContext, useContext, useState } from "react";

const TrackContext = createContext<TrackContext | null>(null);

const initialValue = {
  _id: "",
  title: "",
  description: "",
  category: "",
  imgUrl: "",
  trackUrl: "",
  countLike: 0,
  countPlay: 0,
  uploader: {
    _id: "",
    email: "",
    name: "",
    role: "",
    type: "",
  },
  isDeleted: false,
  createdAt: "",
  updatedAt: "",
  isPlaying: false,
};

const initialTrackLike = {
  _id: "",
  title: "",
  description: "",
  category: "",
  imgUrl: "",
  trackUrl: "",
  countLike: 0,
  countPlay: 0,
  createdAt: "",
  updatedAt: "",
  isPlaying: false
};

export const TrackContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentTrack, setCurrentTrack] = useState<PlayingTrack>(initialValue);
  const [currentTrackLike, setCurrentTrackLike] = useState<TrackUserLike>(initialTrackLike);

  return (
    <TrackContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        currentTrackLike,
        setCurrentTrackLike,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
