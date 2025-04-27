import { Link } from "react-router-dom"
import { AppSidebar } from "./components/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function LeaderboardPage() {
  // Top 3 winners data
  const topWinners = [
    { position: 1, name: "Sophia Kim", medal: "🏆" },
    { position: 2, name: "Sophia Kim", medal: "🥈" },
    { position: 3, name: "Sophia Kim", medal: "🥉" }
  ]

  // Leaderboard data for positions 4-11
  const leaderboardData = Array(8).fill({
    username: "Hiroshi Tanaka",
    score: "256"
  }).map((item, index) => ({
    ...item,
    rank: index + 4
  }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
      <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className=" text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl  text-custom-blue1 jaini">Leaderboard</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Username</span>
            <Link to="/profile" className="cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gray-300"/>
            </Link>
          </div>
        </header>
        <main className="overflow-y-auto p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Top 3 Winners */}
            <div className="flex justify-center gap-8 mb-8">
              {topWinners.map((winner) => (
                <div 
                  key={winner.position}
                  className="bg-custom-blue5 rounded-md px-6 py-2 flex items-center gap-2 ubuntu"
                >
                  <span className="text-2xl">{winner.medal}</span>
                  <span className="font-medium text-black">{winner.name}</span>
                </div>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div>
              <div className="grid grid-cols-3 text-black font-semibold p-2 ubuntu">
                <div className="text-left">Rank</div>
                <div className="text-center">Username</div>
                <div className="text-right">Total Score</div>
              </div>
              
              <div className="space-y-2 p-0">
                {leaderboardData.map((entry) => (
                  <div 
                    key={entry.rank}
                    className="grid grid-cols-3 bg-custom-blue5 p-4 rounded-md text-black ubuntu"
                  >
                    <div>{entry.rank}</div>
                    <div className="text-center">{entry.username}</div>
                    <div className="text-right">{entry.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}