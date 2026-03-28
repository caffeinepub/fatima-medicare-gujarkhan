import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Printer, Receipt, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type Invoice, InvoiceStatus } from "../backend";
import { useActor } from "../hooks/useActor";

type FilterTab = "all" | "unpaid" | "paid";

const emptyForm = {
  patientName: "",
  phone: "",
  items: [{ id: 1, description: "", amount: "" }],
};

const formatPKR = (amount: number) => `PKR ${amount.toLocaleString("en-PK")}`;

export default function BillingView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<bigint | null>(null);
  const { actor } = useActor();
  const printRef = useRef<HTMLDivElement>(null);

  const loadInvoices = async () => {
    try {
      const data = (await actor?.getAllInvoices()) ?? [];
      setInvoices(data);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount
  useEffect(() => {
    loadInvoices();
  }, []);

  const filtered = invoices.filter((inv) =>
    filterTab === "all" ? true : inv.status === filterTab,
  );

  const stats = {
    total: invoices.length,
    unpaid: invoices.filter((i) => i.status === InvoiceStatus.unpaid).length,
    paid: invoices.filter((i) => i.status === InvoiceStatus.paid).length,
    revenue: invoices
      .filter((i) => i.status === InvoiceStatus.paid)
      .reduce((sum, i) => sum + Number(i.totalAmount), 0),
  };

  const formTotal = form.items.reduce(
    (sum, item) => sum + (Number.parseFloat(item.amount) || 0),
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName) {
      toast.error("Patient name is required");
      return;
    }
    const validItems = form.items.filter((i) => i.description && i.amount);
    if (validItems.length === 0) {
      toast.error("Add at least one invoice item");
      return;
    }
    setSubmitting(true);
    try {
      await actor?.createInvoice({
        id: 0n,
        patientName: form.patientName,
        phone: form.phone,
        items: validItems.map((i) => ({
          description: i.description,
          amount: BigInt(Math.round(Number.parseFloat(i.amount))),
        })),
        totalAmount: BigInt(Math.round(formTotal)),
        status: InvoiceStatus.unpaid,
        createdAt: new Date().toISOString().split("T")[0],
      });
      toast.success("Invoice created!");
      setCreateOpen(false);
      setForm(emptyForm);
      await loadInvoices();
    } catch {
      toast.error("Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const markPaid = async (id: bigint) => {
    setActionLoading(id);
    try {
      await actor?.markInvoiceAsPaid(id);
      toast.success("Invoice marked as paid!");
      await loadInvoices();
    } catch {
      toast.error("Failed to update invoice");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteInvoice = async (id: bigint) => {
    setActionLoading(id);
    try {
      await actor?.deleteInvoice(id);
      toast.success("Invoice deleted");
      await loadInvoices();
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [...p.items, { id: Date.now(), description: "", amount: "" }],
    }));

  const removeItem = (idx: number) =>
    setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const updateItem = (
    idx: number,
    field: "description" | "amount",
    val: string,
  ) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((item, i) =>
        i === idx ? { ...item, [field]: val } : item,
      ),
    }));

  const filterTabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Paid", value: "paid" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-clinic-heading flex items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              Billing &amp; Invoices
            </h1>
            <p className="text-clinic-body text-sm mt-1">
              Manage patient billing and payment records
            </p>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold"
            onClick={() => setCreateOpen(true)}
            data-ocid="billing.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Invoices",
              value: stats.total,
              color: "bg-white border-border",
            },
            {
              label: "Unpaid",
              value: stats.unpaid,
              color: "bg-red-50 border-red-200",
            },
            {
              label: "Paid",
              value: stats.paid,
              color: "bg-green-50 border-green-200",
            },
            {
              label: "Revenue (Paid)",
              value: formatPKR(stats.revenue),
              color: "bg-blue-50 border-blue-200",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${stat.color}`}
            >
              <div className="text-xl font-bold text-clinic-heading">
                {stat.value}
              </div>
              <div className="text-sm text-clinic-body">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5" data-ocid="billing.tab">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filterTab === tab.value
                  ? "bg-primary text-white"
                  : "bg-white text-clinic-body hover:text-primary border border-border"
              }`}
              onClick={() => setFilterTab(tab.value)}
              data-ocid="billing.tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Invoice List */}
        {loading ? (
          <div className="space-y-3" data-ocid="billing.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-border shadow-card p-12 text-center"
            data-ocid="billing.empty_state"
          >
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-clinic-heading font-semibold">
              No invoices found
            </p>
            <p className="text-clinic-body text-sm mt-1">
              Create your first invoice to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inv, i) => (
              <div
                key={String(inv.id)}
                className="bg-white rounded-xl border border-border shadow-card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                data-ocid={`billing.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{String(inv.id)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        inv.status === InvoiceStatus.paid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="font-semibold text-clinic-heading">
                    {inv.patientName}
                  </div>
                  <div className="text-sm text-clinic-body">{inv.phone}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {inv.items.length} item{inv.items.length !== 1 ? "s" : ""} ·{" "}
                    {inv.items
                      .map((it) => it.description)
                      .join(", ")
                      .substring(0, 60)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold text-clinic-heading">
                    {formatPKR(Number(inv.totalAmount))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {inv.createdAt}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {actionLoading === inv.id ? (
                      <Loader2
                        className="w-4 h-4 animate-spin text-primary"
                        data-ocid="billing.loading_state"
                      />
                    ) : (
                      <>
                        {inv.status === InvoiceStatus.unpaid && (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                            onClick={() => markPaid(inv.id)}
                            data-ocid="billing.confirm_button"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                          onClick={() => setViewInvoice(inv)}
                          data-ocid="billing.secondary_button"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => deleteInvoice(inv.id)}
                          data-ocid="billing.delete_button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="billing.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-clinic-heading">
              Create New Invoice
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Patient Name *
                </Label>
                <Input
                  required
                  placeholder="Muhammad Ali"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, patientName: e.target.value }))
                  }
                  data-ocid="billing.input"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-clinic-heading font-medium">Phone</Label>
                <Input
                  placeholder="+92-300-0000000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  data-ocid="billing.input"
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-clinic-heading font-medium">
                  Invoice Items
                </Label>
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/80"
                  onClick={addItem}
                  data-ocid="billing.button"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <Input
                      placeholder="Description (e.g. General Ultrasound)"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(idx, "description", e.target.value)
                      }
                      className="flex-1"
                      data-ocid="billing.input"
                    />
                    <Input
                      type="number"
                      placeholder="PKR"
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(idx, "amount", e.target.value)
                      }
                      className="w-28"
                      data-ocid="billing.input"
                    />
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        className="p-1.5 rounded text-red-500 hover:bg-red-50"
                        onClick={() => removeItem(idx)}
                        data-ocid="billing.delete_button"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 px-4 bg-secondary rounded-xl">
              <span className="font-semibold text-clinic-heading">
                Total Amount
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPKR(formTotal)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setCreateOpen(false)}
                data-ocid="billing.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                data-ocid="billing.submit_button"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Invoice"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View/Print Invoice Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="max-w-2xl" data-ocid="billing.dialog">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-clinic-heading">
                Invoice #{viewInvoice && String(viewInvoice.id)}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handlePrint}
                data-ocid="billing.button"
              >
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </DialogHeader>
          {viewInvoice && (
            <div ref={printRef} className="print-invoice space-y-6 p-2">
              {/* Printable Header */}
              <div className="border-b border-border pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-clinic-heading">
                      FATIMA MEDICARE GUJARKHAN
                    </h2>
                    <p className="text-sm text-clinic-body">
                      Ultrasound Department
                    </p>
                    <p className="text-sm text-clinic-body">
                      Main Bazaar, Gujarkhan, Rawalpindi
                    </p>
                    <p className="text-sm text-clinic-body">
                      Phone: +92-51-1234567
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-block px-4 py-2 rounded-lg font-bold text-sm border-2 ${
                        viewInvoice.status === InvoiceStatus.paid
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-red-500 text-red-600 bg-red-50"
                      }`}
                    >
                      {viewInvoice.status === InvoiceStatus.paid
                        ? "✓ PAID"
                        : "UNPAID"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice #</p>
                  <p className="font-semibold text-clinic-heading">
                    {String(viewInvoice.id)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold text-clinic-heading">
                    {viewInvoice.createdAt}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Patient Name</p>
                  <p className="font-semibold text-clinic-heading">
                    {viewInvoice.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-semibold text-clinic-heading">
                    {viewInvoice.phone || "—"}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-clinic-heading">
                        Description
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold text-clinic-heading">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.items.map((item, idx) => (
                      <tr
                        key={`${item.description}-${idx}`}
                        className="border-t border-border"
                      >
                        <td className="px-4 py-2.5 text-clinic-body">
                          {item.description}
                        </td>
                        <td className="px-4 py-2.5 text-right text-clinic-heading font-medium">
                          {formatPKR(Number(item.amount))}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-border bg-secondary">
                      <td className="px-4 py-3 font-bold text-clinic-heading">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-base">
                        {formatPKR(Number(viewInvoice.totalAmount))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-2">
                Thank you for choosing Fatima Medicare Gujarkhan ·
                info@fatimamedicare.pk
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
