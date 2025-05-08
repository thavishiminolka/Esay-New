
import { AppSidebar } from "./components/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [papers, setPapers] = useState<{ id: string; topic: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Utility function to format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchPapersAndLeaderboard = async () => {
      try {
        setError(null);
        const papersResponse = await fetch("http://localhost:5000/api/exams", {
          credentials: "include",
        });

        if (!papersResponse.ok) {
          throw new Error(`Failed to fetch papers: ${papersResponse.status} ${papersResponse.statusText}`);
        }

        const papersData = await papersResponse.json();
        console.log("Fetched papers data:", papersData);

        if (!Array.isArray(papersData)) {
          throw new Error("Expected an array of exams, but received: " + JSON.stringify(papersData));
        }

        const paperList = papersData.map((exam: any) => ({
          id: exam._id,
          topic: exam.topic,
        }));
        setPapers(paperList);

        if (paperList.length > 0 && !selectedPaper) {
          setSelectedPaper(paperList[0].id);
        }
      } catch (error: any) {
        console.error("Error fetching papers:", error);
        setError(error.message || "Failed to fetch papers");
      }
    };
    fetchPapersAndLeaderboard();
  }, []);

  useEffect(() => {
    if (selectedPaper) {
      const fetchLeaderboard = async () => {
        try {
          setError(null);
          console.log("Fetching leaderboard for examId:", selectedPaper);
          const response = await fetch(`http://localhost:5000/api/results/leaderboard?examId=${selectedPaper}`, {
            credentials: "include",
          });

          console.log("Leaderboard response status:", response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Fetched leaderboard data:", data);

          if (!Array.isArray(data)) {
            throw new Error("Expected an array of leaderboard data, but received: " + JSON.stringify(data));
          }

          setLeaderboardData(data);
        } catch (error: any) {
          console.error("Error fetching leaderboard:", error);
          setError(error.message || "Failed to fetch leaderboard");
        }
      };
      fetchLeaderboard();
    }
  }, [selectedPaper]);

  const topWinners = leaderboardData.slice(0, 3).map((winner, index) => ({
    position: winner.rank,
    name: winner.name || "Unknown",
    lName: winner.lName || "",
    timeTaken: formatTime(winner.timeTaken || 0),
    medal: index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉",
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm sm:px-6">
          <div className="flex items-center gap-4 sm:gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-custom-blue1 jaini">
              Leaderboard
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-6 pr-2 sm:pr-7">
            <span className="text-custom-blue2 text-sm sm:text-base hidden sm:inline">
              Select Paper
            </span>
            <select
              value={selectedPaper || ""}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="p-2 border rounded bg-white text-custom-blue2 text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="" disabled>Select a paper</option>
              {papers.map((paper) => (
                <option key={paper.id} value={paper.id}>
                  {paper.topic}
                </option>
              ))}
            </select>
          </div>
        </header>
        <main className="overflow-y-auto p-4 sm:p-6 mt-6 sm:mt-10 mx-2 sm:mx-10 rounded-2xl bg-white flex-1">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="text-center text-red-500 py-4 text-sm sm:text-base">
                {error}
              </div>
            )}
            {selectedPaper && !error && leaderboardData.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
                {topWinners.map((winner) => (
                  <div
                    key={winner.position}
                    className="bg-custom-blue5 rounded-md px-4 py-2 flex items-center gap-2 ubuntu w-full sm:w-auto"
                  >
                    <span className="text-xl sm:text-2xl">{winner.medal}</span>
                    <span className="font-medium text-black text-sm sm:text-base">
                      {winner.name} {winner.lName} ({winner.timeTaken})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedPaper && !error && (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-4 text-black font-semibold p-2 ubuntu text-sm sm:text-base min-w-[600px]">
                  <div className="text-left">Rank</div>
                  <div className="text-center">Username</div>
                  <div className="text-center">Time Taken</div>
                  <div className="text-right">Percentage Score</div>
                </div>
                <div className="space-y-2 p-0 min-w-[600px]">
                  {leaderboardData.length === 0 ? (
                    <div className="text-center text-gray-500 py-4 text-sm sm:text-base">
                      No results available for this paper.
                    </div>
                  ) : (
                    leaderboardData.map((entry) => (
                      <div
                        key={`${entry.userId}-${entry.rank}`}
                        className="grid grid-cols-4 bg-custom-blue5 p-4 rounded-md text-black ubuntu text-sm sm:text-base"
                      >
                        <div>{entry.rank}</div>
                        <div className="text-center">{entry.name || "Unknown"} {entry.lName}</div>
                        <div className="text-center">{formatTime(entry.timeTaken || 0)}</div>
                        <div className="text-right">{entry.totalScore}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {!selectedPaper && !error && (
              <div className="text-center text-gray-500 py-8 text-sm sm:text-base">
                Please select a paper to view the leaderboard.
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}