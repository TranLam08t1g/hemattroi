import { Helmet } from 'react-helmet-async'
import { motion } from 'motion/react'

export function About() {
  return (
    <>
      <Helmet>
        <title>Hành Trình Hệ Mặt Trời – Giới Thiệu</title>
        <meta name="description" content="Giới thiệu về dự án Hành Trình Hệ Mặt Trời." />
      </Helmet>

      <div className="relative z-10 min-h-screen px-6 pt-32 pb-20 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="font-heading text-[clamp(32px,5vw,60px)] font-bold tracking-[0.15em] text-white">
            Sứ Mệnh
          </h1>
          <p className="mt-4 max-w-2xl font-heading text-[13px] tracking-[0.2em] text-[#4a4a5a]">
            Khám phá điện ảnh về vùng lân cận vũ trụ của chúng ta, được xây dựng bằng công nghệ web tiên tiến.
          </p>

          <div className="glass mt-14 rounded-2xl p-8 md:p-12">
            <div className="space-y-8">
              <Section
                title="Tầm Nhìn"
                text="Mang kỳ quan khám phá không gian đến với trình duyệt, tạo ra trải nghiệm sống động vừa giáo dục vừa truyền cảm hứng."
              />
              <Section
                title="Công Nghệ"
                text="Xây dựng bằng React 19, Three.js thông qua React Three Fiber, GSAP cho hoạt ảnh điện ảnh, và Tailwind CSS v4. Cảnh 3D có cơ học quỹ đạo thời gian thực, ánh sáng động và điều khiển tương tác."
              />
              <Section
                title="Thiết Kế"
                text="Thẩm mỹ tối giản cyber với glassmorphism, khoảng trắng chiến lược và bảng màu vũ trụ tối. Kết hợp font Space Grotesk với JetBrains Mono cho sự pha trộn giữa hiện đại và chính xác kỹ thuật."
              />
            </div>

            <div className="mt-12 border-t border-[rgba(255,255,255,0.06)] pt-8">
              <p className="font-mono text-[11px] tracking-[0.15em] text-[#4a4a5a]">
                HÀNH TRÌNH HỆ MẶT TRỜI &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="font-heading text-sm font-semibold tracking-[0.3em] uppercase text-white">
        {title}
      </h2>
      <p className="mt-3 font-heading text-sm leading-relaxed tracking-[0.1em] text-[#4a4a5a]">
        {text}
      </p>
    </div>
  )
}
