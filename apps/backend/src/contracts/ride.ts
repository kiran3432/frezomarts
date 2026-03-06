export type RideStatus =
  | "REQUESTED"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ARRIVING"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type PaymentMethod = "CASH" | "UPI" | "CARD";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  riderId: string;
  captainId?: string;
  pickup: LatLng;
  drop: LatLng;
  estimatedFare: number;
  finalFare?: number;
  cancelReason?: string;
  surgeMultiplier: number;
  surgeLabel?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentCollectedAt?: string;
  status: RideStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RideEvent {
  rideId: string;
  status: RideStatus;
  timestamp: string;
}
