import axios, { AxiosError, type AxiosInstance } from 'axios';
import type {
  User,
  Station,
  Line,
  Route,
  RouteStation,
  Train,
  Schedule,
  Booking,
  BookingCreateRequest,
  Ticket,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const isAuthEndpoint = config.url?.startsWith('/auth/');
  if (!isAuthEndpoint) {
    const token = localStorage.getItem('metro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = (error as AxiosError).response?.status;
    if (status === 401) {
      localStorage.removeItem('metro_token');
      localStorage.removeItem('metro_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getAuthToken(): string | null {
  return localStorage.getItem('metro_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('metro_token', token);
  } else {
    localStorage.removeItem('metro_token');
  }
}

export function parseApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (axiosError.message) {
    return axiosError.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

export function getErrorStatus(error: unknown): number | undefined {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError.response?.status;
}

// Auth
export async function register(user: User): Promise<User> {
  const response = await api.post<User>('/auth/register', user);
  return response.data;
}

export async function login(email: string, password: string): Promise<string> {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  const response = await api.post<string>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
}

// Users
export async function getAllUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users/all');
  return response.data;
}

export async function getUserById(id: number): Promise<User> {
  const response = await api.get<User>(`/users/id/${id}`);
  return response.data;
}

export async function createUser(user: User): Promise<User> {
  const response = await api.post<User>('/users/add', user);
  return response.data;
}

export async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const response = await api.put<User>(`/users/update/${id}`, user);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/delete/${id}`);
}

// Stations
export async function getAllStations(): Promise<Station[]> {
  const response = await api.get<Station[]>('/stations/allstations');
  return response.data;
}

export async function getStationById(id: number): Promise<Station> {
  const response = await api.get<Station>(`/stations/stationbyId/${id}`);
  return response.data;
}

export async function createStation(station: Omit<Station, 'id'>): Promise<Station> {
  const response = await api.post<Station>('/stations', station);
  return response.data;
}

export async function updateStation(id: number, station: Partial<Station>): Promise<Station> {
  const response = await api.put<Station>(`/stations/Stationupdate/${id}`, station);
  return response.data;
}

export async function deleteStation(id: number): Promise<void> {
  await api.delete(`/stations/DeleteStation/${id}`);
}

// Lines
export async function getAllLines(): Promise<Line[]> {
  const response = await api.get<Line[]>('/lines/all');
  return response.data;
}

export async function getLineById(id: number): Promise<Line> {
  const response = await api.get<Line>(`/lines/id/${id}`);
  return response.data;
}

export async function createLine(line: Omit<Line, 'id'>): Promise<Line> {
  const response = await api.post<Line>('/lines/add', line);
  return response.data;
}

export async function updateLine(id: number, line: Partial<Line>): Promise<Line> {
  const response = await api.put<Line>(`/lines/update/${id}`, line);
  return response.data;
}

export async function deleteLine(id: number): Promise<void> {
  await api.delete(`/lines/delete/${id}`);
}

export async function addStationToLine(lineId: number, stationId: number): Promise<Line> {
  const response = await api.post<Line>(`/lines/${lineId}/stations/${stationId}`);
  return response.data;
}

export async function removeStationFromLine(lineId: number, stationId: number): Promise<Line> {
  const response = await api.delete<Line>(`/lines/${lineId}/stations/${stationId}`);
  return response.data;
}

// Routes
export async function getAllRoutes(): Promise<Route[]> {
  const response = await api.get<Route[]>('/routes/all');
  return response.data;
}

export async function getRouteById(id: number): Promise<Route> {
  const response = await api.get<Route>(`/routes/id/${id}`);
  return response.data;
}

export async function createRoute(route: Omit<Route, 'id'>): Promise<Route> {
  const response = await api.post<Route>('/routes/add', route);
  return response.data;
}

export async function updateRoute(id: number, route: Partial<Route>): Promise<Route> {
  const response = await api.put<Route>(`/routes/update/${id}`, route);
  return response.data;
}

export async function deleteRoute(id: number): Promise<void> {
  await api.delete(`/routes/delete/${id}`);
}

// Route Stations
export async function getAllRouteStations(): Promise<RouteStation[]> {
  const response = await api.get<RouteStation[]>('/route-stations/all');
  return response.data;
}

export async function getRouteStationById(id: number): Promise<RouteStation> {
  const response = await api.get<RouteStation>(`/route-stations/id/${id}`);
  return response.data;
}

export async function createRouteStation(routeStation: Omit<RouteStation, 'id'>): Promise<RouteStation> {
  const response = await api.post<RouteStation>('/route-stations/add', routeStation);
  return response.data;
}

export async function updateRouteStation(id: number, routeStation: Partial<RouteStation>): Promise<RouteStation> {
  const response = await api.put<RouteStation>(`/route-stations/update/${id}`, routeStation);
  return response.data;
}

export async function deleteRouteStation(id: number): Promise<void> {
  await api.delete(`/route-stations/delete/${id}`);
}

// Trains
export async function getAllTrains(): Promise<Train[]> {
  const response = await api.get<Train[]>('/trains/all');
  return response.data;
}

export async function getTrainById(id: number): Promise<Train> {
  const response = await api.get<Train>(`/trains/id/${id}`);
  return response.data;
}

export async function createTrain(train: Omit<Train, 'id'>): Promise<Train> {
  const response = await api.post<Train>('/trains/add', train);
  return response.data;
}

export async function updateTrain(id: number, train: Partial<Train>): Promise<Train> {
  const response = await api.put<Train>(`/trains/update/${id}`, train);
  return response.data;
}

export async function deleteTrain(id: number): Promise<void> {
  await api.delete(`/trains/delete/${id}`);
}

// Schedules
export async function getAllSchedules(): Promise<Schedule[]> {
  const response = await api.get<Schedule[]>('/schedules/all');
  return response.data;
}

export async function getScheduleById(id: number): Promise<Schedule> {
  const response = await api.get<Schedule>(`/schedules/id/${id}`);
  return response.data;
}

export async function createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
  const response = await api.post<Schedule>('/schedules/add', schedule);
  return response.data;
}

export async function updateSchedule(id: number, schedule: Partial<Schedule>): Promise<Schedule> {
  const response = await api.put<Schedule>(`/schedules/update/${id}`, schedule);
  return response.data;
}

export async function deleteSchedule(id: number): Promise<void> {
  await api.delete(`/schedules/delete/${id}`);
}

// Bookings
export async function getAllBookings(): Promise<Booking[]> {
  const response = await api.get<Booking[]>('/bookings/all');
  return response.data;
}

export async function getBookingById(id: number): Promise<Booking> {
  const response = await api.get<Booking>(`/bookings/id/${id}`);
  return response.data;
}

export async function getBookingsByUser(userId: number): Promise<Booking[]> {
  const response = await api.get<Booking[]>(`/bookings/user/${userId}`);
  return response.data;
}

export async function createBooking(booking: BookingCreateRequest): Promise<Booking> {
  const response = await api.post<Booking>('/bookings/add', booking);
  return response.data;
}

export async function updateBooking(id: number, booking: Partial<Booking>): Promise<Booking> {
  const response = await api.put<Booking>(`/bookings/update/${id}`, booking);
  return response.data;
}

export async function deleteBooking(id: number): Promise<void> {
  await api.delete(`/bookings/delete/${id}`);
}

export async function checkInBooking(id: number): Promise<Booking> {
  const response = await api.post<Booking>(`/bookings/${id}/check-in`);
  return response.data;
}

export async function checkOutBooking(id: number): Promise<Booking> {
  const response = await api.post<Booking>(`/bookings/${id}/check-out`);
  return response.data;
}

// Tickets
export async function getTicketById(id: number): Promise<Ticket> {
  const response = await api.get<Ticket>(`/tickets/${id}`);
  return response.data;
}

export async function getTicketByBookingId(bookingId: number): Promise<Ticket> {
  const response = await api.get<Ticket>(`/tickets/booking/${bookingId}`);
  return response.data;
}

export async function getTicketQrCode(id: number): Promise<Blob> {
  const response = await api.get<Blob>(`/tickets/${id}/qr`, {
    responseType: 'blob',
  });
  return response.data;
}

export async function getTicketQrCodeByBookingId(bookingId: number): Promise<Blob> {
  const response = await api.get<Blob>(`/tickets/booking/${bookingId}/qr`, {
    responseType: 'blob',
  });
  return response.data;
}

export function getTicketQrCodeUrl(id: number): string {
  return `${API_BASE_URL}/tickets/${id}/qr`;
}

// Staff
export async function staffVerifyBooking(bookingId: number): Promise<Booking> {
  const response = await api.get<Booking>(`/staff/verify/${bookingId}`);
  return response.data;
}

export async function staffCheckInBooking(bookingId: number): Promise<Booking> {
  const response = await api.post<Booking>(`/staff/check-in/${bookingId}`);
  return response.data;
}

export async function staffCheckOutBooking(bookingId: number): Promise<Booking> {
  const response = await api.post<Booking>(`/staff/check-out/${bookingId}`);
  return response.data;
}

export default api;
