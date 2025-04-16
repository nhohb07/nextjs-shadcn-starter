import data from "@/app/data.json";
import { ChartAreaInteractive } from "@/app/(app)/(auth)/components/chart-area-interactive";
import { SectionCards } from "@/app/(app)/(auth)/components/section-cards";
import { DataTable } from "@/app/(app)/(auth)/components/data-table";

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  );
}
