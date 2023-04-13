export interface Cart {
    orders: Order[],
  }
  
export interface Order {
    id: number,
    date_request: Date,
    status: string,
    service_name: string,
  }