import NewLaptopForm from "@/components/admin/NewLaptopForm";
import { getLaptopForEdit } from "@/actions/admin";

interface NewLaptopPageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function NewLaptopPage({
  searchParams,
}: NewLaptopPageProps) {
  const params = await searchParams;
  const editId = params.edit?.trim();
  const editResult = editId ? await getLaptopForEdit(editId) : null;
  const initial = editResult?.ok ? editResult.data : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {initial ? "Edit Laptop" : "Add New Laptop"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {initial
            ? "Update specs, images, pricing, and stock status"
            : "Create a listing with specs, multi-image URLs, and TZS pricing"}
        </p>
      </div>
      <NewLaptopForm initial={initial} />
    </div>
  );
}
