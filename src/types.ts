import type { Context } from '@actions/github/lib/context';

export interface GitHubCommit {
  message?: string;
  author?: {
    name?: string;
  };
}

export interface GitHubPayload {
  head_commit?: GitHubCommit;
}

export interface GitHubContextWithPayload extends Context {
  payload: GitHubPayload;
}

export interface GoogleChatIcon {
  knownIcon?: string;
  iconUrl?: string;
}

export interface GoogleChatDecoratedText {
  startIcon?: GoogleChatIcon;
  topLabel?: string;
  text: string;
  wrapText?: boolean;
  bottomLabel?: string;
}

export interface GoogleChatButton {
  text: string;
  onClick: {
    openLink: {
      url: string;
    };
  };
}

export interface GoogleChatButtonList {
  buttons: GoogleChatButton[];
}

export interface GoogleChatWidget {
  decoratedText?: GoogleChatDecoratedText;
  buttonList?: GoogleChatButtonList;
}

export interface GoogleChatSection {
  header?: string;
  widgets: GoogleChatWidget[];
}

export interface GoogleChatCardHeader {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageType?: 'CIRCLE' | 'SQUARE';
  imageAltText?: string;
}

export interface GoogleChatCard {
  header?: GoogleChatCardHeader;
  sections: GoogleChatSection[];
}

export interface GoogleChatCardV2 {
  cardId: string;
  card: GoogleChatCard;
}

export interface GoogleChatMessage {
  text?: string;
  cardsV2: GoogleChatCardV2[];
}
