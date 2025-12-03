import GithubSignInButton from "@/components/social-auth-buttons/github/github-sign-in-button";
import GoogleSignInButton from "@/components/social-auth-buttons/google/google-sign-in-button";
import { ThemedText } from "@/components/themed-text";
import { useToastComponent } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

export default function SignUpScreen() {
  const userSchema = z
    .object({
      firstname: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be 50 characters or less")
        .trim()
        .regex(
          /^[a-zA-Z\s-]+$/,
          "First name can only contain letters, spaces, and hyphens"
        ),

      lastname: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be 50 characters or less")
        .trim()
        .regex(
          /^[a-zA-Z\s-']+$/,
          "Last name can only contain letters, spaces, hyphens, and apostrophes"
        ),

      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be 30 characters or less")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        )
        .trim(),

      email: z
        .email({
          message: "Please enter a valid email address",
        })
        .toLowerCase()
        .trim(),

      password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    })
    .refine((data) => data.firstname !== data.lastname, {
      message: "First name and last name cannot be identical",
      path: ["lastname"],
    });

  type UserFormType = z.infer<typeof userSchema>;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {isSubmitSuccessful, errors },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.replace('/sign-in')
    }
  }, [isSubmitSuccessful, reset]);

  const { showToast } = useToastComponent();

  const onSubmit: SubmitHandler<UserFormType> = async (data: UserFormType) => {
    setIsLoading(true);
    try {
      const trimmedFirstName = data.firstname.trim();
      const trimmedLastName = data.lastname.trim();
      const trimmedUsername = data.username.trim();
      const normalizedEmail = data.email.trim();

      const { data: session , error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: {
          data: {
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            username: trimmedUsername,
          },
        },
      });

      if (error) {
        showToast({ title: "Error!", description: `${error.message}`, action: "error" });
        console.error("Error during sign-up:", error);
      }

      if (session) {
        showToast({
          title: "Success!",
          description:
            "Please check your inbox to verify your email before signing in.",
          action: "success",
        });
      }

    } catch (caughtError) {
      console.error("Error during sign-up:", caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.formCard}>

        <View style={styles.formContent}>
          {/* Firstname Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "red" : "default" },
                  ]}
                >
                  <Ionicons name="person" size={20} color="#9CA3AF" />
                  <TextInput
                    style={[styles.input]}
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
            name="firstname"
          />
          {errors.firstname && (
            <Text style={{ color: "#ff8566" }}>{errors.firstname.message}</Text>
          )}

          {/* Lastname Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "red" : "default" },
                  ]}
                >
                  <Ionicons name="person" size={20} color="#9CA3AF" />
                  <TextInput
                    style={[styles.input]}
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
            name="lastname"
          />
          {errors.lastname && (
            <Text style={{ color: "#ff8566" }}>{errors.lastname.message}</Text>
          )}

          {/* Username Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: error ? "red" : "default" },
                  ]}
                >
                  <Ionicons name="person" size={20} color="#9CA3AF" />
                  <TextInput
                    style={[styles.input]}
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
            name="username"
          />
          {errors.username && (
            <Text style={{ color: "#ff8566" }}>{errors.username.message}</Text>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View style={styles.inputGroup}>
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
              </View>
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
              <View style={styles.inputGroup}>
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
              </View>
            )}
            name="password"
          />
          {errors.password && (
            <Text style={{ color: "#ff8566" }}>{errors.password.message}</Text>
          )}

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              {/* <Text style={styles.forgotPasswordText}>Forgot password?</Text> */}
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.2}
            accessibilityState={{ disabled: isLoading, busy: isLoading }}
          >
            <Text style={styles.loginButtonText}>Sign up</Text>
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
            Already have an account?{" "}
            <TouchableOpacity onPress={() => router.navigate('/sign-in')}>
              <ThemedText style={styles.signupLink}>Sign in</ThemedText>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScrollView>
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