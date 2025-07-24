import { notification } from "antd";

export class ToastService {
  success(title: string, description?: string, duration?: number | null) {
    notification.success({
      key: "noti",
      message: title,
      description,
      className: "bg-[#E6F8E8]",
      duration: duration || 1,
    });
  }

  error(title: string, description?: string, duration?: number | null) {
    notification.error({
      key: "error",
      message: title,
      description,
      className: "bg-[#FFF0F0]",
      duration: duration || 1,
    });
  }

  warning(title: string, description?: string, duration?: number | null) {
    notification.warning({
      key: "warning",
      message: title,
      description,
      className: "bg-[#FFFBE6]",
      duration: duration || 1,
    });
  }
}

export const toastService = new ToastService();
