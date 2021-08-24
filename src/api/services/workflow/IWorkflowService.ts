import { Workflow } from "../../../api/models";
import { 
    WorkflowEditRequestType,
    WorkflowInterface,
    WorkflowCreationType,
    WorkflowCreationRequestType
} from "../../../api/models/workflow/IWorkflow";

export interface IWorkflowService {
    /**
     * Creates a new workflow
     * 
     * @param payload 
     * @returns 
     */
    createWorkflow (
        payload: WorkflowCreationRequestType|WorkflowCreationRequestType[]
    ):  Promise<Array<Workflow>>

    /**
     * Sudo Implementation for model findOrCreate (WIP)
     * 
     * @param searchParams 
     * @param payload 
     * @returns 
     */
    findOrCreate? (
        searchParams: Array<string>, payload: WorkflowCreationType
    ):  Promise<Workflow>

    /**
     * Update an existing worklfow
     * 
     * @param workflowId 
     * @param payload 
     * @returns 
     */
    updateWorkflow (
        workflowId: WorkflowInterface['id'], 
        payload: WorkflowEditRequestType
    ):  Promise<Workflow>

    /**
     * Fetch list of workflows
     * 
     * @returns 
     */
    listWorkflows (businessId: WorkflowInterface['businessId']): Promise<Array<Workflow>>

    /**
     * Find an existing workflow
     * 
     * @param identifier 
     * @returns 
     */
    findWorkflow (identifier: string): Promise<Workflow>

    /**
     * Delete an existing workflow
     * 
     * @param workflowId 
     * @returns 
     */
    deleteWorkflow (workflowId: string): Promise<void>
}