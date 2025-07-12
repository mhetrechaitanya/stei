export interface Workshop {
  id?: string;
  name: string;
  description: string;
  category_id: string;
  fee: number;
  capacity: number;
  instructor: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  image?: string;
  duration_v: number;
  duration_u: string;
  sessions_r: number;
  minutes_p: number;
  start_date: string;
  session_start_time: string;
}
