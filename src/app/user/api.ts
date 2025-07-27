import {useRouter} from "next/navigation";
import {toastService} from "../../services/Toast.service";
import {getCookie} from "../../utils/getCookies";

export async function fetchComplains(
  userId: string,
  title: string,
  description: string
) {
  try {
    const res = await fetch("http://127.0.0.1:3000/rest/complains/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userId: parseInt(userId),
        title,
        description,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Không thể tải dữ liệu phản hồi");
    return data;
  } catch (error) {
    console.error("Error fetching complains:", error);
    throw new Error("Không thể tải dữ liệu phản hồi");
  }
}

export async function checkUserRole(router: ReturnType<typeof useRouter>) {
  try {
    const accessToken = getCookie("accessToken");
    const res = await fetch("http://127.0.0.1:3000/rest/user/isAccess", {
      headers: {Authorization: `Bearer ${accessToken}`},
    });

    if (!res.ok) {
      router.push("/user/auth/login");
      throw new Error("Bạn không có quyền truy cập vào trang này");
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    toastService.error("Lỗi xác thực người dùng");
    router.push("/user/auth/login");
    return;
  }
}

export async function fetchComplainsUserId(userId: string) {
  try {
    const res = await fetch(
      `http://127.0.0.1:3000/rest/complains?filter=userId||$eq||${userId}`
    );
    if (!res.ok) throw new Error("Không thể tải dữ liệu phản hồi");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user complains:", error);
    throw new Error("Không thể tải dữ liệu phản hồi");
  }
}
