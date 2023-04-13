export interface OrderData {
    service: string,
    phone_account: string|null,
    date_request: Date,
    start_date: Date,
    start_time: string,
    end_date: Date,
    end_time: string,
    duration: number,
    origin_lat: number,
    origin_lng: number,
    destination_lat: number,
    destination_lng: number,
    total: number,
    payment_method: string,
    status: string,
    staff: string[],
    staff_is_optional: string[],
    staff_selected: boolean[],
    staff_number_optional: boolean[],
    staff_number: number[],
    equipment: string[],
    equipment_is_optional: string[],
    equipment_selected: boolean[],
    equipment_number_optional: boolean[],
    equipment_number: number[],
}