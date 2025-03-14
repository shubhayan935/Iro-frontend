"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Video, Trash2, Loader2 } from "lucide-react";
import { RecordOnboarding } from "@/components/admin/record-onboarding";
import { DeleteConfirmation } from "@/components/admin/delete-confirmation";
import {
  getAgent,
  updateAgent,
  updateAgentSteps,
  deleteStep,
  type Agent,
  type AgentUpdate,
  type OnboardingStep,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

export default function EditAgent({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAgent();
  }, []);

  const fetchAgent = async () => {
    try {
      const fetchedAgent = await getAgent(params.id);
      setAgent(fetchedAgent);
      setName(fetchedAgent.name);
      setRole(fetchedAgent.role);
      setDescription(fetchedAgent.description || "");
      setEmails(fetchedAgent.emails || []);
      // Ensure each step has an _id
      const formattedSteps = (fetchedAgent.steps || []).map((step: any) => ({
        ...step,
        _id: step._id || `step-${Math.random().toString(36).substring(2, 11)}`,
      }));
      setSteps(formattedSteps);
    } catch (error) {
      console.error("Failed to fetch agent:", error);
      toast({
        title: "Error",
        description: "Failed to load agent details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleUpdate = async () => {
    if (!agent) return;
    setIsLoading(true);

    const updatedAgent: AgentUpdate = {
      name,
      role,
      description,
      emails,
      steps,
    };

    try {
      await updateAgent(agent._id, updatedAgent);
      toast({
        title: "Success",
        description: "Agent updated successfully.",
      });
      router.push(`/admin/agents/${agent._id}`);
    } catch (error) {
      console.error("Failed to update agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleFinishRecording = (newSteps: OnboardingStep[]) => {
    setIsRecording(false);
    // Merge the new steps with the existing steps and update DB
    setSteps((prevSteps) => {
      const combined = [...prevSteps, ...newSteps];
      if (agent?._id) {
        updateStepsInDatabase(combined);
      }
      return combined;
    });
  };

  const updateStepsInDatabase = async (stepsToUpdate: OnboardingStep[]) => {
    if (!agent?._id) return;
    try {
      await updateAgentSteps(agent._id, stepsToUpdate);
      toast({
        title: "Success",
        description: "Onboarding steps updated successfully.",
      });
    } catch (error) {
      console.error("Error updating steps:", error);
    }
  };

  // Handler for reordering steps via drag and drop
  const handleReorder = async (newOrder: OnboardingStep[]) => {
    setSteps(newOrder);
    if (agent?._id) {
      updateStepsInDatabase(newOrder);
    }
  };

  // Delete step handlers
  const confirmDeleteStep = (index: number) => {
    setStepToDelete(index);
  };

  const handleDeleteStep = async () => {
    if (stepToDelete === null || !agent) return;

    const stepToRemove = steps[stepToDelete];
    const newSteps = [...steps];
    newSteps.splice(stepToDelete, 1);
    setSteps(newSteps);

    if (stepToRemove._id) {
      try {
        await deleteStep(agent._id, stepToRemove._id);
        toast({
          title: "Success",
          description: "Step deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting step:", error);
        // Revert deletion on error
        setSteps(steps);
        toast({
          title: "Error",
          description: "Failed to delete step. Please try again.",
          variant: "destructive",
        });
      }
    }
    setStepToDelete(null);
  };

  const cancelDeleteStep = () => {
    setStepToDelete(null);
  };

  if (!agent)
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading agent details...</span>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">
        Edit Agent
      </h1>
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Agent Details</CardTitle>
          <CardDescription>
            Modify your onboarding agent configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Information */}
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-muted-foreground">
                Agent Name
              </Label>
              <Input
                id="name"
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-muted-foreground">
                Role
              </Label>
              <Input
                id="role"
                placeholder="Enter agent role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter agent description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-input text-foreground"
              />
            </div>

            {/* Authorized Employee Emails */}
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Authorized Employees</Label>
              <form onSubmit={addEmail} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Add employee email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-input border-input text-foreground"
                />
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </form>
              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {emails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 bg-card text-foreground px-3 py-1 rounded-full"
                    >
                      {email}
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Onboarding Steps */}
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Onboarding Steps</Label>
              {steps.length > 0 ? (
                // Wrap the reorderable list in a scrollable container
                <div className="max-h-96 overflow-y-auto">
                  <Reorder.Group
                    axis="y"
                    values={steps}
                    onReorder={handleReorder}
                    className="rounded-md bg-muted/40 p-1 space-y-1"
                  >
                    {steps.map((step, index) => (
                      <Reorder.Item
                        key={step._id || `step-${index}`}
                        value={step}
                        whileDrag={{ scale: 1.02 }}
                        className="flex items-center p-3 rounded-md transition-colors bg-card hover:bg-muted border border-border group"
                      >
                        {/* Grip icon as a visual drag handle */}
                        <div className="mr-2 cursor-grab select-none">
                          <svg
                            className="h-5 w-5 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M4 15h16" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                            {step.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDeleteStep(index)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Delete step"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No onboarding steps recorded yet.
                </p>
              )}
              <Button variant="outline" onClick={handleStartRecording} className="mt-2">
                <Video className="mr-2 h-4 w-4" />
                Record Onboarding
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/agents/${agent._id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isRecording && (
        <RecordOnboarding onFinish={handleFinishRecording} agentId={agent._id} />
      )}

      <DeleteConfirmation
        isOpen={stepToDelete !== null}
        title="Delete Onboarding Step"
        description="Are you sure you want to delete this step? This action cannot be undone."
        onConfirm={handleDeleteStep}
        onCancel={cancelDeleteStep}
      />
    </div>
  );
}
