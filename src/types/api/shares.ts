export interface ShareParams {
  id: string;
  shareId?: string;
  type: "post" | "comment";
}

export interface ShareResponse {
  success: boolean;
  sharesCount: number;
  hasShared: boolean;
  shareId: string | null;
  quoteId: string | null;
}

export interface ShareStatus {
  hasShared: boolean;
  shareId: string | undefined;
  quoteId: string | undefined;
  sharesCount: number;
}

export interface ShareCount {
  sharesCount: number;
}

export interface ShareMutationContext {
  previousStatus?: ShareStatus;
  previousCount?: { sharesCount: number };
}
