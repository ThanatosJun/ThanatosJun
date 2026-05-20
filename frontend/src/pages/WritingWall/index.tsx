import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import { asset } from '../../utils/asset'
import poemsData from '../../data/poems.json'
import './writingwall.css'

type WritingTab = '新詩' | '小說'

export default function WritingWall() {
  const [activeTab, setActiveTab] = useState<WritingTab>('新詩')

  return (
    <>
      <Helmet>
        <title>ThanatosJun — 書寫之牆</title>
      </Helmet>
      <Navbar />

      <main className="ww-main">
        <header className="ww-header">
          <div className="ww-title">
            <span className="ww-title-en">Writing</span>
            <span className="ww-title-zh">書寫之牆</span>
          </div>

          <div className="ww-tabs">
            {(['新詩', '小說'] as WritingTab[]).map(tab => (
              <button
                key={tab}
                className={`ww-tab${activeTab === tab ? ' ww-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {activeTab === '新詩' && (
          <div className="ww-poems-grid">
            {poemsData.map((poem, pi) => (
              <article key={pi} className="ww-poem-card">
                <div className="ww-poem-img-wrap">
                  <img src={asset(poem.image)} alt={poem.title} className="ww-poem-img" />
                </div>
                <div className="ww-poem-body">
                  <h3 className="ww-poem-title">{poem.title}</h3>
                  <div className="ww-poem-stanzas">
                    {poem.stanzas.map((stanza, si) => (
                      <div
                        key={si}
                        className={`ww-poem-stanza${stanza.indent ? ' ww-poem-stanza--indent' : ''}`}
                      >
                        {stanza.lines.map((line, li) => (
                          <p key={li}>{line}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === '小說' && (
          <div className="ww-empty">
            <p>小說創作籌備中…</p>
          </div>
        )}
      </main>
    </>
  )
}
