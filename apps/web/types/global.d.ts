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

export interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
}

export interface TypeSelectorProps {
  selected: ContentType;
  onSelect: (type: ContentType) => void;
}

// interfaces for server actions
export interface ContentWithTags {
  id: string;
  title?: string;
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
  };
  document?: {
    filePath: string;
    fileType: string;
  };
}

export interface GetAllDocumentsResponse {
  success: true;
  message: string;
  contents: ContentWithTags[];
}

export interface AddDocumentResponse {
  success: true;
  message: string;
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

export interface ActionError {
  error: string;
}
export interface ActionSuccess {
  success: true;
  message: string;
}
