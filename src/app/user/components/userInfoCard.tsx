import {isNil} from "lodash";

export function UserInfoCard({user, onOpen}: {user: User; onOpen: () => void}) {
  const userFields: Array<keyof User> = ["name", "phone", "email"];

  const getLabel = (field: keyof User) => {
    switch (field) {
      case "name":
        return "Tên:";
      case "phone":
        return "Số điện thoại:";
      case "email":
        return "Email:";
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 32,
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: 340,
        maxWidth: 500,
        width: "27%",
      }}
    >
      <h2 style={{textAlign: "center", marginBottom: 24}}>
        Thông tin người dùng
      </h2>
      <div style={{display: "flex", flexDirection: "column", gap: 16}}>
        {userFields.map((field) => (
          <div
            key={field}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>{getLabel(field)}</label>
            <input
              value={!isNil(user[field]) ? user[field] : ""}
              disabled
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
        ))}

        <button
          onClick={onOpen}
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
          Tạo ý kiến
        </button>
      </div>
    </div>
  );
}
