import { Router, Request, Response } from 'express';
import { getSDKClient } from '../services/sdk-client.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}:
 *   get:
 *     summary: Get workspace details
 *     description: Retrieves detailed information about a workspace including UUID, URL, name, business type, and public key
 *     tags: [Workspaces]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *     responses:
 *       200:
 *         description: Workspace details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkspaceDetails'
 *       404:
 *         description: Workspace not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid } = req.params;
    const client = await getSDKClient();
    const details = await client.getWorkspaceDetails(workspaceUuid);
    res.json(details);
  } catch (error: any) {
    logger.error('Error getting workspace details:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get workspace details',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/business-types:
 *   get:
 *     summary: Get business types for a workspace
 *     description: Retrieves available business types for a workspace, optionally filtered by available_for_business_type
 *     tags: [Workspaces]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - name: available_for_business_type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional filter for business types available for a specific business type
 *     responses:
 *       200:
 *         description: Business types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BusinessType'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/business-types', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid } = req.params;
    const { available_for_business_type } = req.query;
    const client = await getSDKClient();
    const businessTypes = await client.getBusinessTypes(
      workspaceUuid,
      available_for_business_type as string | undefined
    );
    res.json(businessTypes);
  } catch (error: any) {
    logger.error('Error getting business types:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get business types',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/relations:
 *   get:
 *     summary: Get relations for a workspace
 *     description: Retrieves active relations for a workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *     responses:
 *       200:
 *         description: Relations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Relation'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/relations', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid } = req.params;
    const client = await getSDKClient();
    const relations = await client.getRelations(workspaceUuid);
    res.json(relations);
  } catch (error: any) {
    logger.error('Error getting relations:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get relations',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/network:
 *   get:
 *     summary: Get network entries for a workspace
 *     description: Retrieves network entries for a workspace, optionally filtered by business type
 *     tags: [Workspaces]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - name: business_type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional filter by business type
 *     responses:
 *       200:
 *         description: Network entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NetworkEntry'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/network', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid } = req.params;
    const { business_type } = req.query;
    const client = await getSDKClient();
    const networkEntries = await client.getNetworkEntries(
      workspaceUuid,
      business_type as string | undefined
    );
    res.json(networkEntries);
  } catch (error: any) {
    logger.error('Error getting network entries:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get network entries',
      message: error.message,
    });
  }
});

export default router;

