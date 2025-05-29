import InitializeQuotesDb from "../components/initialize-quotes-db"

export default function SetupQuotesTablePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Setup Quotes Database</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <InitializeQuotesDb />
      </div>
    </div>
  )
}
