import { Op } from 'sequelize';
import { Workflow } from '../../models';
import {  
  WorkflowInterface,
  WorkflowCreationType,
  WorkflowEditRequestType,
  WorkflowCreationRequestType,
} from '../../models/workflow/IWorkflow';
import { IWorkflowService } from './IWorkflowService';
import { WorkflowErrorHandler } from '../../../modules/exceptions';

class WorkflowService implements IWorkflowService {
  /**
   * Creates a new workflow
   * 
   * @param payload 
   * @returns 
   */
  public async createWorkflow (
    payload: WorkflowCreationRequestType|WorkflowCreationRequestType[]
  ): Promise<Array<Workflow>> {
    try {
      if( ! Array.isArray(payload) ){
        payload = [payload];
      }

      const workflow = Promise.all(
        payload.map( async (payload) => {
          const [title, slug] = Array(2).fill(payload.title);
          return await Workflow.create({ ...payload, title, slug });
        })
      )
      
      return workflow;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sudo Implementation for model findOrCreate (WIP)
   * 
   * @param searchParams 
   * @param payload 
   * @returns 
   */
  public async findOrCreate(
    searchParams: Array<string>, payload: WorkflowCreationType
  ): Promise<Workflow> {
    const search = searchParams.reduce( (result: {[x: string]: string}, param)=>{
      result[param] = param;

      return result;
    }, {} as {[x: string]: string})

    try{
      Workflow.findOne({
        where: {
          [Op.or]: search
        }
      })
    }
    catch(err) {
      try{
        return await Workflow.create(payload);
      }
      catch(err) {
        throw err;
      }
    }
  }

  /**
   * Update an existing worklfow
   * 
   * @param workflowId 
   * @param payload 
   * @returns 
   */
  public async updateWorkflow (
    workflowId: string, 
    payload: WorkflowEditRequestType
  ): Promise<Workflow> {
    try {
      const workflow = await this.findWorkflow(workflowId);

      const [title, slug] = Array(2).fill(payload.title || workflow.title);
      await workflow.update({...workflow, ...payload, title, slug});

      return workflow;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Fetch list of workflows
   * 
   * @returns 
   */
  public async listWorkflows (businessId: WorkflowInterface['businessId']): Promise<Array<Workflow>> {
    try {
      return await Workflow.findAll({
        where: { businessId }
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find an existing workflow
   * 
   * @param identifier 
   * @returns 
   */
  public async findWorkflow (identifier: string): Promise<Workflow> {
    try {
      const workflow = await Workflow.findOne({ 
        where: { 
          [Op.or]: [
            { slug: identifier }, 
            { title: identifier }
          ]
        }
      });

      if (!workflow) {
        return Promise.reject(new WorkflowErrorHandler(WorkflowErrorHandler.NotExist));
      }
      
      return workflow;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Delete an existing workflow
   * 
   * @param workflowId 
   * @returns 
   */
  public async deleteWorkflow (workflowId: string): Promise<void> {
    try {
      const workflow = await this.findWorkflow(workflowId);
      await workflow.destroy();
      
      return;
    } catch (err) {
      throw err;
    }
  }
}

const workflowService = new WorkflowService();
export default workflowService;