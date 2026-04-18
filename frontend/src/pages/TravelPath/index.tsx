import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import SpacePlaceholder from '../../components/layout/SpacePlaceholder'

export default function TravelPath() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 旅遊之路</title>
      </Helmet>
      <Navbar />
      <SpacePlaceholder spaceName="旅遊之路" />
    </>
  )
}
