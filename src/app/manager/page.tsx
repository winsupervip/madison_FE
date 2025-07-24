"use client";

import {isNil} from "nest-crud-client";
import React, {useEffect, useState} from "react";
import {toastService} from "../../services/Toast.service";

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
}
export default function ManagerPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState({name: "", phone: "", email: ""});
  const [feedback, setFeedback] = useState({title: "", content: ""});
  const [complains, setComplains] = useState([]);
  useEffect(() => {
    const name = getCookie("name");
    const phone = getCookie("phone");
    const email = getCookie("email");

    setUser({name, phone, email});
  }, []);
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedback({...feedback, [e.target.name]: e.target.value});
  };

  const handleOpenDialog = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:3000/rest/complains`);
      if (!res.ok) throw new Error("Không thể tải dữ liệu phản hồi");

      const data = await res.json();
      setComplains(data);
      console.log("Dữ liệu phản hồi:", complains);

      setDialogOpen(true); // mở dialog sau khi lấy dữ liệu thành công
    } catch (err: unknown) {
      console.error("Lỗi khi mở phản hồi:", err);
      toastService.error("Lỗi", (err as Error).message);
    }
  };

  const handleCloseDialog = () => setDialogOpen(false);
  const handleConfirm = () => {
    // Handle feedback submission logic here
    setDialogOpen(false);
    setFeedback({title: "", content: ""});
  };

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
              onChange={handleUserChange}
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
              onChange={handleUserChange}
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
              onChange={handleUserChange}
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
            Danh sách ý kiến
          </button>
        </div>
      </div>
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
            <h3 style={{marginBottom: 8}}>Danh sách ý kiến</h3>
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
