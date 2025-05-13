export interface Incident {
  _id: string;
  title?: string;
  reporter_name: string;
  status: string;
}

export interface Alert {
  _id: string;
  title?: string;
  created_by_name: string;
  severity: string;
}

export interface DashboardStats {
  total_users: number;
  total_incidents: number;
  total_alerts: number;
  total_volunteers: number;
  pending_incidents: number;
  pending_volunteers: number;
  recent_incidents: Incident[];
  recent_alerts: Alert[];
} 