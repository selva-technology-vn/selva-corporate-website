"use client";

import { FormEvent, useState } from "react";
import { HardNavigationLink } from "@/app/_components/hard-navigation-link";

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: FormState = { status: "idle" };

export function ContactForm({ services }: { services: { slug: string; title: string }[] }) {
  const [state, setState] = useState<FormState>(initialState);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setState({ status: "loading" });
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Không thể gửi yêu cầu lúc này.");
      }

      form.reset();
      setState({
        status: "success",
        message:
          result.message ??
          "SELVA đã tiếp nhận thông tin và sẽ phản hồi trong thời gian sớm nhất.",
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ qua email.",
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate={false}>
      <div className="form-row">
        <label>
          Họ và tên <span aria-hidden="true">*</span>
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          Tổ chức / công ty
          <input name="organization" autoComplete="organization" maxLength={120} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Email <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
        </label>
        <label>
          Số điện thoại
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            pattern="[0-9+().\s-]{8,20}"
            maxLength={20}
          />
        </label>
      </div>

      <label>
        Dịch vụ quan tâm <span aria-hidden="true">*</span>
        <select name="service" required defaultValue="">
          <option value="" disabled>
            Chọn một dịch vụ
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
          <option value="other">Nhu cầu khác</option>
        </select>
      </label>

      <label>
        Mô tả nhu cầu <span aria-hidden="true">*</span>
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={3000}
          rows={6}
          placeholder="Mục tiêu, người dùng, hiện trạng hoặc mốc thời gian bạn đang cân nhắc..."
        />
      </label>

      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="consent-row">
        <input name="consent" type="checkbox" value="yes" required />
        <span>
          Tôi đồng ý để SELVA xử lý thông tin trên nhằm mục đích phản hồi yêu
          cầu. Xem <HardNavigationLink href="/privacy">chính sách bảo mật</HardNavigationLink>.
        </span>
      </label>

      <button className="button" type="submit" disabled={state.status === "loading"}>
        {state.status === "loading" ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>

      <div className={`form-status ${state.status}`} role="status" aria-live="polite">
        {state.status === "success" || state.status === "error" ? state.message : ""}
      </div>
    </form>
  );
}
