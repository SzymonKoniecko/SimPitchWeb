export interface IterationPreview {
  scoreboardId: string;
  iterationId: string;
  iterationIndex: number;
  teamId: string;
  points: number;
  rank: number;
}
export interface IterationPreviewList {
  items: IterationPreview[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
