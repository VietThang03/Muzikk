import { TrackLike, TrackTop } from "@/types/backend.type";

export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface RequestApi {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface BackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface ModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface PlayingTrack extends TrackTop {
    isPlaying: boolean;
  }

  interface TrackUserLike extends TrackLike {
    isPlaying: boolean;
  }

  interface TrackContext {
    currentTrack: PlayingTrack;
    setCurrentTrack: (v: PlayingTrack) => void;
    currentTrackLike: TrackUserLike;
    setCurrentTrackLike: (v: TrackUserLike) => void
  }
}
