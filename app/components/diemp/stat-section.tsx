import { canJudgeEvidence, type User } from "@/lib/diemp/access"
import { documentOwners, listImpacts, storedDecisions, storedTasks } from "@/lib/diemp/db"
import { repairImpacts } from "@/lib/diemp/tasir"
import { boardCards, decisionViews } from "@/lib/diemp/stat-math"
import { DecisionImpacts } from "@/app/components/diemp/decision-impact"
import { StatBoard } from "@/app/components/diemp/stat-board"

export async function StatSection({ user, decisionsOnly = false }: { user: User; decisionsOnly?: boolean }) {
  await repairImpacts()
  const impacts = await listImpacts()
  const owners = await documentOwners()
  const tasks = await storedTasks()
  let decisions = await storedDecisions()
  if (user.rol === "koordinator" && user.tashkilot) {
    decisions = decisions.filter((decision) => {
      const own = owners.get(decision.hujjat) === user.id
      const organ = tasks.some((task) => task.qaror === decision.raqam && task.tashkilot === user.tashkilot)
      return own || organ
    })
  }
  const views = decisionViews(decisions.map((decision) => ({ raqam: decision.raqam, nomi: decision.nomi, sana: decision.sana })), impacts)
  return (
    <div className="flex flex-col gap-6">
      {decisionsOnly ? null : <StatBoard cards={boardCards(impacts)} />}
      <DecisionImpacts decisions={views} canJudge={canJudgeEvidence(user.rol)} />
    </div>
  )
}
