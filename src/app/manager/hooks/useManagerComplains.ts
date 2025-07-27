// hooks/useManagerComplains.ts
import {useEffect, useRef, useState} from "react";

import {toastService} from "../../../services/Toast.service";
import {addNoteComplain, fetchData, updateComplainStatus} from "../api";

export function useManagerComplains() {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    userId: "",
  });
  const [complains, setComplains] = useState<Complain[]>([]);
  const [selectedComplain, setSelectedComplain] = useState<Complain | null>(
    null
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData()
      .then(({complains, user}) => {
        setComplains(complains);
        setUser(user);
      })
      .catch((err) => {
        toastService.error("Lỗi", (err as Error).message);
      });
  }, []);

  const updateStatus = async (id: string, value: string) => {
    try {
      const data = await updateComplainStatus(id, value);
      setSelectedComplain((prev) =>
        prev ? {...prev, status: data.status} : prev
      );
      toastService.success("Cập nhật trạng thái thành công");
    } catch (err: unknown) {
      toastService.error("Lỗi", (err as Error).message);
    }
  };

  const updateNote = (value: string, complainId: string, managerId: string) => {
    setSelectedComplain((prev) =>
      prev?.id === complainId ? {...prev, note: value} : prev
    );
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      addNoteComplain(complainId, value, managerId);
    }, 2000);
  };

  return {
    user,
    complains,
    selectedComplain,
    setSelectedComplain,
    updateStatus,
    updateNote,
  };
}
