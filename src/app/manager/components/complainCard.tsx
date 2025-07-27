export function ComplainCard({
  complain,
  onClick,
}: {
  complain: Complain;
  onClick: () => void;
}) {
  return (
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
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.outline = "2px solid #bbb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.outline = "none";
      }}
      onClick={onClick}
    >
      <div style={{marginBottom: "12px"}}>
        <h1 style={{fontWeight: "bold", fontSize: 25}}>{complain.title}</h1>
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
  );
}
