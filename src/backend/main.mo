import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";

actor {
  type AppointmentStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  type InvoiceStatus = {
    #unpaid;
    #paid;
  };

  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
  };

  type Appointment = {
    id : Nat;
    patientName : Text;
    cnic : Text;
    phone : Text;
    age : Nat;
    gender : Text;
    service : Text;
    appointmentDate : Text;
    appointmentTime : Text;
    notes : Text;
    status : AppointmentStatus;
  };

  type InvoiceItem = {
    description : Text;
    amount : Nat;
  };

  type Invoice = {
    id : Nat;
    patientName : Text;
    phone : Text;
    items : [InvoiceItem];
    totalAmount : Nat;
    status : InvoiceStatus;
    createdAt : Text;
  };

  module Appointment {
    public func compare(a : Appointment, b : Appointment) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Invoice {
    public func compare(a : Invoice, b : Invoice) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Service {
    public func compare(a : Service, b : Service) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  var nextAppointmentId = 1;
  var nextInvoiceId = 1;
  var nextServiceId = 1;

  let appointments = Map.empty<Nat, Appointment>();
  let invoices = Map.empty<Nat, Invoice>();
  let services = Map.empty<Nat, Service>();

  // Add Service
  public shared ({ caller }) func addService(name : Text, description : Text, price : Nat) : async Nat {
    let service : Service = {
      id = nextServiceId;
      name;
      description;
      price;
    };
    services.add(nextServiceId, service);
    nextServiceId += 1;
    service.id;
  };

  // Get All Services
  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray().sort();
  };

  // Create Appointment
  public shared ({ caller }) func createAppointment(appointment : Appointment) : async Nat {
    let newAppointment : Appointment = {
      appointment with
      id = nextAppointmentId;
      status = #pending;
    };
    appointments.add(nextAppointmentId, newAppointment);
    nextAppointmentId += 1;
    newAppointment.id;
  };

  // Get All Appointments
  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    appointments.values().toArray().sort();
  };

  // Get Appointment by ID
  public query ({ caller }) func getAppointmentById(id : Nat) : async Appointment {
    switch (appointments.get(id)) {
      case (?appointment) { appointment };
      case (null) { Runtime.trap("Appointment not found") };
    };
  };

  // Update Appointment Status
  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : AppointmentStatus) : async () {
    let appointment = switch (appointments.get(id)) {
      case (?a) { a };
      case (null) { Runtime.trap("Appointment not found") };
    };

    appointments.add(
      id,
      {
        appointment with
        status;
      },
    );
  };

  // Delete Appointment
  public shared ({ caller }) func deleteAppointment(id : Nat) : async () {
    appointments.remove(id);
  };

  // Create Invoice
  public shared ({ caller }) func createInvoice(invoice : Invoice) : async Nat {
    let newInvoice : Invoice = {
      invoice with
      id = nextInvoiceId;
      status = #unpaid;
    };
    invoices.add(nextInvoiceId, newInvoice);
    nextInvoiceId += 1;
    newInvoice.id;
  };

  // Get All Invoices
  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    invoices.values().toArray().sort();
  };

  // Get Invoice by ID
  public query ({ caller }) func getInvoiceById(id : Nat) : async Invoice {
    switch (invoices.get(id)) {
      case (?invoice) { invoice };
      case (null) { Runtime.trap("Invoice not found") };
    };
  };

  // Mark Invoice as Paid
  public shared ({ caller }) func markInvoiceAsPaid(id : Nat) : async () {
    let invoice = switch (invoices.get(id)) {
      case (?i) { i };
      case (null) { Runtime.trap("Invoice not found") };
    };

    invoices.add(
      id,
      {
        invoice with
        status = #paid;
      },
    );
  };

  // Delete Invoice
  public shared ({ caller }) func deleteInvoice(id : Nat) : async () {
    invoices.remove(id);
  };
};
