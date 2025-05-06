// import { Link, useNavigate } from "react-router-dom";
// import { AppSidebar } from "./components/sidebar";
// import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { useEffect, useState } from "react";

// export default function LeaderboardPage() {
//   const navigate = useNavigate();
//   const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
//   const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
//   const [papers, setPapers] = useState<{ id: string; topic: string }[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPapersAndLeaderboard = async () => {
//       try {
//         setError(null);
//         const papersResponse = await fetch("http://localhost:5000/api/exams", {
//           credentials: "include",
//         });

//         if (!papersResponse.ok) {
//           throw new Error(`Failed to fetch papers: ${papersResponse.status} ${papersResponse.statusText}`);
//         }

//         const papersData = await papersResponse.json();
//         console.log("Fetched papers data:", papersData);

//         if (!Array.isArray(papersData)) {
//           throw new Error("Expected an array of exams, but received: " + JSON.stringify(papersData));
//         }

//         const paperList = papersData.map((exam: any) => ({
//           id: exam._id,
//           topic: exam.topic,
//         }));
//         setPapers(paperList);

//         if (paperList.length > 0 && !selectedPaper) {
//           setSelectedPaper(paperList[0].id);
//         }
//       } catch (error: any) {
//         console.error("Error fetching papers:", error);
//         setError(error.message || "Failed to fetch papers");
//       }
//     };
//     fetchPapersAndLeaderboard();
//   }, []);

//   useEffect(() => {
//     if (selectedPaper) {
//       const fetchLeaderboard = async () => {
//         try {
//           setError(null);
//           console.log("Fetching leaderboard for examId:", selectedPaper);
//           const response = await fetch(`http://localhost:5000/api/results/leaderboard?examId=${selectedPaper}`, {
//             credentials: "include",
//           });

//           console.log("Leaderboard response status:", response.status, response.statusText);
//           if (!response.ok) {
//             throw new Error(`Failed to fetch leaderboard: ${response.status} ${response.statusText}`);
//           }

//           const data = await response.json();
//           console.log("Fetched leaderboard data:", data);

//           if (!Array.isArray(data)) {
//             throw new Error("Expected an array of leaderboard data, but received: " + JSON.stringify(data));
//           }

//           setLeaderboardData(data);
//         } catch (error: any) {
//           console.error("Error fetching leaderboard:", error);
//           setError(error.message || "Failed to fetch leaderboard");
//         }
//       };
//       fetchLeaderboard();
//     }
//   }, [selectedPaper]);

//   const topWinners = leaderboardData.slice(0, 3).map((winner, index) => ({
//     position: winner.rank,
//     name: winner.username || `User${winner.userId.slice(-4)}`,
//     medal: index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉",
//   }));

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="bg-main flex flex-col">
//         <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-12">
//             <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
//             <h1 className="text-4xl text-custom-blue1 jaini">Leaderboard</h1>
//           </div>
//           <div className="flex items-center gap-6 pr-7">
//             <span className="text-custom-blue2">Select Paper</span>
//             <select
//               value={selectedPaper || ""}
//               onChange={(e) => setSelectedPaper(e.target.value)}
//               className="p-2 border rounded bg-white text-custom-blue2"
//             >
//               <option value="" disabled>Select a paper</option>
//               {papers.map((paper) => (
//                 <option key={paper.id} value={paper.id}>
//                   {paper.topic}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </header>
//         <main className="overflow-y-auto p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
//           <div className="max-w-5xl mx-auto">
//             {error && (
//               <div className="text-center text-red-500 py-4">
//                 {error}
//               </div>
//             )}
//             {selectedPaper && !error && leaderboardData.length > 0 && (
//               <div className="flex justify-center gap-8 mb-8">
//                 {topWinners.map((winner) => (
//                   <div
//                     key={winner.position}
//                     className="bg-custom-blue5 rounded-md px-6 py-2 flex items-center gap-2 ubuntu"
//                   >
//                     <span className="text-2xl">{winner.medal}</span>
//                     <span className="font-medium text-black">{winner.name}</span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {selectedPaper && !error && (
//               <div>
//                 <div className="grid grid-cols-3 text-black font-semibold p-2 ubuntu">
//                   <div className="text-left">Rank</div>
//                   <div className="text-center">Username</div>
//                   <div className="text-right">Total Score</div>
//                 </div>
//                 <div className="space-y-2 p-0">
//                   {leaderboardData.length === 0 ? (
//                     <div className="text-center text-gray-500 py-4">
//                       No results available for this paper.
//                     </div>
//                   ) : (
//                     leaderboardData.map((entry) => (
//                       <div
//                         key={`${entry.userId}-${entry.rank}`}
//                         className="grid grid-cols-3 bg-custom-blue5 p-4 rounded-md text-black ubuntu"
//                       >
//                         <div>{entry.rank}</div>
//                         <div className="text-center">{entry.name || `User${entry.userId.slice(-4)}`}</div>
//                         <div className="text-right">{entry.totalScore}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             )}
//             {!selectedPaper && !error && (
//               <div className="text-center text-gray-500 py-8">
//                 Please select a paper to view the leaderboard.
//               </div>
//             )}
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }





















import { AppSidebar } from "./components/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [papers, setPapers] = useState<{ id: string; topic: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    name: winner.name || "Unknown", // Use email instead of username
    medal: index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉",
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-main flex flex-col">
        <header className="flex h-16 items-center justify-between bg-main px-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-12">
            <SidebarTrigger className="text-custom-blue2 cursor-pointer" />
            <h1 className="text-4xl text-custom-blue1 jaini">Leaderboard</h1>
          </div>
          <div className="flex items-center gap-6 pr-7">
            <span className="text-custom-blue2">Select Paper</span>
            <select
              value={selectedPaper || ""}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="p-2 border rounded bg-white text-custom-blue2"
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
        <main className="overflow-y-auto p-6 mt-10 ml-10 mr-10 rounded-2xl bg-white">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="text-center text-red-500 py-4">
                {error}
              </div>
            )}
            {selectedPaper && !error && leaderboardData.length > 0 && (
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
            )}

            {selectedPaper && !error && (
              <div>
                <div className="grid grid-cols-3 text-black font-semibold p-2 ubuntu">
                  <div className="text-left">Rank</div>
                  <div className="text-center">Email</div> {/* Changed from Username to Email */}
                  <div className="text-right">Total Score</div>
                </div>
                <div className="space-y-2 p-0">
                  {leaderboardData.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      No results available for this paper.
                    </div>
                  ) : (
                    leaderboardData.map((entry) => (
                      <div
                        key={`${entry.userId}-${entry.rank}`}
                        className="grid grid-cols-3 bg-custom-blue5 p-4 rounded-md text-black ubuntu"
                      >
                        <div>{entry.rank}</div>
                        <div className="text-center">{entry.name|| "Unknown"}</div> {/* Use email instead of name */}
                        <div className="text-right">{entry.totalScore}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {!selectedPaper && !error && (
              <div className="text-center text-gray-500 py-8">
                Please select a paper to view the leaderboard.
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}