import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import SpacePlaceholder from '../../components/layout/SpacePlaceholder'

export default function TechCity() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 科技之都</title>
      </Helmet>
      <Navbar />
      <SpacePlaceholder spaceName="科技之都" />
    </>
  )
}
