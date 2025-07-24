"use client";

import React, {useState} from "react";

export default function ManagerPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState({name: "", phone: "", email: ""});
  const [feedback, setFeedback] = useState({title: "", content: ""});

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedback({...feedback, [e.target.name]: e.target.value});
  };

  const handleOpenDialog = () => setDialogOpen(true);
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
          Thông tin người dùng
        </h2>
        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
          <input
            name="name"
            placeholder="Tên"
            value={user.name}
            onChange={handleUserChange}
            style={{padding: 12, borderRadius: 8, border: "1px solid #ddd"}}
          />
          <input
            name="phone"
            placeholder="Số điện thoại"
            value={user.phone}
            onChange={handleUserChange}
            style={{padding: 12, borderRadius: 8, border: "1px solid #ddd"}}
          />
          <input
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleUserChange}
            style={{padding: 12, borderRadius: 8, border: "1px solid #ddd"}}
          />
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
