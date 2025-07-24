"use client";

import {Modal} from "antd";
import {isNil} from "nest-crud-client";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {toastService} from "../../services/Toast.service";

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}

export default function UserPage() {
  const statusOptions = [
    {value: "Pending", label: "Chờ xử lý"},
    {value: "Inprogress", label: "Đang xử lý"},
    {value: "Resolved", label: "Đã xong"},
  ];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComplainOpen, setDialogComplainOpen] = useState(false);
  const [user, setUser] = useState({name: "", phone: "", email: ""});
  const [feedback, setFeedback] = useState({title: "", content: ""});
  const [complains, setComplains] = useState([
    {
      id: "",
      title: "",
      description: "",
      status: "",
      createDate: "",
      updateDate: "",
      attachment: "",
    },
  ]);
  const [selectedComplain, setSelectedComplain] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
  });
  const router = useRouter();
  const getStatusLabel = (value: string): string => {
    const found = statusOptions.find((opt) => opt.value === value);
    return found?.label || value;
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedback({...feedback, [e.target.name]: e.target.value});
  };

  const handleOpenComplainDialog = (
    id: string,
    title: string,
    description: string,
    status: string
  ) => {
    setSelectedComplain({id, title, description, status});
    setDialogComplainOpen(true);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFeedback({title: "", content: ""});
  };
  const handleCloseDialog = () => {
    fetchData();
    setDialogOpen(false);
  };
  const handleConfirm = async () => {
    try {
      if (!feedback.title.trim() || !feedback.content.trim()) {
        toastService.warning(
          "Vui lòng nhập đầy đủ tiêu đề và nội dung phản hồi!"
        );
        return;
      }

      const userId = getCookie("id");
      if (!userId) {
        toastService.error("Không xác định được tài khoản người dùng!");
        return;
      }

      const payload = {
        userId: parseInt(userId),
        title: feedback.title,
        description: feedback.content,
      };

      const res = await fetch("http://127.0.0.1:3000/rest/complains/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        toastService.success("Gửi ý kiến thất bại!");
        throw new Error(`Lỗi gửi phản hồi: ${res.status} - ${errorText}`);
      }

      toastService.success("Phản hồi đã được gửi thành công!");
      setDialogOpen(false);
      setFeedback({title: "", content: ""});
    } catch (err: unknown) {
      console.error("Lỗi gửi phản hồi:", err);
      toastService.error(
        (err as Error).message || "Đã có lỗi xảy ra khi gửi phản hồi."
      );
    }
  };

  const verifyRole = async () => {
    const accessToken = getCookie("accessToken");
    const res = await fetch("http://127.0.0.1:3000/rest/user/isAccess", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data.user.role !== "user") {
      router.push("/user/auth/login");
    }
  };
  const fetchData = async () => {
    const name = getCookie("name");
    const phone = getCookie("phone");
    const email = getCookie("email");
    const userId = getCookie("id");
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/rest/complains?filter=userId||$eq||${userId}`
      );
      if (!res.ok) throw new Error("Không thể tải dữ liệu phản hồi");

      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((item: any) => ({
        id: item.id,

        title: item.title,
        description: item.description,
        status: item.status,
        createDate: item.createDate,
        updateDate: item.updateDate,
        attachment: item.attachment_url ?? "",
      }));

      setComplains(transformedData);
      console.log("Dữ liệu phản hồi:", complains);
    } catch (err: unknown) {
      console.error("Lỗi khi mở phản hồi:", err);
      toastService.error("Lỗi", (err as Error).message);
    }
    setUser({name, phone, email});
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
          Thông tin người dùng
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
          <button
            onClick={handleOpenDialog}
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: "#0070f3",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            tạo ý kiến
          </button>
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
              handleOpenComplainDialog(
                complain.id,
                complain.title,
                complain.description,
                complain.status
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
      </div>
      {dialogComplainOpen && (
        <Modal
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <h2 style={{fontSize: 22, margin: 0}}>
                {selectedComplain.title}
              </h2>
              <span
                style={{
                  background: "#e0f0ff",
                  color: "#1976d2",
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {getStatusLabel(selectedComplain.status)}
              </span>
            </div>
          }
          open={dialogComplainOpen}
          onCancel={() => setDialogComplainOpen(false)}
          footer={null}
        >
          <div style={{marginBottom: "12px"}}>
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
        </Modal>
      )}
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
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h3 style={{marginBottom: 8}}>Tạo ý kiến</h3>
            <input
              name="title"
              placeholder="Tiêu đề"
              value={feedback.title}
              onChange={handleFeedbackChange}
              style={{padding: 10, borderRadius: 7, border: "1px solid #ddd"}}
            />
            <textarea
              name="content"
              placeholder="Nội dung"
              value={feedback.content}
              onChange={handleFeedbackChange}
              rows={4}
              style={{
                padding: 10,
                borderRadius: 7,
                border: "1px solid #ddd",
                resize: "vertical",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 8,
              }}
            >
              <button
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
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "8px 18px",
                  borderRadius: 7,
                  border: "none",
                  background: "#0070f3",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
