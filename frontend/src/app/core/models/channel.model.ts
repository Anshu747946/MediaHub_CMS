export type PlatformType = 'SOCIAL_MEDIA' | 'BLOG' | 'EMAIL_NEWSLETTER' | 'RSS_FEED';

export interface Channel {
  id: number;
  name: string;
  platformType: PlatformType;
  apiEndpoint: string;
  isActive: boolean;
}
