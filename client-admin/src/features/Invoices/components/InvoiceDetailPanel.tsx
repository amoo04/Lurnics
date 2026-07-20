import { X, CheckCircle2, Circle } from "lucide-react";
import { invoicePaid, invoiceTotal, type Invoice } from "../api/invoices.types";
import { avatarColorFor, formatCurrency, formatDate, getInitial } from "../../../lib/uiHelpers";

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-yellow-50 text-yellow-600",
  overdue: "bg-red-50 text-red-600",
  draft: "bg-gray-100 text-gray-600",
};

export default function InvoiceDetailPanel({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const outstanding = total - paid;
  const lastPayment = (invoice.payments ?? [])
    .filter((p) => p.status === "completed")
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0];

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:w-96 lg:shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs ${STATUS_COLOR[invoice.status]}`}>{invoice.status}</span>
          <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">
          <X size={16} />
        </button>
      </div>

      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold ${avatarColorFor(invoice.client?.companyName ?? "?")}`}
        >
          {getInitial(invoice.client?.companyName ?? "?")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{invoice.client?.companyName ?? "—"}</p>
          {invoice.client?.email && <p className="text-xs text-gray-500">{invoice.client.email}</p>}
          {invoice.client?.phone && <p className="text-xs text-gray-500">{invoice.client.phone}</p>}
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Due Date</p>
          <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
          {lastPayment && (
            <>
              <p className="mt-1">Last Payment</p>
              <p className="text-gray-900">{formatDate(lastPayment.paymentDate)}</p>
            </>
          )}
        </div>
      </div>

      {invoice.project && (
        <div className="mt-4 text-xs">
          <p className="text-gray-500">Project</p>
          <p className="text-orange-500">{invoice.project.projectName}</p>
        </div>
      )}

      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-500">
            <th className="py-2 font-medium">#</th>
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.lineItems ?? []).map((item, i) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2 text-gray-500">{i + 1}</td>
              <td className="py-2 text-gray-900">{item.description}</td>
              <td className="py-2 text-right text-gray-900">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.amount)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Discount</span>
          <span>- {formatCurrency(invoice.discount)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatCurrency(invoice.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1.5 font-semibold text-gray-900">
          <span>Total Amount</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Amount Paid</span>
          <span>- {formatCurrency(paid)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-600">
        <span>Outstanding Balance</span>
        <span>{formatCurrency(Math.max(0, outstanding))}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {invoice.notes && (
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-600">Notes</p>
            <p className="text-xs text-gray-500">{invoice.notes}</p>
          </div>
        )}
        <div>
          <p className="mb-2 text-xs font-semibold text-gray-600">Payment Timeline</p>
          <ul className="space-y-2 text-xs">
            {paid > 0 && (
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-gray-900">{formatCurrency(paid)} paid</span>
              </li>
            )}
            {outstanding > 0 && (
              <li className="flex items-center gap-2">
                <Circle size={14} className="text-gray-500" />
                <span className="text-gray-900">{formatCurrency(outstanding)} due</span>
                <span className="text-gray-500">{formatDate(invoice.dueDate)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
