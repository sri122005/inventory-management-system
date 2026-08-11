import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiError } from "@/lib/api";
import type { Record_ } from "@/lib/records";
import { services, type Entity } from "@/services";

/** Client-side only: the Spring Boot API lives on the user's machine. */
export function useResourceList(entity: Entity, enabled = true) {
  return useQuery({
    queryKey: [entity],
    queryFn: () => services[entity].list(),
    enabled,
    retry: false,
    staleTime: 15_000,
  });
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

type MutationOptions = {
  successMessage: string;
  /** Extra query keys to refresh (e.g. inventory after a purchase). */
  invalidate?: Entity[];
  onDone?: () => void;
};

export function useResourceMutations(entity: Entity, options: MutationOptions) {
  const queryClient = useQueryClient();
  const service = services[entity];

  const refresh = async () => {
    const keys = new Set<Entity>([entity, ...(options.invalidate ?? [])]);
    await Promise.all(
      [...keys].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    );
  };

  const save = useMutation({
    mutationFn: ({ id, payload }: { id?: string | undefined; payload: Record_ }) =>
      id ? service.update(id, payload) : service.create(payload),
    onSuccess: async (_data, variables) => {
      await refresh();
      toast.success(variables.id ? `${options.successMessage} updated` : options.successMessage);
      options.onDone?.();
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: async () => {
      await refresh();
      toast.success("Record deleted successfully");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return { save, remove, refresh };
}
