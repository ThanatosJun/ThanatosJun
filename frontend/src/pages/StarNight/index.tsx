import { Helmet } from 'react-helmet-async'
import OpeningAnimation from '../../components/opening/OpeningAnimation'
import StarMap from '../../components/starmap/StarMap'
import Live2DCanvas from '../../components/live2d/Live2DCanvas'
import ChatPanel from '../../components/chat/ChatPanel'
import Navbar from '../../components/layout/Navbar'
import './starnight.css'

const projects = [
  {
    id: 'anime-imprimatura',
    title: 'Anime Imprimatura',
    titleJp: 'アニメ色彩研究',
    desc: '利用影像處理技術分析動漫作品的底色風格，重現特定動畫師的上色層次。',
    cover: '/images/anime-imprimatura-cover.png',
    result: '/images/anime-imprimatura-result.png',
    link: 'https://github.com/ThanatosJun/Anime-Imprimatura',
    qr: '/images/qr-anime-imprimatura.png',
    tags: ['Python', 'OpenCV', 'Image Processing'],
  },
  {
    id: 'cl-graduated',
    title: 'CL Graduated',
    titleJp: '卒業',
    desc: '以畢業為主題設計的互動式視覺作品，結合粒子動效與角色演出呈現告別情感。',
    cover: '/images/cl-graduated-cover.png',
    link: 'https://github.com/ThanatosJun/CL_Graduated',
    tags: ['Creative Coding', 'p5.js', 'Animation'],
  },
  {
    id: 'love-game',
    title: 'Love Game',
    titleJp: 'ラブゲーム',
    desc: '以戀愛模擬遊戲為靈感的互動作品，融合對話系統與分支劇情設計。',
    cover: '/images/love-game.png',
    link: 'https://github.com/ThanatosJun/LoveGame',
    qr: '/images/qr-lovegame.png',
    tags: ['Game Design', 'JavaScript', 'Narrative'],
  },
  {
    id: 'flyshoot',
    title: 'FlyShoot',
    titleJp: 'フライシュート',
    desc: '自製的彈幕射擊遊戲，包含自定義敵人 AI、BOSS 機制與音效整合。',
    cover: '/images/flyshoot-cover.png',
    link: 'https://github.com/ThanatosJun/FlyShoot',
    tags: ['Game Dev', 'C#', 'Unity'],
  },
  {
    id: '2dcolorgan',
    title: '2D Color GAN',
    titleJp: 'カラーGAN',
    desc: '基於 GAN 的 2D 自動上色系統，訓練模型將線稿轉換為完整彩色插圖。',
    cover: '/images/2dcolorgan-cover.png',
    link: 'https://github.com/ThanatosJun/2DColorGAN',
    tags: ['Deep Learning', 'GAN', 'PyTorch'],
  },
]

const poems = [
  {
    id: 'nianlun',
    title: '年輪',
    titleJp: 'ねんりん',
    img: '/images/poem-0.png',
    lines: [
      '每一道刻痕都是時間的重量',
      '樹木用沉默記錄成長',
      '我用文字丈量那些走過的日子',
    ],
  },
  {
    id: 'xuecheng',
    title: '雪城',
    titleJp: 'ゆきのまち',
    img: '/images/poem-1.jpg',
    lines: [
      '城市蓋上一層白毯',
      '所有聲音都變得輕柔',
      '只有腳步聲在記憶裡清晰',
    ],
  },
  {
    id: 'buza',
    title: '不再',
    titleJp: 'もはや',
    img: '/images/poem-2.jpg',
    lines: [
      '有些告別不需要儀式',
      '轉身的瞬間就已完成',
      '而我仍在原地學習放手',
    ],
  },
]

const interests = [
  { icon: '📷', label: '攝影' },
  { icon: '🎵', label: '音樂' },
  { icon: '✈️', label: '旅行' },
  { icon: '🎮', label: '遊戲' },
  { icon: '🎨', label: '創作' },
]

export default function StarNight() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 星夜之間</title>
        <meta name="description" content="歡迎來到 Thanatos 的宇宙空間" />
      </Helmet>

      <OpeningAnimation />
      <Navbar />

      <main className="sn-main">
        {/* Live2D + Chat */}
        <Live2DCanvas />
        <ChatPanel />

        {/* ── Hero ── */}
        <section className="sn-hero" id="hero">
          <div className="sn-hero-inner">
            <div className="sn-avatar-wrap">
              <img src="/images/avatar.png" alt="Thanatos avatar" className="sn-avatar" />
              <div className="sn-avatar-ring" />
            </div>
            <div className="sn-hero-text">
              <p className="sn-greeting">こんにちは、I'm</p>
              <h1 className="sn-name">Thanatos<span className="sn-name-accent">Jun</span></h1>
              <div className="sn-tags">
                {['Developer', 'Creator', 'Explorer'].map(t => (
                  <span key={t} className="sn-tag">{t}</span>
                ))}
              </div>
              <div className="sn-hero-cta">
                <a href="#projects" className="sn-btn-primary">查看作品</a>
                <a href="#contact" className="sn-btn-ghost">聯絡我</a>
              </div>
            </div>
          </div>
          <div className="sn-scroll-hint">
            <span />
            <span />
            <span />
          </div>
        </section>

        {/* ── Star Map Navigation ── */}
        <StarMap />

        {/* ── About ── */}
        <section className="sn-section" id="about">
          <div className="sn-section-inner">
            <h2 className="sn-section-title">
              <span className="sn-section-en">About</span>
              <span className="sn-section-jp">自己紹介</span>
            </h2>
            <p className="sn-about-tagline">
              用鏡頭記錄旅途，用耳朵收藏故事，用身體感受世界。
            </p>
            <div className="sn-interests">
              {interests.map(it => (
                <div key={it.label} className="sn-interest-chip">
                  <span>{it.icon}</span>
                  <span>{it.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section className="sn-section" id="projects">
          <div className="sn-section-inner">
            <h2 className="sn-section-title">
              <span className="sn-section-en">Projects</span>
              <span className="sn-section-jp">作品集</span>
            </h2>
            <div className="sn-projects-grid">
              {projects.map(p => (
                <article key={p.id} className="sn-project-card">
                  <div className="sn-project-img-wrap">
                    <img src={p.cover} alt={p.title} className="sn-project-img" />
                    <div className="sn-project-overlay">
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sn-project-link-btn"
                      >
                        查看專案 →
                      </a>
                    </div>
                  </div>
                  <div className="sn-project-body">
                    <h3 className="sn-project-title">{p.title}</h3>
                    <p className="sn-project-jp">{p.titleJp}</p>
                    <p className="sn-project-desc">{p.desc}</p>
                    <div className="sn-project-tags">
                      {p.tags.map(t => (
                        <span key={t} className="sn-project-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Showreel ── */}
        <section className="sn-section sn-section-dark" id="showreel">
          <div className="sn-section-inner">
            <h2 className="sn-section-title">
              <span className="sn-section-en">Showreel</span>
              <span className="sn-section-jp">映像作品</span>
            </h2>
            <div className="sn-video-wrap">
              <video
                className="sn-video"
                src="/video/HalloweenCity_Simpe.mp4"
                controls
                playsInline
                preload="metadata"
              />
            </div>
            <p className="sn-video-caption">Halloween City — Motion Graphics Demo</p>
          </div>
        </section>

        {/* ── Poetry ── */}
        <section className="sn-section" id="poetry">
          <div className="sn-section-inner">
            <h2 className="sn-section-title">
              <span className="sn-section-en">Poetry</span>
              <span className="sn-section-jp">詩作</span>
            </h2>
            <div className="sn-poems-grid">
              {poems.map(poem => (
                <article key={poem.id} className="sn-poem-card">
                  <div className="sn-poem-img-wrap">
                    <img src={poem.img} alt={poem.title} className="sn-poem-img" />
                  </div>
                  <div className="sn-poem-body">
                    <h3 className="sn-poem-title">{poem.title}</h3>
                    <p className="sn-poem-jp">{poem.titleJp}</p>
                    <div className="sn-poem-lines">
                      {poem.lines.map((l, i) => (
                        <p key={i}>{l}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="sn-section sn-section-dark" id="contact">
          <div className="sn-section-inner sn-contact-inner">
            <h2 className="sn-section-title">
              <span className="sn-section-en">Contact</span>
              <span className="sn-section-jp">連絡先</span>
            </h2>
            <p className="sn-contact-desc">歡迎交流合作，或只是打個招呼 👋</p>
            <div className="sn-contact-links">
              <a
                href="https://github.com/ThanatosJun"
                target="_blank"
                rel="noopener noreferrer"
                className="sn-contact-card"
              >
                <span className="sn-contact-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </span>
                <span>GitHub</span>
              </a>
              <a
                href="https://www.instagram.com/thanatos_jun"
                target="_blank"
                rel="noopener noreferrer"
                className="sn-contact-card"
              >
                <span className="sn-contact-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </span>
                <span>Instagram</span>
              </a>
              <a
                href="mailto:thanatosjun@gmail.com"
                className="sn-contact-card"
              >
                <span className="sn-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span>Email</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="sn-footer">
          <span>© 2026 Thanatos</span>
          <span className="sn-footer-sep">·</span>
          <span>Built with <span className="sn-footer-star">✦</span></span>
        </footer>
      </main>
    </>
  )
}
