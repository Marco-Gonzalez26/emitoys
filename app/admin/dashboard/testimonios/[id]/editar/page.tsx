import { notFound } from 'next/navigation'
import { getTestimonialById } from '@/features/testimonials/actions/testimonials'
import { TestimonialForm } from '@/features/testimonials/components/TestimonialForm'

export default async function EditarTestimonioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)
  if (!testimonial) notFound()

  return (
    <div className='px-6 py-8 md:px-10 flex justify-center w-full'>
      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}