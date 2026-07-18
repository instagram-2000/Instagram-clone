import { useEffect, useState } from 'react'
import { subscribeHospital } from '../firebase/hospitals'
import Spinner from '../components/common/Spinner'
import TenantNotFound from './TenantNotFound'
import Header from '../components/hospital/Header'
import HeroSection from '../components/hospital/HeroSection'
import SectionRenderer from '../components/hospital/SectionRenderer'
import Footer from '../components/hospital/Footer'

function HospitalLandingPage({ slug }) {
  const [config, setConfig] = useState(undefined)

  // Live listener, not a one-time cached fetch — a superadmin change (e.g.
  // toggling a content section on) shows up here immediately, including in
  // tabs already open, instead of waiting out a stale local cache.
  useEffect(() => subscribeHospital(slug, setConfig), [slug])

  useEffect(() => {
    if (config?.title) document.title = config.title
  }, [config?.title])

  if (config === undefined) return <Spinner />
  if (!config) return <TenantNotFound slug={slug} />

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
