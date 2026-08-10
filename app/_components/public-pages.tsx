import Image from "next/image";
import { ContactForm } from "@/app/_components/contact-form";
import { HardNavigationLink } from "@/app/_components/hard-navigation-link";
import { ArrowLink, Eyebrow, PageShell } from "@/app/_components/site-shell";
import { processSteps, technologyCapabilities, type Service } from "@/content/site";
import type { PublicContent } from "@/lib/content-store";

function CtaSection() {
  return (
    <section className="cta-section">
      <div className="shell cta-inner">
        <div>
          <Eyebrow>Bắt đầu từ bài toán</Eyebrow>
          <h2>Bạn đang cân nhắc một hệ thống mới?</h2>
        </div>
        <div>
          <p>
            Hãy chia sẻ mục tiêu và bối cảnh hiện tại. SELVA sẽ cùng bạn làm rõ
            phạm vi trước khi đề xuất giải pháp.
          </p>
          <HardNavigationLink className="button button-light" href="/contact">
            Trao đổi yêu cầu
          </HardNavigationLink>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="service-grid">
      {services.map((service) => (
        <article className="service-card" key={service.slug}>
          <span className="card-number" aria-hidden="true">
            {service.accent}
          </span>
          <h3>{service.shortTitle}</h3>
          <p>{service.summary}</p>
          <ArrowLink href={`/services/${service.slug}`}>Xem chi tiết</ArrowLink>
        </article>
      ))}
    </div>
  );
}

export function HomePage({ content }: { content: PublicContent }) {
  const { settings, services, projects } = content;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "SELVA",
        inLanguage: "vi-VN",
        description: settings.seoDescription,
      },
      ...(settings.legalDetailsApproved
        ? [{
            "@type": "Organization",
            name: settings.legalName,
            email: settings.contactEmail,
            telephone: settings.contactPhone,
            address: settings.officeAddress,
            taxID: settings.taxId || undefined,
          }]
        : []),
    ],
  };

  return (
    <PageShell settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />

      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <Eyebrow>Technology · Innovation · Long-term</Eyebrow>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroCopy}</p>
            <div className="hero-actions">
              <HardNavigationLink className="button" href="/contact">
                Trao đổi dự án
              </HardNavigationLink>
              <HardNavigationLink className="text-button" href="/services">
                Xem năng lực <span aria-hidden="true">→</span>
              </HardNavigationLink>
            </div>
            <ul className="trust-list" aria-label="Giá trị thương hiệu">
              <li>Trust</li>
              <li>Innovation</li>
              <li>Growth</li>
            </ul>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="signal-ring ring-one" />
            <div className="signal-ring ring-two" />
            <div className="signal-line line-one" />
            <div className="signal-line line-two" />
            <div className="signal-node node-one" />
            <div className="signal-node node-two" />
            <div className="signal-node node-three" />
            <Image
              src="/brand/selva-symbol.jpg"
              width={180}
              height={175}
              alt=""
              priority
            />
            <span>CONNECTED SYSTEMS</span>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="home-services">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>Năng lực cốt lõi</Eyebrow>
              <h2 id="home-services">Từ hiện diện số đến hệ thống vận hành.</h2>
            </div>
            <p>
              Mỗi giải pháp bắt đầu từ nhu cầu, phạm vi và kết quả cần đạt —
              không từ một danh sách tính năng đóng gói sẵn.
            </p>
          </div>
          <ServiceGrid services={services} />
        </div>
      </section>

      <section className="section section-dark" aria-labelledby="why-selva">
        <div className="shell values-grid">
          <div className="section-heading">
            <Eyebrow>Cách SELVA tạo giá trị</Eyebrow>
            <h2 id="why-selva">Rõ từ phạm vi. Chắc trong triển khai.</h2>
            <p>
              Công nghệ chỉ hữu ích khi giải quyết đúng bài toán và được bàn
              giao để đội ngũ có thể vận hành lâu dài.
            </p>
          </div>
          <div className="value-list">
            <article>
              <span>01</span>
              <div>
                <h3>Hiểu trước khi xây</h3>
                <p>Làm rõ người dùng, luồng nghiệp vụ và ràng buộc trước khi khóa scope.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Minh bạch khi triển khai</h3>
                <p>Review theo mốc, acceptance criteria rõ và kiểm soát change request.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Sẵn sàng cho đường dài</h3>
                <p>Ưu tiên khả năng bảo trì, bàn giao và mở rộng phù hợp thực tế.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="home-process">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>Quy trình</Eyebrow>
              <h2 id="home-process">Năm bước, một mạch làm việc rõ ràng.</h2>
            </div>
            <ArrowLink href="/process">Xem quy trình chi tiết</ArrowLink>
          </div>
          <ol className="process-list">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section projects-section" aria-labelledby="selected-work">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <Eyebrow>Năng lực qua dự án</Eyebrow>
              <h2 id="selected-work">Case study được công bố có kiểm soát.</h2>
            </div>
            <ArrowLink href="/projects">Xem khu vực dự án</ArrowLink>
          </div>
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.slice(0, 3).map((project) => (
                <article className="project-card" key={project.slug}>
                  <span>{project.industry}</span>
                  <h3>{project.title}</h3>
                  <p>{project.result}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">◎</span>
              <div>
                <h3>Hồ sơ công khai đang được chuẩn bị</h3>
                <p>
                  SELVA chỉ công bố dự án khi đã có quyền chia sẻ rõ ràng. Trong
                  lúc này, bạn có thể trao đổi trực tiếp để đánh giá phạm vi năng lực phù hợp.
                </p>
              </div>
              <HardNavigationLink className="button button-outline" href="/contact">
                Trao đổi nhu cầu
              </HardNavigationLink>
            </div>
          )}
        </div>
      </section>

      <div className="capability-strip" aria-label="Năng lực công nghệ">
        <div className="shell">
          {technologyCapabilities.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <CtaSection />
    </PageShell>
  );
}

export function AboutPage({ content }: { content: PublicContent }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro
        eyebrow="Về SELVA"
        title="Công nghệ được xây bằng tư duy hệ thống và trách nhiệm."
        copy="SELVA tập trung phát triển phần mềm theo yêu cầu và các hệ thống số giúp tổ chức, doanh nghiệp giải quyết bài toán vận hành thực tế."
      />
      <section className="section">
        <div className="shell editorial-grid">
          <div>
            <Eyebrow>Hướng tiếp cận</Eyebrow>
            <h2>Không bắt đầu bằng công nghệ.</h2>
          </div>
          <div className="prose-large">
            <p>
              Chúng tôi bắt đầu bằng mục tiêu, người dùng và cách công việc đang
              thực sự diễn ra. Từ đó, SELVA cùng khách hàng khóa phạm vi, thống
              nhất tiêu chí nghiệm thu và chọn giải pháp vừa đủ cho giai đoạn hiện tại.
            </p>
            <p>
              Trong quá trình phát triển, mỗi quyết định quan trọng được ghi
              nhận, mỗi phần chức năng được kiểm thử, và đầu ra được chuẩn bị để
              có thể bàn giao, vận hành và phát triển lâu dài.
            </p>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="shell">
          <div className="section-heading">
            <Eyebrow>Giá trị cốt lõi</Eyebrow>
            <h2>Trust · Innovation · Growth</h2>
          </div>
          <div className="principle-grid">
            <article><span>01</span><h3>Trust</h3><p>Cam kết rõ, giao tiếp minh bạch và bảo vệ dữ liệu trong phạm vi dự án.</p></article>
            <article><span>02</span><h3>Innovation</h3><p>Chọn công nghệ có mục đích, không chạy theo xu hướng nếu không tạo giá trị.</p></article>
            <article><span>03</span><h3>Growth</h3><p>Thiết kế để hệ thống có thể thích ứng khi tổ chức và nhu cầu phát triển.</p></article>
          </div>
        </div>
      </section>
      <CtaSection />
    </PageShell>
  );
}

export function ServicesPage({ content }: { content: PublicContent }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro
        eyebrow="Dịch vụ"
        title="Năng lực phù hợp với từng lớp bài toán số."
        copy="Từ website doanh nghiệp đến LMS và hệ thống nội bộ, SELVA xác định giải pháp theo scope thay vì áp một gói tính năng cố định."
      />
      <section className="section">
        <div className="shell">
          <ServiceGrid services={content.services} />
          <p className="scope-note">
            Chi phí được xác định sau khi làm rõ phạm vi, tiêu chí nghiệm thu và
            điều kiện triển khai. SELVA không niêm yết giá cố định cho dịch vụ theo yêu cầu.
          </p>
        </div>
      </section>
      <CtaSection />
    </PageShell>
  );
}

export function ServicePage({ content, service }: { content: PublicContent; service: Service }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro eyebrow={`Dịch vụ ${service.accent}`} title={service.title} copy={service.summary} />
      <section className="section">
        <div className="shell service-detail-grid">
          <article>
            <Eyebrow>Bài toán thường gặp</Eyebrow>
            <h2>Điểm bắt đầu</h2>
            <p>{service.problem}</p>
          </article>
          <article>
            <Eyebrow>SELVA có thể thực hiện</Eyebrow>
            <h2>Phạm vi năng lực</h2>
            <ul className="check-list">
              {service.capabilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article>
            <Eyebrow>Đầu ra điển hình</Eyebrow>
            <h2>Deliverables</h2>
            <ul className="check-list">
              {service.deliverables.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
          <article className="start-card">
            <Eyebrow>Cách khởi động</Eyebrow>
            <h2>Một buổi trao đổi đủ rõ để xác định bước tiếp theo.</h2>
            <p>
              Chuẩn bị mục tiêu, nhóm người dùng, hiện trạng và mốc thời gian dự
              kiến. SELVA sẽ cùng bạn xác định phần cần khảo sát thêm trước khi báo giá.
            </p>
            <HardNavigationLink className="button" href={`/contact?service=${service.slug}`}>
              Trao đổi yêu cầu
            </HardNavigationLink>
          </article>
        </div>
      </section>
    </PageShell>
  );
}

export function ProjectsPage({ content }: { content: PublicContent }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro
        eyebrow="Dự án / Case studies"
        title="Bằng chứng năng lực cần đi cùng quyền công bố."
        copy="Khu vực này được thiết kế để tích lũy case study theo thời gian, với trạng thái xuất bản được kiểm soát trước khi hiển thị công khai."
      />
      <section className="section">
        <div className="shell">
          {content.projects.length === 0 ? (
            <div className="empty-state empty-state-large">
              <span aria-hidden="true">◎</span>
              <div>
                <h2>Chưa có case study công khai</h2>
                <p>
                  Không có nghĩa là sử dụng dữ liệu giả. SELVA sẽ bổ sung tên dự
                  án, bài toán, giải pháp và kết quả khi đã nhận đủ chấp thuận công bố.
                </p>
              </div>
              <HardNavigationLink className="button button-outline" href="/contact">Trao đổi trực tiếp</HardNavigationLink>
            </div>
          ) : (
            <div className="project-grid">
              {content.projects.map((project) => (
                <article className="project-card" key={project.slug}>
                  {project.imageUrl ? (
                    <Image src={project.imageUrl} width={720} height={420} alt={`Hình minh họa dự án ${project.title}`} />
                  ) : null}
                  <span>{project.industry}</span>
                  <h2>{project.title}</h2>
                  <p>{project.result}</p>
                  <ul className="tag-list">{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaSection />
    </PageShell>
  );
}

export function ProcessPage({ content }: { content: PublicContent }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro
        eyebrow="Quy trình làm việc"
        title="Một luồng rõ ràng từ nhu cầu đến vận hành."
        copy="Quy trình giúp hai bên kiểm soát phạm vi, chất lượng và quyết định — thay vì nhận yêu cầu rồi đi thẳng vào code."
      />
      <section className="section">
        <div className="shell process-detail-list">
          {processSteps.map((step, index) => (
            <article key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{step.title}</h2><p>{step.description}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-soft">
        <div className="shell editorial-grid">
          <div><Eyebrow>Kiểm soát thay đổi</Eyebrow><h2>Scope thay đổi cần được nhìn thấy.</h2></div>
          <div className="prose-large"><p>Mỗi change request được mô tả rõ tác động đến đầu ra, thời gian và chi phí trước khi triển khai. Điều này bảo vệ cả mục tiêu dự án lẫn kỳ vọng của hai bên.</p></div>
        </div>
      </section>
      <CtaSection />
    </PageShell>
  );
}

export function ContactPage({ content }: { content: PublicContent }) {
  const { settings, services } = content;
  return (
    <PageShell settings={settings}>
      <PageIntro
        eyebrow="Liên hệ"
        title="Bắt đầu bằng một cuộc trao đổi có bối cảnh."
        copy="Chia sẻ mục tiêu, người dùng và điều bạn đang cần giải quyết. SELVA sẽ phản hồi để cùng xác định bước khảo sát phù hợp."
      />
      <section className="section">
        <div className="shell contact-grid">
          <div className="contact-aside">
            <Eyebrow>Kênh liên hệ</Eyebrow>
            <h2>Thông tin doanh nghiệp</h2>
            <dl>
              <div><dt>Email</dt><dd><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></dd></div>
              <div><dt>Điện thoại</dt><dd><a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>{settings.contactPhone}</a></dd></div>
              {settings.legalDetailsApproved && settings.officeAddress ? (
                <div><dt>Văn phòng</dt><dd>{settings.officeAddress}</dd></div>
              ) : null}
            </dl>
            <p className="small-note">Thông tin gửi qua form chỉ được dùng để phản hồi yêu cầu và quản lý trao đổi liên quan.</p>
          </div>
          <ContactForm services={services} />
        </div>
      </section>
    </PageShell>
  );
}

export function PrivacyPage({ content }: { content: PublicContent }) {
  return (
    <PageShell settings={content.settings}>
      <PageIntro
        eyebrow="Chính sách bảo mật"
        title="Thu thập vừa đủ, sử dụng đúng mục đích."
        copy="Chính sách này mô tả cách SELVA xử lý thông tin bạn chủ động gửi qua website."
      />
      <section className="section">
        <article className="shell policy-content">
          <h2>1. Thông tin được thu thập</h2>
          <p>Form liên hệ có thể thu thập họ tên, tổ chức, email, số điện thoại, dịch vụ quan tâm và nội dung nhu cầu. Website không yêu cầu mật khẩu, thông tin thanh toán hoặc giấy tờ định danh.</p>
          <h2>2. Mục đích sử dụng</h2>
          <p>Thông tin được dùng để phản hồi yêu cầu, làm rõ nhu cầu dự án và lưu vết trao đổi cần thiết. SELVA không bán dữ liệu liên hệ cho bên thứ ba.</p>
          <h2>3. Lưu trữ và bảo vệ</h2>
          <p>Dữ liệu được lưu trên hạ tầng vận hành website và dịch vụ email được cấu hình cho SELVA. Quyền truy cập được giới hạn cho người phụ trách có thẩm quyền.</p>
          <h2>4. Thời gian lưu giữ</h2>
          <p>Thông tin liên hệ được giữ trong thời gian cần thiết để xử lý yêu cầu và đáp ứng nghĩa vụ vận hành hợp lý, sau đó có thể được xóa hoặc ẩn danh.</p>
          <h2>5. Quyền của bạn</h2>
          <p>Bạn có thể yêu cầu xem, cập nhật hoặc xóa thông tin đã gửi bằng cách liên hệ <a href={`mailto:${content.settings.contactEmail}`}>{content.settings.contactEmail}</a>.</p>
          <h2>6. Analytics và cookie</h2>
          <p>Bản staging mặc định không cài pixel quảng cáo. Nếu analytics được bật khi launch, cấu hình và thông tin cookie sẽ được cập nhật tại đây trước khi thu thập dữ liệu.</p>
          <p className="policy-updated">Cập nhật lần cuối: 10/08/2026.</p>
        </article>
      </section>
    </PageShell>
  );
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="page-intro">
      <div className="shell page-intro-grid">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}
