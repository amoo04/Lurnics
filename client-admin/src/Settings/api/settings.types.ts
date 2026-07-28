export interface Settings {
  // Company Information
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  companyAddress: string;

  // Bank Transfer Details
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}

export const DEFAULT_SETTINGS: Settings = {
  siteName: "",
  tagline: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  companyAddress: "",

  bankAccountName: "",
  bankAccountNumber: "",
  bankName: "",
};
