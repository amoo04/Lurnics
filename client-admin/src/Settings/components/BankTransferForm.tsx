import { Banknote } from "lucide-react";
import type { Settings } from "../api/settings.types";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
      />
    </div>
  );
}

interface BankTransferFormProps {
  values: Pick<Settings, "bankAccountName" | "bankAccountNumber" | "bankName">;
  onChange: <K extends keyof BankTransferFormProps["values"]>(key: K, value: BankTransferFormProps["values"][K]) => void;
}

export default function BankTransferForm({ values, onChange }: BankTransferFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Banknote size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Bank Transfer Details</h3>
      </div>

      <p className="mb-4 text-xs text-gray-500">
        Used for maintenance and invoice payments until the company is registered and a business
        account is set up.
      </p>

      <div className="space-y-4">
        <Field label="Account Name" value={values.bankAccountName} onChange={(v) => onChange("bankAccountName", v)} />
        <Field
          label="Account Number"
          value={values.bankAccountNumber}
          onChange={(v) => onChange("bankAccountNumber", v)}
        />
        <Field label="Bank Name" value={values.bankName} onChange={(v) => onChange("bankName", v)} />
      </div>
    </div>
  );
}
