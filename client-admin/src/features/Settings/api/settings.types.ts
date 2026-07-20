export interface Settings {
  // Site Information
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;

  // Application Settings
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  currency: string;
  itemsPerPage: number;

  // Storage Settings
  storageDisk: string;
  maxUploadSizeMb: number;
  allowedFileTypes: string;
  autoFileCleanup: boolean;

  // System Preferences
  defaultPaginationSize: number;
  defaultTheme: string;
  language: string;
  maintenanceMode: boolean;

  // Other Settings
  companyAddress: string;
  invoiceTerms: string;
  footerText: string;
}

export const DEFAULT_SETTINGS: Settings = {
  siteName: "",
  tagline: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  timeZone: "",
  dateFormat: "",
  timeFormat: "",

  allowRegistrations: true,
  requireEmailVerification: true,
  requireTwoFactor: true,
  sessionTimeoutMinutes: 30,
  currency: "NGN",
  itemsPerPage: 10,

  storageDisk: "",
  maxUploadSizeMb: 10,
  allowedFileTypes: "",
  autoFileCleanup: false,

  defaultPaginationSize: 10,
  defaultTheme: "dark",
  language: "en",
  maintenanceMode: false,

  companyAddress: "",
  invoiceTerms: "",
  footerText: "",
};
