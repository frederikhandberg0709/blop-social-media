import { ProfileNotificationSettingsProps } from "@/types/NotificationProps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useProfileNotificationSettings(targetProfileId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["profileNotificationSettings", targetProfileId];

  const [localSettings, setLocalSettings] =
    useState<ProfileNotificationSettingsProps>({
      mainOption: "disable",
      newPost: false,
      reply: false,
      share: false,
      targetProfileId: targetProfileId,
    });

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(
        `/api/notifications/profile-notification-settings/${targetProfileId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile notification settings");
      }

      const data = await response.json();

      if (data) {
        return {
          mainOption: data.notificationType.toLowerCase(),
          newPost: data.notifyNewPosts,
          reply: data.notifyReplies,
          share: data.notifyShares,
          targetProfileId,
        };
      }

      return {
        mainOption: "disable",
        newPost: false,
        reply: false,
        share: false,
        targetProfileId,
      };
    },
  });

  useEffect(() => {
    if (query.data) {
      setLocalSettings(query.data);
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: async (settings: ProfileNotificationSettingsProps) => {
      const response = await fetch(
        "/api/notifications/profile-notification-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save profile notification settings");
      }
      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    settings: localSettings,
    updateLocalSettings: setLocalSettings,
    saveSettings: mutation.mutate,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
  };
}
