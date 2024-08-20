export type Story = {
  id: number;
  title: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  synopsis: string;
  storyCover: string;
  createdAt: Date;
  updatedAt: Date;
};
