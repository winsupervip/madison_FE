"use client";

import {Button, Select} from "antd";
import {isNil} from "nest-crud-client";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {toastService} from "../../services/Toast.service";

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}
export default function ManagerPage() {
  const statusOptions = [
    {value: "Pending", label: "Chờ xử lý"},
    {value: "Inprogress", label: "Đang xử lý"},
    {value: "Resolved", label: "Đã xong"},
  ];
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogNoteOpen, setDialogNoteOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    userId: "",
  });
  const [feedback, setFeedback] = useState({title: "", content: ""});
  const [complains, setComplains] = useState([
    {
      id: "",
      userId: "",
      title: "",
      description: "",
      status: "",
      createDate: "",
      updateDate: "",
      attachment: "",
      note: "",
    },
  ]);

  const [selectedComplain, setSelectedComplain] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
    note: "",
  });

  const fetchData = async () => {
    const name = getCookie("name");
    const phone = getCookie("phone");
    const email = getCookie("email");
    const userId = getCookie("id");
    try {
      const res = await fetch(`http://127.0.0.1:3000/rest/complains?join=log`);
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

      setComplains(transformedData);
      console.log("Dữ liệu phản hồi:", complains);
    } catch (err: unknown) {
      console.error("Lỗi khi mở phản hồi:", err);
      toastService.error("Lỗi", (err as Error).message);
    }
    setUser({name, phone, email, userId});
  };

  const handleOpenDialog = (
    id: string,
    title: string,
    description: string,
    status: string,
    note: string
  ) => {
    setSelectedComplain({id, title, description, status, note});
    setDialogOpen(true);
  };

  const handleOpenNoteDialog = () => {
    setDialogNoteOpen((prev) => !prev);
  };

  const handleChangeStatus = async (id: string, value: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/rest/complains/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: value}),
      });
      if (!res.ok) toastService.error("Cập nhật trạng thái thất bại");
      const data = await res.json();
      setSelectedComplain((prev) =>
        prev ? {...prev, status: data.status} : prev
      );

      setTimeout(() => {
        console.log("Complain sau cập nhật:", {
          ...selectedComplain,
          status: data.status,
        });
      }, 0);

      toastService.success("Cập nhật trạng thái thành công");
    } catch (err: unknown) {
      console.error("Lỗi khi mở phản hồi:", err);
      toastService.error("Lỗi", (err as Error).message);
    }
  };
  const handleAddNoteChange = (
    value: string,
    complainId: string,
    managerId: string
  ) => {
    setSelectedComplain((prev) =>
      prev?.id === complainId ? {...prev, note: value} : prev
    );

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const checkRes = await fetch(
          `http://127.0.0.1:3000/rest/complainsLog?filter=complainsId||$eq||${complainId}`
        );
        const logs = await checkRes.json();

        if (logs.length === 0) {
          const postRes = await fetch(
            "http://127.0.0.1:3000/rest/complainsLog",
            {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({
                complainsId: complainId,
                managerId,
                note: value,
              }),
            }
          );
          if (!postRes.ok) throw new Error("Không thể tạo ghi chú");
          toastService.success("Đã thêm ghi chú");
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
          toastService.success("Đã cập nhật ghi chú");
        }
      } catch (err: unknown) {
        console.error("Lỗi khi thêm ghi chú:", err);
        toastService.error("Lỗi", (err as Error).message);
      }
    }, 2000);
  };

  const handleCloseDialog = () => {
    fetchData();
    setDialogOpen(false);
    setDialogNoteOpen(false);
  };

  const verifyRole = async () => {
    const accessToken = getCookie("accessToken");
    const res = await fetch("http://127.0.0.1:3000/rest/manager/isAccess", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data.role !== "manager") {
      router.push("/user/auth/login");
    }
  };

  useEffect(() => {
    fetchData();
    verifyRole();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
        color: "#333",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: 340,
          maxWidth: 400,
        }}
      >
        <h2 style={{textAlign: "center", marginBottom: 24}}>
          Thông tin quản lý
        </h2>
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label>Tên:</label>
            <input
              name="name"
              placeholder="Tên"
              value={user.name}
              readOnly
              disabled={true}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                backgroundColor: "#f0f0f0",
                color: "#666",
                cursor: "not-allowed",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label>Số điện thoại:</label>
            <input
              name="phone"
              placeholder="Số điện thoại"
              value={user.phone}
              readOnly
              disabled={true}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                backgroundColor: "#f0f0f0",
                color: "#666",
                cursor: "not-allowed",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label>Email:</label>
            <input
              name="email"
              placeholder="Email"
              value={isNil(user.email) ? user.email : ""}
              readOnly
              disabled={true}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
                backgroundColor: "#f0f0f0",
                color: "#666",
                cursor: "not-allowed",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {complains.map((complain) => (
          <div
            key={complain.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",

              transition: "border-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#bbb";
              e.currentTarget.style.borderWidth = "2px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.borderWidth = "1px";
            }}
            onClick={() =>
              handleOpenDialog(
                complain.id,
                complain.title,
                complain.description,
                complain.status,
                complain.note
              )
            }
          >
            <div style={{marginBottom: "12px"}}>
              <h1 style={{fontWeight: "bold", fontSize: 25}}>
                {complain.title}
              </h1>
              <h2 style={{fontWeight: "bold", fontSize: 17, paddingTop: 10}}>
                Nội dung
              </h2>
              <p
                style={{
                  paddingTop: 5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "300px",
                }}
              >
                {complain.description}
              </p>
            </div>
          </div>
        ))}
        {dialogOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 28,
                borderRadius: 14,
                minWidth: 320,
                maxWidth: 500,
                boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{marginBottom: "12px"}}>
                <h1 style={{fontWeight: "bold", fontSize: 25}}>
                  {selectedComplain.title}
                </h1>
                <h2 style={{fontWeight: "bold", fontSize: 17, paddingTop: 10}}>
                  Nội dung
                </h2>
                <p
                  style={{
                    paddingTop: 5,
                    whiteSpace: "normal",
                    maxWidth: 500,
                  }}
                >
                  {selectedComplain.description}
                </p>
              </div>
              {dialogNoteOpen && (
                <input
                  name="note"
                  placeholder="Ghi chú"
                  value={selectedComplain.note}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleAddNoteChange(
                      value,
                      selectedComplain.id,
                      user.userId
                    );
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Button
                  onClick={handleCloseDialog}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 7,
                    border: "1px solid #bbb",
                    background: "#f5f5f5",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  huỷ
                </Button>
                <Button type="default" onClick={handleOpenNoteDialog}>
                  Thêm ghi chú
                </Button>
                <Select
                  style={{width: 150}}
                  value={selectedComplain.status}
                  placeholder="Chọn trạng thái"
                  onChange={(value) => {
                    handleChangeStatus(selectedComplain.id, value);
                  }}
                  options={statusOptions}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
