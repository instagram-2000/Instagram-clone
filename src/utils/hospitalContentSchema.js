// Field schema for each editable content section on a hospital's public
// landing page. Drives the generic ContentSectionEditor so services,
// departments, doctors and testimonials share one implementation instead
// of four near-identical editors.
export const CONTENT_SECTIONS = [
  {
    key: 'services',
    label: 'Services',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'icon', label: 'Icon (emoji)', type: 'text' },
    ],
  },
  {
    key: 'departments',
    label: 'Departments',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'text' },
    ],
  },
  {
    key: 'doctors',
    label: 'Doctors',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'specialization', label: 'Specialization', type: 'text' },
      { name: 'photo', label: 'Photo URL', type: 'url' },
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'message', label: 'Message', type: 'text' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
    ],
  },
]
