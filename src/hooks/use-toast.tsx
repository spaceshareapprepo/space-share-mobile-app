import { cn } from "@/lib/utils";
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from "@/components/ui/hstack";
import { CloseIcon, HelpCircleIcon, Icon } from "@/components/ui/icon";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui/toast';
import { VStack } from "@/components/ui/vstack";
import { useState } from 'react';
import {
  Pressable
} from "react-native";

export function useToastComponent() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);

  type ToastOptions = {
    title?: string;
    description: string;
    action?: "error" | "warning" | "success" | "info" | "muted";
    variant?: "solid" | "outline";
    duration?: number;
    actionLabel?: string;
    onActionPress?: () => void;
    className?: string;
    hasActionButton?: boolean;
  };

  const showToast = ({
    title = "Notice",
    description,
    action = "info",
    variant = "outline",
    duration = 3000,
    actionLabel = "Close",
    onActionPress,
    className,
    hasActionButton,
  }: ToastOptions) => {
    const newId = Math.random();
    setToastId(newId);

    toast.show({
      id: newId as any,
      placement: "top",
      duration,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        const actionClasses: Record<string, string> = {
          error: "border-error-500",
          warning: "border-warning-500",
          success: "border-success-500",
          info: "border-info-500",
          muted: "border-outline-100",
        };
        return (
          <Toast
            action={action}
            variant={variant}
            nativeID={uniqueToastId}
            className={cn(
              "p-4 gap-6 w-full shadow-hard-5 max-w-[443px] flex-row justify-between",
              actionClasses[action],
              className
            )}
          >
            <HStack space="md">
              <Icon
                as={HelpCircleIcon}
                className={`mt-0.5 stroke-${action}-500`}
              />
              <VStack space="xs">
                <ToastTitle className={`font-semibold text-${action}-500`}>{title}</ToastTitle>
                <ToastDescription size="sm">{description}</ToastDescription>
              </VStack>
            </HStack>
            <HStack className="min-[450px]:gap-3 gap-1">
              {hasActionButton && (
                <Button
                  variant="link"
                  size="sm"
                  className="px-3.5 self-center"
                  onPress={onActionPress ?? (() => toast.close(id))}
                >
                  <ButtonText>{actionLabel}</ButtonText>
                </Button>
              )}
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </HStack>
          </Toast>
        );
      },
    });
  };

  return { showToast, toastId };
}
