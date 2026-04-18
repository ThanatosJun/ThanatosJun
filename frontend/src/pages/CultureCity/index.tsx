import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import SpacePlaceholder from '../../components/layout/SpacePlaceholder'

export default function CultureCity() {
  return (
    <>
      <Helmet>
        <title>ThanatosJun — 文明之城</title>
      </Helmet>
      <Navbar />
      <SpacePlaceholder spaceName="文明之城" />
    </>
  )
}
