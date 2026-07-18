import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHospitalConfig } from '../redux/slices/hospitalSlice'
import Spinner from '../components/common/Spinner'
import TenantNotFound from './TenantNotFound'
import Header from '../components/hospital/Header'
import HeroSection from '../components/hospital/HeroSection'
import SectionRenderer from '../components/hospital/SectionRenderer'
import Footer from '../components/hospital/Footer'

function HospitalLandingPage({ slug }) {
  const dispatch = useDispatch()
  const { config, status } = useSelector((state) => state.hospital)

  useEffect(() => {
    dispatch(fetchHospitalConfig(slug))
  }, [dispatch, slug])

  useEffect(() => {
    if (config?.title) document.title = config.title
  }, [config?.title])

  if (status === 'loading' || status === 'idle') return <Spinner />
  if (status === 'failed' || !config) return <TenantNotFound slug={slug} />

  return (
    <div
      style={{
        '--tenant-primary': config.branding?.primaryColor || '#0ea5e9',
        '--tenant-secondary': config.branding?.secondColor || '#0f172a',
      }}
    >
      <Header config={config} />
      <HeroSection config={config} />
      <SectionRenderer optionals={config.optionals} />
      <Footer config={config} />
    </div>
  )
}

export default HospitalLandingPage
