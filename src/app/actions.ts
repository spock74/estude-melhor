"use server";

import {
  timeAllocationGuidance,
  type TimeAllocationGuidanceInput,
} from "@/ai/flows/time-allocation-guidance";

export async function getGuidance(input: TimeAllocationGuidanceInput) {
  try {
    const result = await timeAllocationGuidance(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in getGuidance action:", error);
    return {
      success: false,
      error: "Não foi possível obter a orientação da IA. Tente novamente mais tarde.",
    };
  }
}
