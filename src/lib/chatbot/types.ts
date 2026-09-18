export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
  action?: {
    type: "lead_submitted";
    data: {
      leadId?: string;
      name: string;
      email: string;
      services?: string[];
    };
  };
}

export interface LeadCaptureData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  services?: string[];
  budget?: string;
  timeline?: string;
  message: string;
}

export interface ChatApiResponse {
  ok: boolean;
  message?: string;
  action?: {
    type: "lead_submitted";
    data: {
      leadId?: string;
      name: string;
      email: string;
      services?: string[];
    };
  };
  error?: string;
}
