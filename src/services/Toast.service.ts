import {notification} from "antd";

type ToastType = "success" | "error" | "warning";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number | null;
}

const bgColorMap: Record<ToastType, string> = {
  success: "#E6F8E8",
  error: "#FFF0F0",
  warning: "#FFFBE6",
};

export class ToastService {
  private show(type: ToastType, options: ToastOptions) {
    const {title, description, duration} = options;
    notification[type]({
      key: type,
      message: title,
      description,

      style: {
        backgroundColor: bgColorMap[type],
      },
      duration: typeof duration === "number" ? duration : 1.5,
    });
  }

  success = (title: string, description?: string, duration?: number | null) =>
    this.show("success", {title, description, duration});

  error = (title: string, description?: string, duration?: number | null) =>
    this.show("error", {title, description, duration});

  warning = (title: string, description?: string, duration?: number | null) =>
    this.show("warning", {title, description, duration});
}

export const toastService = new ToastService();
