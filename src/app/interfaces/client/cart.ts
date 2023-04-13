export interface Cart {
    orders: Order[],
  }
  
export interface Order {
    id: number,
    date_request: Date,
    status: string,
    service_name: string,
    requires_origin_and_destination:boolean,
  }