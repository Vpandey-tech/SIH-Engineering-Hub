export interface Lecture {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  tags?: string[];
  createdAt?: string;
}
