import { apiClient } from "@/lib/apiClient/apiClient";

export class EntriesLinkService {
    public static async linkWithGoal({ goalId, ...dto }: LinkEntryWithGoalRequestDto & { goalId: string }) {
        await apiClient.post(`/goal/${goalId}/entry`, dto);
    }

    public static async unlinkFromGoal({ entryId, goalId }: { entryId: string; goalId: string }) {
        await apiClient.delete(`/goal/${goalId}/entry/${entryId}`);
    }
}
