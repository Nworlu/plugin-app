import { collaboratorsApi } from "@/utils/api/collaborators";
import type { InviteCollaboratorPayload } from "@/utils/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const collaboratorKeys = {
  all: ["collaborators"] as const,
};

export function useCollaborators() {
  return useQuery({
    queryKey: collaboratorKeys.all,
    queryFn: () => collaboratorsApi.getAll(),
  });
}

export function useInviteCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InviteCollaboratorPayload) =>
      collaboratorsApi.invite(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.all });
    },
  });
}

export function useRemoveCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (collaboratorId: string) =>
      collaboratorsApi.remove(collaboratorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collaboratorKeys.all });
    },
  });
}
