import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import OpeningAnimation from '../../components/opening/OpeningAnimation'
import StarMap from '../../components/starmap/StarMap'
import ChatPanel from '../../components/chat/ChatPanel'
import Navbar from '../../components/layout/Navbar'
import BusinessCard from '../../components/BusinessCard/BusinessCard'
import { asset } from '../../utils/asset'
import './starnight.css'

const projects = [
  {
    id: 'anime-imprimatura',
    title: 'Anime Imprimatura',
    titleJp: '動漫色彩研究',
    desc: '利用影像處理技術分析動漫作品的底色風格，重現特定動畫師的上色層次。',
    cover: asset('images/anime-imprimatura-cover.png'),
    link: 'https://github.com/ThanatosJun/Anime-Imprimatura',
    tags: ['Image Processing', 'Python', 'Node.js', 'YOLOv8', 'TWCC'],
  },
  {
    id: 'cl-graduated',
    title: 'CL Graduated',
    titleJp: '畢業',
    desc: '以畢業為主題設計的互動式視覺作品，結合粒子動效與角色演出呈現告別情感。',
    cover: asset('images/cl-graduated-cover.png'),
    link: 'https://github.com/ThanatosJun/CL_Graduated',
    tags: ['Graduation Website', 'Vue.js', 'Laravel', 'TWCC'],
  },
  {
    id: 'love-game',
    title: 'Love Game',
    titleJp: '戀愛遊戲',
    desc: '以戀愛模擬遊戲為靈感的互動作品，融合對話系統與分支劇情設計。',
    cover: asset('images/love-game.png'),
    link: 'https://dartpad.dev/?embed=true&run=true&id=24ac5c31c06cfc5ceb54525930e33d41',
    linkLabel: '遊玩遊戲 →',
    tags: ['Game Design', 'Dart', 'Flutter'],
  },
  {
    id: 'flyshoot',
    title: 'FlyShoot',
    titleJp: '飛行射擊',
    desc: '自製的彈幕射擊遊戲，包含自定義敵人 AI、BOSS 機制與音效整合。',
    cover: asset('images/flyshoot-cover.png'),
    link: 'https://github.com/ThanatosJun/2025Unity-class0-FlyShoot',
    linkLabel: 'GitHub →',
    linkAlt: 'https://thanatosjun.itch.io/flyshoot-v1',
    linkAltLabel: 'itch.io →',
    tags: ['Game Development', 'Unity', 'C#'],
  },
  {
    id: '2dcolorgan',
    title: '2D Color GAN',
    titleJp: '上色 GAN',
    desc: '基於 GAN 的 2D 自動上色系統，訓練模型將線稿轉換為完整彩色插圖。',
    cover: asset('images/2dcolorgan-cover.png'),
    link: 'https://github.com/ThanatosJun/2DColorGAN',
    tags: ['2DColorGan', 'CGAN', 'PyTorch'],
  },
]

const interests = [
  { icon: '📷', label: '拍照' },
  { icon: '🎵', label: '聽音樂' },
  { icon: '✈️', label: '旅行' },
  { icon: '🎮', label: '遊戲' },
  { icon: '🎨', label: '創作' },
  { icon: '🎾', label: '網球' },
  { icon: '🔍', label: '其他等待發掘' },
]

export default function StarNight() {
  const [contentVisible, setContentVisible] = useState(false)
  const [showCard, setShowCard] = useState(false)

  useEffect(() => {
    const show = () => setTimeout(() => setContentVisible(true), 900)
    window.addEventListener('app:interaction', show)
    return () => window.removeEventListener('app:interaction', show)
  }, [])

  return (
    <>
      <Helmet>
        <title>ThanatosJun — 星夜之間</title>
        <meta name="description" content="歡迎來到 Thanatos 的宇宙空間" />
      </Helmet>

      <OpeningAnimation />
      <Navbar />
      {showCard && <BusinessCard onClose={() => setShowCard(false)} />}

      <main className={`sn-main${contentVisible ? ' sn-main-visible' : ''}`}>
        <ChatPanel />

        {/* ── Hero ── */}
        <section className="sn-hero" id="hero">
          <div className="sn-hero-inner">
            <div className="sn-avatar-wrap">
              <img src={asset('images/avatar.png')} alt="Thanatos avatar" className="sn-avatar" />
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
                <button className="sn-btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>查看作品</button>
                <button className="sn-btn-ghost"   onClick={() => setShowCard(true)}>名片</button>
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
              <span className="sn-section-jp">自我介紹</span>
            </h2>
            <p className="sn-about-tagline">
              幻想是建構世界的藍圖，而我期望成為具現幻想的一員。
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
                        {('linkLabel' in p ? p.linkLabel : null) ?? '查看專案 →'}
                      </a>
                      {'linkAlt' in p && p.linkAlt && (
                        <a
                          href={p.linkAlt as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sn-project-link-btn sn-project-link-btn--alt"
                        >
                          {('linkAltLabel' in p ? p.linkAltLabel : null) ?? '更多 →'}
                        </a>
                      )}
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
                src={asset('video/HalloweenCity_Simpe.mp4')}
                controls
                playsInline
                preload="metadata"
              />
            </div>
            <p className="sn-video-caption">Halloween City — Motion Graphics Demo</p>
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
