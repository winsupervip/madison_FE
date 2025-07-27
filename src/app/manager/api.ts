import {useRouter} from "next/navigation";
import {getCookie} from "../../utils/getCookies";

export async function addNoteComplain(
  complainId: string,
  value: string,
  managerId: string
) {
  try {
    const checkRes = await fetch(
      `http://127.0.0.1:3000/rest/complainsLog?filter=complainsId||$eq||${complainId}`
    );
    const logs = await checkRes.json();

    if (logs.length === 0) {
      const postRes = await fetch("http://127.0.0.1:3000/rest/complainsLog", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          complainsId: complainId,
          managerId,
          note: value,
        }),
      });
      if (!postRes.ok) throw new Error("Không thể tạo ghi chú");
    } else {
      const logId = logs[0].id;
      const patchRes = await fetch(
        `http://127.0.0.1:3000/rest/complainsLog/${logId}`,
        {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({note: value, managerId}),
        }
      );
      if (!patchRes.ok) throw new Error("Không thể cập nhật ghi chú");
    }
  } catch (err: unknown) {
    console.error("Lỗi khi thêm ghi chú:", err);
    throw new Error(
      (err as Error).message || "Đã có lỗi xảy ra khi thêm ghi chú."
    );
  }
}
export async function checkUserRole(router: ReturnType<typeof useRouter>) {
  const accessToken = getCookie("accessToken");
  const res = await fetch("http://127.0.0.1:3000/rest/manager/isAccess", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    router.push("/manager/auth/login");
    throw new Error("Bạn không có quyền truy cập vào trang này");
  }
}
export async function fetchData() {
  const name = getCookie("name");
  const phone = getCookie("phone");
  const email = getCookie("email");
  const userId = getCookie("id");

  const res = await fetch("http://127.0.0.1:3000/rest/complains?join=log");
  if (!res.ok) throw new Error("Không thể tải dữ liệu phản hồi");

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedData = data.map((item: any) => ({
    id: item.id,
    userId: item.userId,
    title: item.title,
    description: item.description,
    status: item.status,
    createDate: item.createDate,
    updateDate: item.updateDate,
    attachment: item.attachment_url ?? "",
    note: item.log?.note || "",
  }));

  return {complains: transformedData, user: {name, phone, email, userId}};
}
export async function updateComplainStatus(id: string, value: string) {
  const res = await fetch(`http://127.0.0.1:3000/rest/complains/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({status: value}),
  });

  if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

  const data = await res.json();
  return data;
}
