import AdvancedDatabaseFixer from "@/app/components/advanced-database-fixer"
import DirectSqlExecutor from "@/app/components/direct-sql-executor"

export default function FixDatabasePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Structure Repair</h1>
      <AdvancedDatabaseFixer />

      <div className="my-10 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Alternative Method</h2>
        <DirectSqlExecutor />
      </div>
    </div>
  )
}
