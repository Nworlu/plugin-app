import { apiClient } from "@/utils/api-client";
import type { Collaborator, InviteCollaboratorPayload } from "./types";

export const collaboratorsApi = {
  /** List all co-organizers for the authenticated organizer */
  getAll: () => apiClient.get<Collaborator[]>("collaborators/", true),

  /** Invite a new co-organizer by email */
  invite: (payload: InviteCollaboratorPayload) =>
    apiClient.post<Collaborator>("collaborators/invite", payload, true),

  /** Remove a collaborator */
  remove: (collaboratorId: string) =>
    apiClient.delete<void>(`collaborators/${collaboratorId}`, true),
};
