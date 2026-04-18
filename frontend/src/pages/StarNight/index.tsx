import { Helmet } from 'react-helmet-async'
import OpeningAnimation from '../../components/opening/OpeningAnimation'
import Live2DCanvas from '../../components/live2d/Live2DCanvas'
import ChatPanel from '../../components/chat/ChatPanel'
import Navbar from '../../components/layout/Navbar'

export default function StarNight() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 星夜之間</title>
        <meta name="description" content="歡迎來到 Thanatos 的宇宙空間" />
      </Helmet>
      <OpeningAnimation />
      <Navbar />
      <main>
        <Live2DCanvas />
        <ChatPanel />
      </main>
    </>
  )
}
