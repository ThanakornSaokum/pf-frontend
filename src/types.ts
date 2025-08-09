export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  maxParticipants: number;
  eventDate: string;
  totalParticipants: number;
  createBy: string;
  isDone: boolean;
}
