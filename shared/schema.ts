import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  guardianName: text("guardian_name"),
  guardianPhone: text("guardian_phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const onboardingData = pgTable("onboarding_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  usesProduct: text("uses_product").notNull(),
  surgeryDate: text("surgery_date"),
  activationDate: text("activation_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  appointmentDate: text("appointment_date").notNull(),
  doctorName: text("doctor_name").notNull(),
  notes: text("notes"),
  audiogramUrl: text("audiogram_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const beneficiaryProfiles = pgTable("beneficiary_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Insured Name
  insuredFirstName: text("insured_first_name").notNull(),
  insuredLastName: text("insured_last_name").notNull(),
  
  // Beneficiary Name
  beneficiaryFirstName: text("beneficiary_first_name").notNull(),
  beneficiaryMiddleName: text("beneficiary_middle_name"),
  beneficiaryLastName: text("beneficiary_last_name").notNull(),
  beneficiarySuffix: text("beneficiary_suffix"),
  
  // Details
  beneficiaryDob: text("beneficiary_dob").notNull(),
  beneficiaryGender: text("beneficiary_gender").notNull(),
  
  // Address
  addressStreet: text("address_street").notNull(),
  addressLine2: text("address_line2"),
  addressCity: text("address_city").notNull(),
  addressState: text("address_state").notNull(),
  addressZip: text("address_zip").notNull(),
  addressCountry: text("address_country").notNull(),
  
  // Other
  relationshipToInsured: text("relationship_to_insured").notNull(),
  allocation: text("allocation").notNull(),
  addBeneficiary2: text("add_beneficiary_2").default("no"),
  totalAllocation: text("total_allocation"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionnaireResponses = pgTable("questionnaire_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  q1_education: text("q1_education"),
  q2_work: text("q2_work"),
  q3_hobbies: text("q3_hobbies"),
  q4_siblings: text("q4_siblings"),
  q5_importance: text("q5_importance"),
  q6_expectations: text("q6_expectations"),
  q7_commitment_medical: text("q7_commitment_medical"),
  q8_education_support: text("q8_education_support"),
  q9_caregiver: text("q9_caregiver"),
  q10_challenges: text("q10_challenges"),
  q11_instruction_readiness: text("q11_instruction_readiness"),
  q12_commitment_level: text("q12_commitment_level"),
  audioRecordingUrl: text("audio_recording_url"),
  isDraft: text("is_draft").default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // e.g., 'application_form', 'passport', etc.
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  status: text("status").default("pending").notNull(), // pending, submitted, approved, missing
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  date: text("date").notNull(),
  score: text("score"),
  notes: text("notes"),
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const insertOnboardingSchema = createInsertSchema(onboardingData).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  usesProduct: z.enum(["yes", "want_to_use"]),
  surgeryDate: z.string().optional(),
  activationDate: z.string().min(1, "Activation date is required"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  userId: true,
  createdAt: true,
  audiogramUrl: true,
}).extend({
  appointmentDate: z.string().min(1, "Appointment date is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  notes: z.string().optional(),
});

export const insertBeneficiaryProfileSchema = createInsertSchema(beneficiaryProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertQuestionnaireResponseSchema = createInsertSchema(questionnaireResponses).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  userId: true,
  createdAt: true,
  status: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type InsertOnboarding = z.infer<typeof insertOnboardingSchema>;
export type OnboardingData = typeof onboardingData.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertBeneficiaryProfile = z.infer<typeof insertBeneficiaryProfileSchema>;
export type BeneficiaryProfile = typeof beneficiaryProfiles.$inferSelect;
export type InsertQuestionnaireResponse = z.infer<typeof insertQuestionnaireResponseSchema>;
export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;
