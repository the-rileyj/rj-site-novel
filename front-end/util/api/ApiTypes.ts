export interface SoundCloudPlaylist {
  artwork_url?: string | null;
  created_at: string;
  description?: string | null;
  duration: number;
  genre?: string | null;
  id: number;
  kind: string;
  label_name?: string | null;
  last_modified: string;
  likes_count: number;
  managed_by_feeds: boolean;
  permalink: string;
  permalink_url: string;
  public: boolean;
  purchase_title?: string | null;
  purchase_url?: string | null;
  release_date?: string | null;
  reposts_count: number;
  secret_token?: string | null;
  tag_list: string;
  title: string;
  uri: string;
  user_id: number;
  set_type: string;
  is_album: boolean;
  published_at: string;
  display_date: string;
  user: User;
  tracks: Track[];
  track_count: number;
}

export interface Track {
  artwork_url?: string;
  comment_count: number;
  commentable: boolean;
  created_at: string;
  description: string;
  display_date: string;
  download_count: number;
  downloadable: boolean;
  duration: number;
  full_duration: number;
  genre: string;
  has_downloads_left: boolean;
  id: number;
  label_name: null;
  last_modified: string;
  likes_count: number;
  permalink: string;
  permalink_url: string;
  playback_count: number;
  public: boolean;
  publisher_metadata: PublisherMetadata;
  purchase_title: null;
  purchase_url: null;
  release_date: null | string;
  reposts_count: number;
  streamable: boolean;
  tag_list: string;
  title: string;
  uri: string;
  urn: string;
  user: User;
  user_id: number;
  waveform_url: string;
}

export interface PublisherMetadata {
  artist?: string;
  contains_music: boolean;
  id: number;
  isrc?: string;
  urn: string;
  writer_composer?: string;
}

export interface User {
  avatar_url: string;
  city?: null | string;
  first_name: string;
  full_name: string;
  id: number;
  last_modified: string;
  permalink: string;
  permalink_url: string;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
}
