export type Role = 'USER' | 'ADMIN' | 'OFFICE_STAFF' | 'PASSENGER';

export type BookingStatus = 'ACTIVE' | 'CHECKED_IN' | 'COMPLETED' | 'EXPIRED';

export type TicketStatus = 'BOOKED' | 'ACTIVE' | 'USED' | 'CANCELLED' | 'EXPIRED';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Station {
  id: number;
  stationCode: string;
  stationName: string;
  city: string;
  active: boolean;
  lines?: Line[];
}

export interface Line {
  id: number;
  lineName: string;
  lineColor: string;
  stations?: Station[];
}

export interface Route {
  id: number;
  routeName: string;
  estimatedTimeMinutes: number;
  active: boolean;
  routeStations?: RouteStation[];
}

export interface RouteStation {
  id: number;
  route: Route;
  station: Station;
  stationOrder: number;
  distanceFromPrevious: number;
  timeFromPrevious: number;
}

export interface Train {
  id: number;
  trainNumber: string;
  coachCount: number;
  active: boolean;
}

export interface Schedule {
  id: number;
  route: Route;
  train: Train;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  active: boolean;
}

export interface Booking {
  id: number;
  user: User;
  schedule: Schedule;
  journeyDate: string;
  totalPassengers: number;
  totalFare: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

export interface BookingCreateRequest {
  user: Pick<User, 'id'>;
  schedule: Pick<Schedule, 'id'>;
  journeyDate: string;
  totalPassengers: number;
  totalFare: number;
}

export interface Ticket {
  id: number;
  booking: Booking;
  passengerName: string;
  passengerGender: string;
  ticketNumber: string;
  qrObjectName?: string;
  validFrom: string;
  validUntil: string;
  fare: number;
  status: TicketStatus;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
}

export interface ApiError {
  timestamp?: string;
  status?: number;
  message?: string;
}

export interface JourneySearch {
  fromStationId: number | '';
  toStationId: number | '';
  journeyDate: string;
  passengers: number;
}

export interface JourneyOption {
  schedule: Schedule;
  route: Route;
  fromRouteStation: RouteStation;
  toRouteStation: RouteStation;
  estimatedMinutes: number;
  totalFare: number;
}
