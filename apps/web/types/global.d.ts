import type { ContentType } from "@repo/common/config";

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

// interfaces for server actions
export type GetAllMemoriesResponse =
  | (ActionSuccess & {
      memories: ContentWithTags[];
    })
  | ActionError;

export type AddDocumentMemoryResponse =
  | (ActionSuccess & {
      memory: {
        type: ContentType;
        id: string;
        userId: string;
        createdAt: Date;
        title: string | null;
      };
    })
  | ActionError;

export type AddNoteMemoryResponse =
  | (ActionSuccess & {
      memory: {
        type: ContentType;
        id: string;
        userId: string;
        createdAt: Date;
      };
    })
  | ActionError;

export type AddVideoTweetLinkMemoryResponse =
  | (ActionSuccess &{
      memory: {
        type: $Enums.ContentType;
        link: string | null;
        title: string | null;
        id: string;
        userId: string;
        createdAt: Date;
      };
    })
  | ActionError;

export type DeleteMemoryResponse =
  | ActionSuccess
  | ActionError;

export interface Tag {
  id?: string;
  title: string;
  color: string;
}

export type GetAllTagsResponse =
  | (ActionSuccess & {
      tags: Tag[];
    })
  | ActionError;

export type GenerateUploadPresignedUrlResponse =
  | {
      success: true;
      uploadUrl: string;
      key: string;
    }
  | ActionError;

export interface GetDocumentPresignedUrlResponse {
  url: string;
}

export type ActionError = {
  success: false;
  error: string;
};
export type ActionSuccess = {
  success: true;
  message: string;
};
