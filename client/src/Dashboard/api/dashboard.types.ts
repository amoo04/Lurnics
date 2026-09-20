export interface DashboardUser {
  id: string;
  email: string;
  name: string;
}

export interface DashboardBusiness {
  id: string;
  name: string;
  slug: string;
  currency: string;
  theme: string;
  customDomain: string | null;
}

export interface DashboardSession {
  user: DashboardUser;
  business: DashboardBusiness;
  role: string;
}

export interface RegisterBusinessInput {
  businessName: string;
  name: string;
  email: string;
  password: string;
}

export interface PlatformLoginInput {
  email: string;
  password: string;
}
