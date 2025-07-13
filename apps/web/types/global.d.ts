import { ContentType } from "@repo/db/client";

// interfaces for component props
export interface CardProps {
  title: string;
  link: string;
  type: ContentType;
  tags: {
    tag: { title: string; color: string };
  }[];
}

// interfaces for server actions
export interface ContentWithTags {
  id: string;
  title: string;
  link: string;
  type: ContentType;
  createdAt: Date;
  userId: string;
  contentTags: {
    tag: {
      title: string;
      color: string;
    };
  }[];
}

export interface GetAllDocumentsResponse {
  success: true;
  message: string;
  contents: ContentWithTags[];
}

export interface ActionError {
  error: string;
}
export interface ActionSuccess {
  success: true;
  message: string;
}
