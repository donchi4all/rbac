import {
  Get,
  Put,
  Body,
  Post,
  Route,
  Hidden,
  Delete,
  Controller,
  SuccessResponse,
} from 'tsoa';

import { Workflow } from '../../../api/models';
import httpStatuses from '../../httpStatuses';
import workflowService from '../../services/workflow';
import { LoggerDecorator, LoggerInterface } from '../../../modules/logger';
import { WorkflowCreationRequestType } from '../../../api/models/workflow/IWorkflow';


@Route('{business}/workflow')
export class workflowController extends Controller {
  /**
   * Initialize logger
   */
  @LoggerDecorator('Controller.Workflow')
  private log: LoggerInterface;

  /**
   * Workflow Creation endpoint
   * 
   * @param requestBody 
   * @returns 
   */
  @Post('/')
  @SuccessResponse(httpStatuses.created.code, httpStatuses.created.message)
  public async createWorkflow(
    @Body() requestBody: WorkflowCreationRequestType
  ): Promise<Workflow[]> {
    try {
      return await workflowService.createWorkflow(requestBody);
    } catch (err) {
      this.log.error(`Route /workflow POST with err: ${err}`);
      throw err;
    }
  }

  @Put('{workflowIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateWorkflow(
    workflowIdentifier: string,
    @Body() requestBody: WorkflowCreationRequestType
  ): Promise<Workflow> {
    try {
      return await workflowService.updateWorkflow(workflowIdentifier, requestBody);
    } catch (err) {
      this.log.error(`Route /workflow POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listWorkflows(business: string): Promise<Workflow[]> {
    try {
      return await workflowService.listWorkflows(business);
    } catch (err) {
      this.log.error(`Route /workflow POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{workflowIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findWorkflow ( workflowIdentifier: string ): Promise<Workflow> {
    try{
      return await workflowService.findWorkflow(workflowIdentifier);
    } catch (err) {
      this.log.error(`Failed to find beneficiary with workflowIdentifier: ${workflowIdentifier}`, err);
      throw err;
    }
  }

  @Delete('{workflowIdentifier}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteWorkflow(workflowIdentifier: string): Promise<void> {
    try {
      return await workflowService.deleteWorkflow(workflowIdentifier);
    } catch (err) {
      this.log.error(`Route /workflow DELETE with err: ${err}`);
      throw err;
    }
  }
}