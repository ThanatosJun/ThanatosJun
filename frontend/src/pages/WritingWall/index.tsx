import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import SpacePlaceholder from '../../components/layout/SpacePlaceholder'

export default function WritingWall() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 書寫之牆</title>
      </Helmet>
      <Navbar />
      <SpacePlaceholder spaceName="書寫之牆" />
    </>
  )
}
