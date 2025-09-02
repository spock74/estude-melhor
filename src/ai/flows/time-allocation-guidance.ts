// src/ai/flows/time-allocation-guidance.ts
'use server';

/**
 * @fileOverview Provides time allocation guidance to students based on their study log from the previous week.
 *
 * - timeAllocationGuidance - A function that recommends how to reallocate study time among disciplines.
 * - TimeAllocationGuidanceInput - The input type for the timeAllocationGuidance function, containing the study log.
 * - TimeAllocationGuidanceOutput - The return type for the timeAllocationGuidance function, containing the recommendation and rationale.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimeAllocationGuidanceInputSchema = z.object({
  studyLog: z
    .record(z.string(), z.number())
    .describe(
      'A record of study time in hours for each subject in the past week. The keys are the subject names and the values are the study hours.'
    ),
});
export type TimeAllocationGuidanceInput = z.infer<
  typeof TimeAllocationGuidanceInputSchema
>;

const TimeAllocationGuidanceOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A recommendation on how to reallocate study time among disciplines.'
    ),
  rationale: z
    .string()
    .describe(
      'A rationale for the recommendation, explaining the reasoning behind the suggested time reallocation.'
    ),
});
export type TimeAllocationGuidanceOutput = z.infer<
  typeof TimeAllocationGuidanceOutputSchema
>;

export async function timeAllocationGuidance(
  input: TimeAllocationGuidanceInput
): Promise<TimeAllocationGuidanceOutput> {
  return timeAllocationGuidanceFlow(input);
}

const timeAllocationGuidancePrompt = ai.definePrompt({
  name: 'timeAllocationGuidancePrompt',
  input: {schema: TimeAllocationGuidanceInputSchema},
  output: {schema: TimeAllocationGuidanceOutputSchema},
  prompt: `You are a study advisor for Brazilian high school students. Based on the student's study log for the past week, provide a recommendation on how to reallocate study time among disciplines, and a rationale for the recommendation.

Study Log:
{{#each studyLog}}  - {{key}}: {{value}} hours
{{/each}}`,
});

const timeAllocationGuidanceFlow = ai.defineFlow(
  {
    name: 'timeAllocationGuidanceFlow',
    inputSchema: TimeAllocationGuidanceInputSchema,
    outputSchema: TimeAllocationGuidanceOutputSchema,
  },
  async input => {
    const {output} = await timeAllocationGuidancePrompt({
      studyLog: input.studyLog,
    });
    return output!;
  }
);
