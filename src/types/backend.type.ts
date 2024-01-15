export interface TrackTop {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
  uploader: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrackComment {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrackLike {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  _id: string;
  title: string;
  isPublic: boolean;
  user: string;
  tracks: TrackTop[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
