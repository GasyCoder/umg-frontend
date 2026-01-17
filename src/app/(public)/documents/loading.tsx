import Container from "@/components/Container";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import SidebarLeft, { SidebarWidget } from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function DocumentsLoading() {
  return (
    <main className="bg-slate-50/60 dark:bg-slate-950">
      <PageHeader
        label="Documents"
        title="Ressources officielles et telechargeables"
        subtitle="Accedez aux documents administratifs et formulaires utiles."
        variant="dark"
      >
        <div className="mt-8 max-w-xl">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <PageLayout
        variant="three-column"
        sidebarLeft={
          <SidebarLeft>
            <SidebarWidget title="Documents">
              <SkeletonText lines={3} />
            </SidebarWidget>
            <SidebarWidget title="Categories">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </SidebarWidget>
          </SidebarLeft>
        }
        sidebarRight={
          <SidebarRight sticky>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-4 w-28" />
              <SkeletonText lines={3} className="mt-4" />
              <Skeleton className="mt-4 h-4 w-32" />
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-4 w-36" />
              <SkeletonText lines={2} className="mt-4" />
              <Skeleton className="mt-4 h-9 w-full rounded-xl" />
            </div>
          </SidebarRight>
        }
      >
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Skeleton className="h-5 w-3/4" />
              <SkeletonText lines={2} className="mt-3" />
              <div className="mt-4 flex items-center gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Skeleton className="h-10 w-56 rounded-xl" />
        </div>
      </PageLayout>
    </main>
  );
}
