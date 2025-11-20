import { Router, Request, Response } from 'express';
import { getSDKClient } from '../services/sdk-client.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults:
 *   get:
 *     summary: Get all vaults for a workspace
 *     description: Retrieves all vaults (answer pools) for a workspace
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *     responses:
 *       200:
 *         description: Vaults retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vault'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/vaults', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid } = req.params;
    const client = await getSDKClient();
    const vaults = await client.getAllVaults(workspaceUuid);
    res.json(vaults);
  } catch (error: any) {
    logger.error('Error getting vaults:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get vaults',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/placeholders:
 *   get:
 *     summary: Get vault placeholders (template structure)
 *     description: Retrieves the template structure (placeholders) for a specific vault
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *     responses:
 *       200:
 *         description: Vault placeholders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/vaults/:vaultId/placeholders', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, vaultId } = req.params;
    const client = await getSDKClient();
    const placeholders = await client.getVaultPlaceholders(workspaceUuid, vaultId);
    res.json(placeholders);
  } catch (error: any) {
    logger.error('Error getting vault placeholders:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get vault placeholders',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/answers:
 *   get:
 *     summary: Get vault answers (decrypted)
 *     description: Retrieves vault answers with decrypted inline content
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *     responses:
 *       200:
 *         description: Vault answers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:workspaceUuid/vaults/:vaultId/answers', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, vaultId } = req.params;
    const client = await getSDKClient();
    const answers = await client.getVaultAnswers(workspaceUuid, vaultId);
    res.json(answers);
  } catch (error: any) {
    logger.error('Error getting vault answers:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to get vault answers',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/answers:
 *   put:
 *     summary: Save vault answers
 *     description: Encrypts and saves modified vault answers (only entries with new_content will be updated)
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 description: List of vault answers to save
 *                 items:
 *                   type: object
 *             required:
 *               - answers
 *           example:
 *             answers:
 *               - uuid: "answer-uuid"
 *                 new_content: "Updated content"
 *     responses:
 *       200:
 *         description: Answers saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request
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
router.put('/:workspaceUuid/vaults/:vaultId/answers', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, vaultId } = req.params;
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'answers must be an array',
      });
    }

    const client = await getSDKClient();
    await client.saveVaultAnswers(workspaceUuid, vaultId, answers);
    res.json({ success: true, message: 'Answers saved successfully' });
  } catch (error: any) {
    logger.error('Error saving vault answers:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to save vault answers',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/files/{fileUuid}:
 *   get:
 *     summary: Download a vault file
 *     description: Downloads and decrypts a file from a vault
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *       - $ref: '#/components/parameters/FileUuid'
 *       - name: mimetype
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The MIME type of the file
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid request (mimetype missing)
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
router.get('/:workspaceUuid/vaults/:vaultId/files/:fileUuid', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, fileUuid } = req.params;
    const { mimetype } = req.query;
    
    if (!mimetype || typeof mimetype !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'mimetype query parameter is required',
      });
    }

    const client = await getSDKClient();
    const blob = await client.downloadVaultFile(workspaceUuid, fileUuid, mimetype);
    
    // Convert Blob to Buffer for Express response
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${fileUuid}"`);
    res.send(buffer);
  } catch (error: any) {
    logger.error('Error downloading vault file:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to download vault file',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/lock:
 *   post:
 *     summary: Lock a vault
 *     description: Locks a vault to prevent concurrent modifications
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *     responses:
 *       200:
 *         description: Vault locked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:workspaceUuid/vaults/:vaultId/lock', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, vaultId } = req.params;
    const client = await getSDKClient();
    await client.lockVault(workspaceUuid, vaultId);
    res.json({ success: true, message: 'Vault locked successfully' });
  } catch (error: any) {
    logger.error('Error locking vault:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to lock vault',
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/workspaces/{workspaceUuid}/vaults/{vaultId}/unlock:
 *   post:
 *     summary: Unlock a vault
 *     description: Unlocks a vault to allow modifications
 *     tags: [Vaults]
 *     parameters:
 *       - $ref: '#/components/parameters/WorkspaceUuid'
 *       - $ref: '#/components/parameters/VaultId'
 *     responses:
 *       200:
 *         description: Vault unlocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:workspaceUuid/vaults/:vaultId/unlock', async (req: Request, res: Response) => {
  try {
    const { workspaceUuid, vaultId } = req.params;
    const client = await getSDKClient();
    await client.unlockVault(workspaceUuid, vaultId);
    res.json({ success: true, message: 'Vault unlocked successfully' });
  } catch (error: any) {
    logger.error('Error unlocking vault:', error);
    res.status(error?.response?.status || 500).json({
      error: 'Failed to unlock vault',
      message: error.message,
    });
  }
});

export default router;

