"use client";
import {ConfigProvider} from "antd";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/user/auth/login");
  }, [router]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ce7a58",
        },
      }}
    ></ConfigProvider>
  );
}
