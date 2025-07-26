"use client";

import {Modal} from "antd";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {toastService} from "../../services/Toast.service";
import {getCookie} from "../../utils/getCookies";
import {checkUserRole, fetchComplains, fetchComplainsUserId} from "./api";
import {ComplainCard} from "./components/complainCard";
import {UserInfoCard} from "./components/userInfoCard";

export default function UserPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogComplainOpen, setDialogComplainOpen] = useState(false);
  const [user, setUser] = useState({name: "", phone: "", email: ""});
  const [feedback, setFeedback] = useState({title: "", description: ""});
  const [complains, setComplains] = useState<Complain[]>([]);
  const [selectedComplain, setSelectedComplain] = useState({
    id: "",
    title: "",
    description: "",
    status: "",
  });

  const statusOptions = [
    {value: "Pending", label: "Chờ xử lý"},
    {value: "Inprogress", label: "Đang xử lý"},
    {value: "Resolved", label: "Đã xong"},
  ];

  const getStatusLabel = (value: string) =>
    statusOptions.find((opt) => opt.value === value)?.label || value;

  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFeedback({...feedback, [e.target.name]: e.target.value});

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFeedback({title: "", description: ""});
  };

  const handleCloseDialog = () => {
    fetchData();
    setDialogOpen(false);
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

  const handleConfirm = async () => {
    const {title, description} = feedback;
    if (!title.trim() || !description.trim()) {
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

    try {
      await fetchComplains(userId, title, description);

      setDialogOpen(false);
      setFeedback({title: "", description: ""});
      fetchData();
      toastService.success("Phản hồi đã được gửi thành công!");
    } catch (err: unknown) {
      console.error("Lỗi gửi phản hồi:", err);
      toastService.error(
        (err as Error).message || "Đã có lỗi xảy ra khi gửi phản hồi."
      );
    }
  };

  const fetchData = async () => {
    const name = getCookie("name");
    const phone = getCookie("phone");
    const userId = getCookie("id");
    const email = getCookie("email") === "null" ? "" : getCookie("email");

    try {
      const res = await fetchComplainsUserId(userId);

      const transformed: Complain[] = res.map((item: Complain) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        createDate: item.createDate,
        updateDate: item.updateDate,
        attachment_url: item.attachment_url ?? "",
      }));

      setComplains(transformed);
    } catch (err: unknown) {
      console.error("Lỗi khi mở phản hồi:", err);
      toastService.error("Lỗi", (err as Error).message);
    }

    setUser({name, phone, email});
  };

  useEffect(() => {
    fetchData();
    checkUserRole(router);
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
      <UserInfoCard user={user} onOpen={handleOpenDialog} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          padding: "20px",
        }}
      >
        {complains.map((complain) => (
          <ComplainCard
            key={complain.id}
            complain={complain}
            onClick={() =>
              handleOpenComplainDialog(
                complain.id,
                complain.title,
                complain.description,
                complain.status
              )
            }
          />
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
        <Modal
          title="Gửi ý kiến"
          open={dialogOpen}
          onCancel={handleCloseDialog}
          onOk={handleConfirm}
          okText="Gửi"
          cancelText="Đóng"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <input
              name="title"
              placeholder="Tiêu đề"
              value={feedback.title}
              onChange={handleFeedbackChange}
              style={{padding: 10, borderRadius: 7, border: "1px solid #ddd"}}
            />
            <textarea
              name="description"
              placeholder="Nội dung"
              value={feedback.description}
              onChange={handleFeedbackChange}
              rows={4}
              style={{
                padding: 10,
                borderRadius: 7,
                border: "1px solid #ddd",
                resize: "vertical",
              }}
            />
          </div>
        </Modal>
      )}
    </main>
  );
}
