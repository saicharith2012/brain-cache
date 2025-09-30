import { ContentType } from "@repo/db/client";

// interfaces for component props
export interface CardProps {
  id: string;
  title?: string;
  link?: string;
  type: ContentType;
  tags: {
    tag: { title: string; color: string };
  }[];
  note?: string;
}

export interface CreateContentModalProps {
  tags: Tag[];
}

export interface TypeSelectorProps {
  selected: ContentType;
  onSelect: (type: ContentType) => void;
}

// interfaces for server actions
export interface ContentWithTags {
  id: string;
  title?: string | null;
  link?: string | null;
  type: ContentType;
  createdAt: Date;
  userId: string;
  contentTags: {
    tag: {
      title: string;
      color: string;
    };
  }[];
  note?: {
    contentData: string;
  } | null;
  document?: {
    filePath: string;
    fileType: string;
  } | null;
}

export interface GetAllDocumentsResponse {
  success: true;
  message: string;
  contents: ContentWithTags[];
}

export interface AddDocumentMemoryResponse {
  success: true;
  message: string;
  content: {
    type: ContentType;
    id: string;
    userId: string;
    createdAt: Date;
    title: string | null
  };
}

export interface AddNoteMemoryResponse {
  success: true;
  message: string;
  noteMemory: {
    type: ContentType;
    id: string;
    userId: string;
    createdAt: Date;
  };
}

export interface AddVideoTweetLinkMemoryResponse {
  success: true;
  message: string;
  content: {
    type: $Enums.ContentType;
    link: string | null;
    title: string | null;
    id: string;
    userId: string;
    createdAt: Date;
  };
}

export interface Tag {
  id?: string;
  title: string;
  color: string;
}

export interface GetAllTagsResponse {
  success: true;
  message: string;
  tags: Tag[];
}

export interface GenerateUploadPresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export interface GetDocumentPresignedUrlResponse {
  url: string;
}

export interface ActionError {
  error: string;
}
export interface ActionSuccess {
  success: true;
  message: string;
}
