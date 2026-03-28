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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type Appointment, AppointmentStatus } from "../backend";
import { useActor } from "../hooks/useActor";

const SERVICES = [
  "General Ultrasound",
  "Obstetric Ultrasound",
  "Abdominal Scan",
  "Cardiac Echo",
  "Pelvic Ultrasound",
  "Thyroid Scan",
];

type FilterTab = "all" | "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const emptyForm = {
  patientName: "",
  cnic: "",
  phone: "",
  age: "",
  gender: "",
  service: "",
  appointmentDate: "",
  appointmentTime: "",
  notes: "",
};

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<bigint | null>(null);
  const { actor } = useActor();

  const loadAppointments = async () => {
    try {
      const data = (await actor?.getAllAppointments()) ?? [];
      setAppointments(data);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const filtered = appointments.filter((a) =>
    filterTab === "all" ? true : a.status === filterTab,
  );

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === AppointmentStatus.pending)
      .length,
    confirmed: appointments.filter(
      (a) => a.status === AppointmentStatus.confirmed,
    ).length,
    completed: appointments.filter(
      (a) => a.status === AppointmentStatus.completed,
    ).length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName || !form.phone || !form.age) {
      toast.error("Please fill required fields");
      return;
    }
    setSubmitting(true);
    try {
      await actor?.createAppointment({
        id: 0n,
        patientName: form.patientName,
        cnic: form.cnic,
        phone: form.phone,
        age: BigInt(form.age || "0"),
        gender: form.gender,
        service: form.service,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notes: form.notes,
        status: AppointmentStatus.pending,
      });
      toast.success("Appointment created successfully!");
      setDialogOpen(false);
      setForm(emptyForm);
      await loadAppointments();
    } catch {
      toast.error("Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: bigint, status: AppointmentStatus) => {
    setActionLoading(id);
    try {
      await actor?.updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      await loadAppointments();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteAppointment = async (id: bigint) => {
    setActionLoading(id);
    try {
      await actor?.deleteAppointment(id);
      toast.success("Appointment deleted");
      await loadAppointments();
    } catch {
      toast.error("Failed to delete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const filterTabs: { label: string; value: FilterTab }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="pt-16 min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-clinic-heading flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              Patient Appointments
            </h1>
            <p className="text-clinic-body text-sm mt-1">
              Manage all patient appointments
            </p>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold"
            onClick={() => setDialogOpen(true)}
            data-ocid="appointments.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: counts.total,
              color: "bg-white border-border",
            },
            {
              label: "Pending",
              value: counts.pending,
              color: "bg-yellow-50 border-yellow-200",
            },
            {
              label: "Confirmed",
              value: counts.confirmed,
              color: "bg-blue-50 border-blue-200",
            },
            {
              label: "Completed",
              value: counts.completed,
              color: "bg-green-50 border-green-200",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${stat.color}`}
            >
              <div className="text-2xl font-bold text-clinic-heading">
                {stat.value}
              </div>
              <div className="text-sm text-clinic-body">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div
          className="flex gap-2 mb-5 overflow-x-auto pb-1"
          data-ocid="appointments.tab"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filterTab === tab.value
                  ? "bg-primary text-white"
                  : "bg-white text-clinic-body hover:text-primary border border-border"
              }`}
              onClick={() => setFilterTab(tab.value)}
              data-ocid="appointments.tab"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
          {loading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="appointments.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="appointments.empty_state"
            >
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-clinic-heading font-semibold">
                No appointments found
              </p>
              <p className="text-clinic-body text-sm mt-1">
                Create a new appointment to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Patient Name</TableHead>
                    <TableHead>CNIC</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Age/Gender</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((appt, i) => (
                    <TableRow
                      key={String(appt.id)}
                      className="hover:bg-secondary/20"
                      data-ocid={`appointments.item.${i + 1}`}
                    >
                      <TableCell className="font-semibold text-clinic-heading">
                        {appt.patientName}
                      </TableCell>
                      <TableCell className="text-clinic-body text-sm">
                        {appt.cnic || "—"}
                      </TableCell>
                      <TableCell className="text-clinic-body text-sm">
                        {appt.phone}
                      </TableCell>
                      <TableCell className="text-clinic-body text-sm">
                        {Number(appt.age)}y / {appt.gender || "—"}
                      </TableCell>
                      <TableCell className="text-clinic-body text-sm">
                        {appt.service}
                      </TableCell>
                      <TableCell className="text-clinic-body text-sm">
                        <div>{appt.appointmentDate || "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {appt.appointmentTime || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[appt.status] || ""}`}
                        >
                          {appt.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {actionLoading === appt.id ? (
                            <Loader2
                              className="w-4 h-4 animate-spin text-primary"
                              data-ocid="appointments.loading_state"
                            />
                          ) : (
                            <>
                              {appt.status === AppointmentStatus.pending && (
                                <button
                                  type="button"
                                  title="Confirm"
                                  className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                  onClick={() =>
                                    updateStatus(
                                      appt.id,
                                      AppointmentStatus.confirmed,
                                    )
                                  }
                                  data-ocid="appointments.confirm_button"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {appt.status === AppointmentStatus.confirmed && (
                                <button
                                  type="button"
                                  title="Complete"
                                  className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                  onClick={() =>
                                    updateStatus(
                                      appt.id,
                                      AppointmentStatus.completed,
                                    )
                                  }
                                  data-ocid="appointments.confirm_button"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {appt.status !== AppointmentStatus.cancelled &&
                                appt.status !== AppointmentStatus.completed && (
                                  <button
                                    type="button"
                                    title="Cancel"
                                    className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                                    onClick={() =>
                                      updateStatus(
                                        appt.id,
                                        AppointmentStatus.cancelled,
                                      )
                                    }
                                    data-ocid="appointments.cancel_button"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              <button
                                type="button"
                                title="Delete"
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                onClick={() => deleteAppointment(appt.id)}
                                data-ocid="appointments.delete_button"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="appointments.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-clinic-heading">
              New Patient Appointment
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
                  data-ocid="appointments.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">CNIC</Label>
                <Input
                  placeholder="00000-0000000-0"
                  value={form.cnic}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cnic: e.target.value }))
                  }
                  data-ocid="appointments.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Phone *
                </Label>
                <Input
                  required
                  placeholder="+92-300-0000000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  data-ocid="appointments.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">Age *</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  placeholder="25"
                  value={form.age}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, age: e.target.value }))
                  }
                  data-ocid="appointments.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Gender
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}
                >
                  <SelectTrigger data-ocid="appointments.select">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Service
                </Label>
                <Select
                  value={form.service}
                  onValueChange={(v) => setForm((p) => ({ ...p, service: v }))}
                >
                  <SelectTrigger data-ocid="appointments.select">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Appointment Date
                </Label>
                <Input
                  type="date"
                  value={form.appointmentDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, appointmentDate: e.target.value }))
                  }
                  data-ocid="appointments.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-clinic-heading font-medium">
                  Appointment Time
                </Label>
                <Input
                  type="time"
                  value={form.appointmentTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, appointmentTime: e.target.value }))
                  }
                  data-ocid="appointments.input"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-clinic-heading font-medium">Notes</Label>
                <Textarea
                  placeholder="Additional notes or symptoms..."
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="resize-none"
                  data-ocid="appointments.textarea"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                data-ocid="appointments.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                data-ocid="appointments.submit_button"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Appointment"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
