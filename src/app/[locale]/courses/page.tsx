import CoursesClient from "@/components/courses/CoursesClient";

export default function CoursesPage({ params }: { params: { locale: string } }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <CoursesClient />
    </div>
  );
}
