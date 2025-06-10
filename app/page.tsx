import FinanceCalendar from "../finance-calendar"

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Spending Tracker</h1>
          <p className="text-gray-600">Track your daily expenses and stay within budget</p>
        </div>
        <FinanceCalendar />
      </div>
    </main>
  )
}
