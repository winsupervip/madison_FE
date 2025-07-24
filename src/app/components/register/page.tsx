"use client";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Button, Card, Form, Input, Typography, message} from "antd";
import {useRouter} from "next/navigation";
import styles from "./register.module.scss";

export default function Register({title, type}: {title: string; type: string}) {
  const router = useRouter();

  const onFinish = async (values: {
    confirm: string;
    password: string;
    phone: string;
    email: string;
    username: string;
    name: string;
  }) => {
    try {
      let apiCreate = `http://127.0.0.1:3000/rest/${type}/`;
      switch (type) {
        case "user":
          apiCreate += "createUser";
          break;
        case "manager":
          apiCreate += "createManager";
          break;

        default:
          break;
      }
      const res = await fetch(apiCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
        }),
      });
      if (!res.ok) throw new Error("Tạo tài khoản thất bại");
      message.success("Tạo tài khoản thành công!");
      setTimeout(() => {
        router.push(`/${type}/auth/login`);
      }, 1200);
    } catch (err) {
      message.error((err as Error).message || "Đã có lỗi xảy ra!");
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTimeout(() => {
      router.push(`/${type}/auth/login`);
    }, 800); // match transition duration
  };
  return (
    <div className={styles.loginWrapper}>
      <Card className={styles.formCard}>
        <Typography.Title level={2} className={styles.helloTitle}>
          {title}
        </Typography.Title>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className={styles.loginForm}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            className={styles.formItem}
            rules={[{required: true, message: "Vui lòng nhập tên đăng nhập!"}]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Họ và tên"
            className={styles.formItem}
            rules={[{required: true, message: "Vui lòng nhập họ và tên!"}]}
          >
            <Input placeholder="Họ và tên" className={styles.roundInput} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            className={styles.formItem}
            rules={[{type: "email", message: "Email không hợp lệ!"}]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            className={styles.formItem}
            rules={[
              {required: true, message: "Vui lòng nhập số điện thoại!"},
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              className={styles.roundInput}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            className={styles.formItem}
            rules={[{required: true, message: "Vui lòng nhập mật khẩu!"}]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            className={styles.formItem}
            dependencies={["password"]}
            rules={[
              {required: true, message: "Vui lòng xác nhận mật khẩu!"},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              className={styles.roundInput}
            />
          </Form.Item>
          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              block
              className={styles.roundButton}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.forgotPassword}>
          Bạn đã có tài khoản?
          <a href="#" onClick={handleLoginClick}>
            Đăng nhập
          </a>
        </div>
      </Card>
    </div>
  );
}
