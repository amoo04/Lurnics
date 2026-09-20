export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string | null;
  subject: string;
  html: string;
  text: string;
  createdAt: string;
}
