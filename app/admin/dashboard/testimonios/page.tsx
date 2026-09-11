import { TestimonialsTable } from '@/features/testimonials/components/TestimonialsTable'
import { getTestimonials } from '@/features/testimonials/actions/testimonials'

export default async function TestimoniosPage() {
  const testimonials = await getTestimonials()
  return <TestimonialsTable initialTestimonials={testimonials ?? []} />
}