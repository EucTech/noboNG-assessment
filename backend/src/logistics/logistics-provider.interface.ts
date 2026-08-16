export interface CreateShipmentInput {
  orderReference: string;
  recipientName: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
}

export interface ShipmentResult {
  provider: string;
  trackingNumber: string;
  estimatedDelivery: Date;
}

export interface TrackingStatus {
  trackingNumber: string;
  status: string;
  updatedAt: Date;
}

export abstract class LogisticsProvider {
  abstract readonly name: string;
  abstract createShipment(input: CreateShipmentInput): Promise<ShipmentResult>;
  abstract getTrackingStatus(trackingNumber: string): Promise<TrackingStatus>;
  abstract cancelShipment(trackingNumber: string): Promise<void>;
}
