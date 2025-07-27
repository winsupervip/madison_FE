"use client";

import {Button, Modal, Select} from "antd";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {toastService} from "../../services/Toast.service";
import {
  addNoteComplain,
  checkUserRole,
  fetchData,
  updateComplainStatus,
} from "./api";
import {ComplainCard} from "./components/complainCard";
import {UserInfoCard} from "./components/userInfoCard";

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

  const [complains, setComplains] = useState<Complain[]>([]);
  const [selectedComplain, setSelectedComplain] = useState<{
    id: string;
    title: string;
    description: string;
    status: string;
    note?: string;
  }>({
    id: "",
    title: "",
    description: "",
    status: "",
    note: "",
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const {complains, user} = await fetchData();
        setComplains(complains);
        setUser(user);
        checkUserRole(router);
      } catch (err) {
        toastService.error("Lỗi", (err as Error).message);
      }
    };

    initialize();
  }, []);

  const openComplainDialog = (
    id: string,
    title: string,
    description: string,
    status: string,
    note?: string
  ) => {
    setSelectedComplain({id, title, description, status, note});
    setDialogOpen(true);
  };

  const toggleNoteDialog = () => {
    setDialogNoteOpen((prev) => !prev);
  };

  const updateComplainStatusHandler = async (id: string, status: string) => {
    try {
      const updated = await updateComplainStatus(id, status);
      setSelectedComplain((prev) => prev && {...prev, status: updated.status});

      toastService.success("Cập nhật trạng thái thành công");
    } catch (err) {
      toastService.error("Lỗi", (err as Error).message);
    }
  };

  const addNoteWithDebounce = (
    note: string,
    complainId: string,
    managerId: string
  ) => {
    if (selectedComplain?.id === complainId) {
      setSelectedComplain((prev) => prev && {...prev, note});
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      addNoteComplain(complainId, note, managerId);
    }, 2000);
  };

  const closeDialogsAndRefresh = async () => {
    try {
      const {complains, user} = await fetchData();
      setComplains(complains);
      setUser(user);
    } catch (err) {
      toastService.error("Lỗi", (err as Error).message);
    } finally {
      setDialogOpen(false);
      setDialogNoteOpen(false);
    }
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
      <UserInfoCard user={user}></UserInfoCard>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          maxWidth: "100%",
          margin: "0 auto",
          gap: "20px",
          padding: "20px",
        }}
      >
        {complains.map((complain) => (
          <ComplainCard
            key={complain.id}
            complain={complain}
            onClick={() =>
              openComplainDialog(
                complain.id,
                complain.title,
                complain.description,
                complain.status,
                complain.note
              )
            }
          />
        ))}
        {dialogOpen && (
          <Modal
            title={
              <h2 style={{fontSize: 22, margin: 0}}>
                {selectedComplain.title}
              </h2>
            }
            open={dialogOpen}
            onCancel={closeDialogsAndRefresh}
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
            {dialogNoteOpen && (
              <input
                name="note"
                placeholder="Ghi chú"
                value={selectedComplain.note}
                onChange={(e) => {
                  const value = e.target.value;
                  addNoteWithDebounce(value, selectedComplain.id, user.userId);
                }}
                style={{
                  width: "100%",
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
                marginTop: 16,
              }}
            >
              <Button type="default" onClick={toggleNoteDialog}>
                Thêm ghi chú
              </Button>
              <Select
                style={{width: 150}}
                value={selectedComplain.status}
                placeholder="Chọn trạng thái"
                onChange={(value) => {
                  updateComplainStatusHandler(selectedComplain.id, value);
                }}
                options={statusOptions}
              />
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
}
