import React, { useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from '@/components/ui/toast';
// import { BlurView } from 'expo-blur';
import GithubSignInButton from "@/components/social-auth-buttons/github/github-sign-in-button";
import GoogleSignInButton from "@/components/social-auth-buttons/google/google-sign-in-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";

// For icons, you'll need: expo install react-native-vector-icons
// or use expo-vector-icons (comes with Expo)
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon, CloseIcon, HelpCircleIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const userSchema = z.object({
    email: z.email({ message: "Please enter a valid email address."}),
    password: z.string().min(5, { message: "Please enter at least 6 characters."})
  })

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type UserFormType = z.infer<typeof userSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
  });

  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const handleToast = (errorMessage: string) => {
    if (!toast.isActive(toastId as any)) {
      showNewToast(errorMessage);
    }
  };
  const showNewToast = (errorMessage: string) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId as any,
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <Toast
            action="error"
            variant="outline"
            nativeID={uniqueToastId}
            className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
          >
            <HStack space="md">
              <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
              <VStack space="xs">
                <ToastTitle className="font-semibold text-error-500">
                  Error!
                </ToastTitle>
                <ToastDescription size="sm">
                  {errorMessage}.
                </ToastDescription>
              </VStack>
            </HStack>
            <HStack className="min-[450px]:gap-3 gap-1">
              <Button variant="link" size="sm" className="px-3.5 self-center">
                <ButtonText>Retry</ButtonText>
              </Button>
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </HStack>
          </Toast>
        );
      },
    });
  };

  const onSubmit: SubmitHandler<UserFormType> = async (data: UserFormType) => {
    console.log(data);
    try {
      const normalizedEmail = data.email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: data.password,
      });

      if (error) {
        handleToast(error.message);
         console.error("Error during sign-in:", error);
      }
     
    } catch (caughtError) {
      console.error("Error during sign-in:", caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top decorative section */}
      <View style={styles.topSection}>
        <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
        <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <MaterialCommunityIcons
              name="airplane"
              size={24}
              color="#000"
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>
          <Text style={styles.logoText}>
            Space<Text style={styles.logoAccent}>Share</Text>
          </Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>back</Text>
        </View>
      </View>

      {/* Login Form Card */}
      <View style={styles.formCard}>

        <View style={styles.formContent}>
          {/* Email Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <ThemedView style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "red" : "default" },
                  ]}
                >
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    style={[styles.input]}
                    placeholder="your@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </ThemedView>
            )}
            name="email"
          />
          {errors.email && (
            <Text style={{ color: "#ff8566" }}>{errors.email.message}</Text>
          )}

          {/* Password Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <ThemedView style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "red" : "default" },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </ThemedView>
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ color: "#ff8566" }}>{errors.password.message}</Text>
          )}

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.2}
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            <Text style={styles.loginButtonText}>Sign in</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <GoogleSignInButton label="Google" />
            <GithubSignInButton label="Github" />
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <ThemedText style={styles.signupLink} onPress={()=>router.navigate('/sign-up')}>Sign up</ThemedText>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  topSection: {
    backgroundColor: "#000",
    paddingTop: 64,
    paddingBottom: 96,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle: {
    position: "absolute",
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 999,
  },
  decorativeCircle1: {
    top: 40,
    right: 40,
    width: 128,
    height: 128,
  },
  decorativeCircle2: {
    bottom: 0,
    left: 0,
    width: 160,
    height: 160,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    transform: [{ translateY: 80 }, { translateX: -80 }],
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#FBBf24",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  logoAccent: {
    color: "#FBBf24",
  },
  titleContainer: {
    marginTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#FBBf24",
  },
  formCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    marginTop: -48,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  formContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    borderWidth: 0,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#D97706",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  signupContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signupLink: {
    color: "#000",
    fontWeight: "600",
  },
});
