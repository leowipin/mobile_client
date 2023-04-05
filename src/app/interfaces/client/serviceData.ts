export interface ServiceData {
    id: number|string;
    name: string;
    description: string;
    set_price: boolean;
    requires_origin_and_destination: boolean;
    staff: string[];
    staff_is_optional: boolean[];
    staff_number_is_optional: boolean[];
    staff_price_per_hour: number[];
    staff_base_hours: number[];
    equipment: string[];
    equipment_is_optional: boolean[];
    equipment_number_is_optional: boolean[];
    equipment_price: number[];
    price_range1: number;
    price_range2: number;
    price_range3: number;
    lower_limit1: number;
    upper_limit1: number;
    lower_limit2: number;
    upper_limit2: number;
    lower_limit3: number;
    upper_limit3: number;
  }