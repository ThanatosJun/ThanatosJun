import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import './techcity.css'

const LANG_COLORS: Record<string, string> = {
  'Jupyter Notebook': '#DA5B0B',
  'Python':           '#3572A5',
  'Vue':              '#41B883',
  'ShaderLab':        '#8A4FFF',
  'HTML':             '#E34C26',
  'JavaScript':       '#F1E05A',
  'TypeScript':       '#3178C6',
  'CSS':              '#563D7C',
}

const REPOS = [
  {
    name: 'Anime_Prediction',
    desc: '利用機器學習技術進行動漫相關預測分析。',
    url: 'https://github.com/ThanatosJun/Anime_Prediction',
    lang: 'Jupyter Notebook',
    updated: '2026-05',
  },
  {
    name: 'Kaggle-TextPolarity',
    desc: 'Kaggle 競賽：文字情感極性分類任務。',
    url: 'https://github.com/ThanatosJun/Kaggle-TextPolarity',
    lang: 'Jupyter Notebook',
    updated: '2026-05',
  },
  {
    name: 'Kaggle-BoyGirl-TeamBD',
    desc: 'Kaggle 競賽：男女性別影像分類（團隊 BD）。',
    url: 'https://github.com/ThanatosJun/Kaggle-BoyGirl-TeamBD',
    lang: 'Jupyter Notebook',
    updated: '2026-03',
  },
  {
    name: 'Anime-Imprimatura',
    desc: '利用影像處理技術分析動漫作品底色風格，重現特定動畫師的上色層次。',
    url: 'https://github.com/ThanatosJun/Anime-Imprimatura',
    lang: 'Python',
    updated: '2025-10',
  },
  {
    name: 'CL_Graduated',
    desc: '以畢業為主題的互動式視覺作品，結合粒子動效與角色演出。',
    url: 'https://github.com/ThanatosJun/CL_Graduated',
    lang: 'Vue',
    updated: '2025-05',
  },
  {
    name: '2025Unity-class0-FlyShoot',
    desc: '2025 赫綵 Unity 課程：飛機彈幕射擊遊戲，含自定義敵人 AI 與 BOSS 機制。',
    url: 'https://github.com/ThanatosJun/2025Unity-class0-FlyShoot',
    lang: 'ShaderLab',
    updated: '2025-04',
  },
  {
    name: 'Vortex-Verdict',
    desc: 'Vue 互動式網頁專案。',
    url: 'https://github.com/ThanatosJun/Vortex-Verdict',
    lang: 'Vue',
    updated: '2025-03',
  },
  {
    name: 'CCSD2025_selfdemo',
    desc: 'CCSD 2025 個人展示頁面。',
    url: 'https://github.com/ThanatosJun/CCSD2025_selfdemo',
    lang: 'HTML',
    updated: '2025-03',
  },
  {
    name: '2DColorGAN',
    desc: '基於 GAN 的 2D 自動上色系統，將線稿轉換為完整彩色插圖。',
    url: 'https://github.com/ThanatosJun/2DColorGAN',
    lang: '',
    updated: '2025-03',
  },
  {
    name: 'Les_mots',
    desc: '法語文字交換學習工具。',
    url: 'https://github.com/ThanatosJun/Les_mots',
    lang: 'Python',
    updated: '2025-02',
  },
  {
    name: '2023SA_Interface',
    desc: '系統分析課程介面設計專案。',
    url: 'https://github.com/ThanatosJun/2023SA_Interface',
    lang: 'HTML',
    updated: '2023-12',
  },
  {
    name: 'ThanatosJun.github.io',
    desc: '個人 GitHub Pages 靜態網站。',
    url: 'https://github.com/ThanatosJun/ThanatosJun.github.io',
    lang: 'JavaScript',
    updated: '2023-05',
  },
  {
    name: 'flask_20230503',
    desc: 'Flask 後端練習專案。',
    url: 'https://github.com/ThanatosJun/flask_20230503',
    lang: 'HTML',
    updated: '2023-05',
  },
  {
    name: 'PythonWork',
    desc: 'Python 練習與作業集。',
    url: 'https://github.com/ThanatosJun/PythonWork',
    lang: '',
    updated: '2023-02',
  },
]

export default function TechCity() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 科技之都</title>
      </Helmet>
      <Navbar />

      <div className="tc-page">
        <div className="tc-inner">
          <header className="tc-header">
            <span className="tc-title-en">Repositories</span>
            <span className="tc-title-jp">リポジトリ一覧</span>
            <div className="tc-divider" />
            <p className="tc-subtitle">
              所有公開儲存庫 ·{' '}
              <a
                href="https://github.com/ThanatosJun?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
              >
                在 GitHub 上查看全部 →
              </a>
            </p>
          </header>

          <div className="tc-grid">
            {REPOS.map(repo => (
              <a
                key={repo.name}
                className="tc-card"
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="tc-card-name">{repo.name}</span>
                <span className="tc-card-desc">{repo.desc}</span>
                <div className="tc-card-footer">
                  {repo.lang && (
                    <>
                      <span
                        className="tc-lang-dot"
                        style={{ background: LANG_COLORS[repo.lang] ?? '#8b949e' }}
                      />
                      <span className="tc-lang-label">{repo.lang}</span>
                    </>
                  )}
                  <span className="tc-updated">{repo.updated}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
