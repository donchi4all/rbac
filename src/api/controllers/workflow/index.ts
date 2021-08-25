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


@Route('workflow')
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

  @Put('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async updateWorkflow(
    @Body() requestBody: WorkflowCreationRequestType
  ): Promise<Workflow> {
    try {
      return await workflowService.updateWorkflow(requestBody.title, requestBody);
    } catch (err) {
      this.log.error(`Route /workflow POST with err: ${err}`);
      throw err;
    }
  }

  @Get('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async listWorkflows(
    @Body() requestBody: { title: string }
  ): Promise<Workflow[]> {
    try {
      return await workflowService.listWorkflows(requestBody.title);
    } catch (err) {
      this.log.error(`Route /workflow POST with err: ${err}`);
      throw err;
    }
  }

  @Get('{id}')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async findWorkflow ( id: string ): Promise<Workflow> {
    try{
      return await workflowService.findWorkflow(id);
    } catch (err) {
      this.log.error(`Failed to find beneficiary with id: ${id}`, err);
      throw err;
    }
  }

  @Delete('/')
  @SuccessResponse(httpStatuses.success.code, httpStatuses.success.message)
  public async deleteWorkflow(
    @Body() requestBody: { title: string }
  ): Promise<void> {
    try {
      return await workflowService.deleteWorkflow(requestBody.title);
    } catch (err) {
      this.log.error(`Route /workflow DELETE with err: ${err}`);
      throw err;
    }
  }
}