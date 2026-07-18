// Dummy tenant configs used to seed Firestore for local/dev testing.
// Visit with ?tenant=abc or ?tenant=citycare on localhost, or via
// abc.localhost:5173 / citycare.localhost:5173 once dev server allows it.
export const dummyHospitals = {
  abc: {
    title: 'Sunrise Multispeciality Hospital',
    branding: {
      logos: {
        bgImage: 'https://picsum.photos/seed/sunrise-hospital/1600/900',
        smallLogo: 'https://picsum.photos/seed/sunrise-logo/100/100',
      },
      primaryColor: '#0ea5e9',
      secondColor: '#0f172a',
    },
    optionals: {
      services: {
        enabled: 'on',
        orderNumber: 1,
        items: [
          { title: 'Emergency Care', description: '24/7 emergency response team.', icon: '🚑' },
          { title: 'Diagnostics', description: 'On-site labs with same-day results.', icon: '🧪' },
          { title: 'Surgery', description: 'Advanced minimally invasive surgery.', icon: '🩺' },
        ],
      },
      departments: {
        enabled: 'on',
        orderNumber: 2,
        items: [
          { name: 'Cardiology', description: 'Heart care and diagnostics.' },
          { name: 'Orthopedics', description: 'Bone and joint treatment.' },
          { name: 'Pediatrics', description: 'Care for infants and children.' },
          { name: 'Neurology', description: 'Brain and nervous system care.' },
        ],
      },
      doctors: {
        enabled: 'on',
        orderNumber: 3,
        items: [
          { name: 'Dr. Aisha Rao', specialization: 'Cardiologist', photo: 'https://i.pravatar.cc/150?u=aisha-rao' },
          { name: 'Dr. Kunal Mehta', specialization: 'Orthopedic Surgeon', photo: 'https://i.pravatar.cc/150?u=kunal-mehta' },
          { name: 'Dr. Priya Nair', specialization: 'Pediatrician', photo: 'https://i.pravatar.cc/150?u=priya-nair' },
        ],
      },
      testimonials: {
        enabled: 'on',
        orderNumber: 4,
        items: [
          { name: 'Ramesh Iyer', message: 'Excellent care and friendly staff.', rating: 5 },
          { name: 'Sneha Patil', message: 'Quick appointment booking, no waiting.', rating: 4 },
        ],
      },
    },
    footer: {
      address: '221 Sunrise Avenue, Pune, MH',
      phone: '+91 98765 43210',
      email: 'contact@sunrisehospital.example',
    },
  },

  citycare: {
    title: 'CityCare Hospital',
    branding: {
      logos: {
        bgImage: 'https://picsum.photos/seed/citycare-hospital/1600/900',
        smallLogo: 'https://picsum.photos/seed/citycare-logo/100/100',
      },
      primaryColor: '#16a34a',
      secondColor: '#052e16',
    },
    optionals: {
      services: {
        enabled: 'on',
        orderNumber: 1,
        items: [
          { title: 'General Consultation', description: 'Walk-in and scheduled visits.', icon: '🩹' },
          { title: 'Pharmacy', description: 'In-house pharmacy, open daily.', icon: '💊' },
        ],
      },
      departments: {
        enabled: 'on',
        orderNumber: 2,
        items: [
          { name: 'General Medicine', description: 'Everyday health concerns.' },
          { name: 'Dermatology', description: 'Skin and hair treatment.' },
          { name: 'ENT', description: 'Ear, nose and throat care.' },
        ],
      },
      doctors: {
        enabled: 'off',
        orderNumber: 3,
        items: [],
      },
      testimonials: {
        enabled: 'on',
        orderNumber: 4,
        items: [
          { name: 'Faisal Sheikh', message: 'CityCare made booking so easy.', rating: 5 },
        ],
      },
    },
    footer: {
      address: '48 Market Road, Bengaluru, KA',
      phone: '+91 91234 56789',
      email: 'hello@citycarehospital.example',
    },
  },
}
