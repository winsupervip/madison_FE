"use client";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Form, Input, Typography} from "antd";
import {useRouter} from "next/navigation";
import styles from "./login.module.scss";

export default function Login({title, type}: {title: string; type: string}) {
  const router = useRouter();
  const onFinish = async (values: {password: string; username: string}) => {
    try {
      const apiLogin = `http://127.0.0.1:3000/rest/${type}/login`;
      const res = await fetch(apiLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!res.ok) throw new Error("Đăng nhập thất bại");
      const data = await res.json();

      const userFields = {
        accessToken: data.accessToken,
        name: data.name,
        phone: data.phone,
        email: data.email ?? "",
        id: data.id,
      };

      for (const [key, value] of Object.entries(userFields)) {
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/;`;
      }

      setTimeout(() => {
        router.push(`/${type}`);
      }, 1200);
    } catch (err: unknown) {
      console.log("Login error:", err);

      throw new Error("Đăng nhập thất bại");
    }
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();

    setTimeout(() => {
      router.push(`/${type}/auth/register`);
    }, 800);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.formCard}>
        <Typography.Title level={2} className={styles.helloTitle}>
          {title}
        </Typography.Title>

        <Form
          name="login"
          initialValues={{remember: true}}
          onFinish={onFinish}
          layout="vertical"
          className={styles.loginForm}
        >
          <Form.Item
            name="username"
            rules={[
              {required: true, message: "Please enter your email address!"},
            ]}
            className={styles.formItem}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email Address"
              size="large"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{required: true, message: "Please enter your password!"}]}
            className={styles.formItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.roundButton}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.forgotPassword}>
          <a href="#" onClick={handleRegisterClick}>
            Tao tài khoản mới
          </a>
        </div>
      </div>
    </div>
  );
}
