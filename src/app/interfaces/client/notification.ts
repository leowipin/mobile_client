export interface Notifications {
    notifications: Notification[],
  }
  
export interface Notification {
    id: number,
    title: string,
    message: string,
    url_img: string|null,
    date_sended:Date,
  }